#!/bin/bash

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARNING:${NC} $1"
}

# Generate secure password for database
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-16)
echo "DB_PASSWORD=$DB_PASSWORD" > /root/.peertube-credentials

print_status "Starting PeerTube installation for app.minnesota.ceo"

# Phase 1: System Update and Basic Setup
print_status "Phase 1: System Update and Basic Setup"
apt update
apt upgrade -y

# Create peertube user
print_status "Creating PeerTube system user..."
if ! id "peertube" &>/dev/null; then
    adduser --system --home /var/www/peertube --shell /bin/bash --group peertube
fi

# Configure firewall
print_status "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# Phase 2: Install Dependencies
print_status "Phase 2: Installing Dependencies"

# Install essential packages
print_status "Installing essential packages..."
apt install -y curl sudo unzip vim git cron wget software-properties-common

# Install Node.js 20.x
print_status "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Yarn
print_status "Installing Yarn..."
npm install -g yarn

# Install build tools
print_status "Installing build tools..."
apt install -y python3-dev python3-pip python-is-python3 g++ make

# Install media tools (FFmpeg)
print_status "Installing FFmpeg..."
apt install -y ffmpeg

# Install web server
print_status "Installing Nginx..."
apt install -y nginx

# Install Let's Encrypt
print_status "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Install databases
print_status "Installing PostgreSQL and Redis..."
apt install -y postgresql postgresql-contrib redis-server

# Install other requirements
apt install -y openssl

# Phase 3: Database Configuration
print_status "Phase 3: Database Configuration"

# Configure PostgreSQL
print_status "Configuring PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE USER peertube WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE peertube_prod OWNER peertube;
GRANT ALL PRIVILEGES ON DATABASE peertube_prod TO peertube;
\q
EOF

# Configure Redis
print_status "Configuring Redis..."
systemctl start redis-server
systemctl enable redis-server

# Test Redis
redis-cli ping > /dev/null 2>&1 && print_status "Redis is working correctly" || print_error "Redis test failed"

# Phase 4: PeerTube Installation
print_status "Phase 4: PeerTube Installation"

# Create directories
mkdir -p /var/www/peertube
chown -R peertube:peertube /var/www/peertube

# Clone PeerTube as peertube user
print_status "Downloading PeerTube..."
su - peertube -c "
cd /var/www/peertube
VERSION=\$(curl -s https://api.github.com/repos/chocobozzz/PeerTube/releases/latest | grep tag_name | cut -d '\"' -f 4)
echo \"Installing PeerTube version: \$VERSION\"
git clone -b \$VERSION https://github.com/Chocobozzz/PeerTube.git .
"

# Install dependencies and build
print_status "Installing PeerTube dependencies (this may take 5-10 minutes)..."
su - peertube -c "
cd /var/www/peertube
yarn install --production --pure-lockfile
"

print_status "Building PeerTube (this may take 5-10 minutes)..."
su - peertube -c "
cd /var/www/peertube
npm run build -- --light
"

# Create storage directories
print_status "Creating storage directories..."
su - peertube -c "
mkdir -p /var/www/peertube/storage/{tmp,avatars,videos,streaming-playlists,redundancy,logs,previews,thumbnails,torrents,captions,cache,plugins}
"

# Copy and configure production.yaml
print_status "Configuring PeerTube..."
su - peertube -c "
cd /var/www/peertube
cp config/production.yaml.example config/production.yaml
"

# Update production.yaml with our settings
cat > /var/www/peertube/config/production.yaml << EOF
listen:
  hostname: 'localhost'
  port: 9000

webserver:
  https: true
  hostname: 'app.minnesota.ceo'
  port: 443

trust_proxy:
  - 'loopback'

database:
  hostname: 'localhost'
  port: 5432
  ssl: false
  suffix: '_prod'
  username: 'peertube'
  password: '${DB_PASSWORD}'
  pool:
    max: 5

redis:
  hostname: 'localhost'
  port: 6379
  auth: null
  db: 0

smtp:
  hostname: null
  port: 465
  username: null
  password: null
  tls: true
  disable_starttls: false
  ca_file: null
  from_address: 'admin@app.minnesota.ceo'

email:
  body:
    signature: "PeerTube"
  subject:
    prefix: "[PeerTube]"

storage:
  tmp: '/var/www/peertube/storage/tmp/'
  avatars: '/var/www/peertube/storage/avatars/'
  videos: '/var/www/peertube/storage/videos/'
  streaming_playlists: '/var/www/peertube/storage/streaming-playlists/'
  redundancy: '/var/www/peertube/storage/redundancy/'
  logs: '/var/www/peertube/storage/logs/'
  previews: '/var/www/peertube/storage/previews/'
  thumbnails: '/var/www/peertube/storage/thumbnails/'
  torrents: '/var/www/peertube/storage/torrents/'
  captions: '/var/www/peertube/storage/captions/'
  cache: '/var/www/peertube/storage/cache/'
  plugins: '/var/www/peertube/storage/plugins/'
  client_overrides: '/var/www/peertube/storage/client-overrides/'

log:
  level: 'warn'
  log_ping_requests: false
  log_http_requests: false

federation:
  enabled: false

signup:
  enabled: false
  limit: 10
  requires_email_verification: true

user:
  video_quota: 5368709120  # 5GB
  video_quota_daily: -1

transcoding:
  enabled: false  # Disabled due to resource constraints
  allow_additional_extensions: false
  allow_audio_files: false
  threads: 1

cache:
  previews:
    size: 100
  captions:
    size: 50

instance:
  name: 'Minnesota CEO PeerTube'
  short_description: 'Private video platform for Minnesota CEO'
  description: 'A standalone PeerTube instance for Minnesota CEO interviews and content'
  terms: 'Terms of Service'
  code_of_conduct: ''
  moderation_information: ''
  creation_reason: ''
  administrator: 'EVERJUST Company'
  maintenance_lifetime: ''
  business_model: ''
  hardware_information: ''
  languages:
    - 'en'
  categories:
    - 15  # Science & Technology
  default_client_route: '/videos/recently-added'
  is_nsfw: false
  default_nsfw_policy: 'do_not_list'
  customizations:
    javascript: ''
    css: ''

services:
  twitter:
    username: ''
    whitelisted: false

followers:
  instance:
    enabled: false
    manual_approval: false

followings:
  instance:
    auto_follow_back:
      enabled: false
    auto_follow_index:
      enabled: false
EOF

chown peertube:peertube /var/www/peertube/config/production.yaml

print_status "PeerTube configuration completed"

print_status "PeerTube installation completed successfully!"
print_status "Database password saved in: /root/.peertube-credentials"
print_status "Next steps: Configure Nginx and SSL certificates"
