#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[PEERTUBE]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Read database password
if [ -f /root/.peertube-db-password ]; then
    source /root/.peertube-db-password
else
    print_warning "Database password file not found, using default"
    DB_PASSWORD="peertube_secure_pass_2024"
fi

print_status "Starting PeerTube installation..."

# Create directories
mkdir -p /var/www/peertube
chown -R peertube:peertube /var/www/peertube

# Clone PeerTube
print_status "Downloading PeerTube (latest stable version)..."
cd /var/www/peertube

# Get latest version
VERSION=$(curl -s https://api.github.com/repos/chocobozzz/PeerTube/releases/latest | grep tag_name | cut -d '"' -f 4)
print_status "Installing PeerTube version: $VERSION"

# Clone as peertube user
su - peertube -c "
cd /var/www/peertube
git clone -b $VERSION https://github.com/Chocobozzz/PeerTube.git . || true
"

# Install dependencies
print_status "Installing Node.js dependencies (this will take 5-10 minutes)..."
su - peertube -c "
cd /var/www/peertube
yarn install --production --pure-lockfile
"

# Build PeerTube
print_status "Building PeerTube (this will take 5-10 minutes)..."
su - peertube -c "
cd /var/www/peertube
npm run build -- --light
"

# Create storage directories
print_status "Creating storage directories..."
su - peertube -c "
mkdir -p /var/www/peertube/storage/{tmp,avatars,videos,streaming-playlists,redundancy,logs,previews,thumbnails,torrents,captions,cache,plugins,client-overrides}
"

# Create production configuration
print_status "Creating PeerTube configuration..."
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
    signature: "Minnesota CEO PeerTube"
  subject:
    prefix: "[Minnesota CEO]"

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
  level: 'info'
  log_ping_requests: false
  log_http_requests: false

search:
  remote_uri:
    users: false
    anonymous: false
  search_index:
    enabled: false

federation:
  enabled: false

signup:
  enabled: false
  limit: 10
  requires_email_verification: false

user:
  video_quota: 10737418240  # 10GB per user
  video_quota_daily: -1

transcoding:
  enabled: false  # Disabled due to resource constraints
  allow_additional_extensions: false
  allow_audio_files: false
  threads: 1
  
import:
  videos:
    http:
      enabled: true
    torrent:
      enabled: false

cache:
  previews:
    size: 100
  captions:
    size: 50

instance:
  name: 'Minnesota CEO'
  short_description: 'Private video platform for Minnesota CEO interviews'
  description: 'A standalone PeerTube instance for Minnesota CEO leadership interviews and exclusive content'
  terms: 'Private platform - authorized users only'
  code_of_conduct: ''
  moderation_information: 'Content is moderated by administrators'
  creation_reason: 'Private video hosting for Minnesota CEO platform'
  administrator: 'EVERJUST Company'
  maintenance_lifetime: ''
  business_model: ''
  hardware_information: 'DigitalOcean Droplet - 2GB RAM, 1 vCPU'
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

print_status "PeerTube installation completed!"
print_status "Next steps:"
print_status "1. Configure Nginx"
print_status "2. Get SSL certificate" 
print_status "3. Start PeerTube service"
