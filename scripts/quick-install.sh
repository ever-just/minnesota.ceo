#!/bin/bash

set -e

echo "Quick PeerTube Installation - app.minnesota.ceo"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INSTALL]${NC} $1"
}

# Skip system upgrade to save time
print_status "Installing essential packages..."
apt update
apt install -y curl sudo unzip vim git cron wget software-properties-common

# Install Node.js 20.x
print_status "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Yarn
print_status "Installing Yarn..."
npm install -g yarn

# Install build tools and media
print_status "Installing build tools and FFmpeg..."
apt install -y python3-dev python3-pip python-is-python3 g++ make ffmpeg

# Install web server and databases
print_status "Installing Nginx, PostgreSQL, Redis..."
apt install -y nginx postgresql postgresql-contrib redis-server openssl

# Install certbot
print_status "Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx

# Generate secure password
DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/")
echo "DB_PASSWORD=$DB_PASSWORD" > /root/.peertube-db-password

# Configure PostgreSQL
print_status "Configuring PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS peertube_prod;
DROP USER IF EXISTS peertube;
CREATE USER peertube WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE peertube_prod OWNER peertube;
GRANT ALL PRIVILEGES ON DATABASE peertube_prod TO peertube;
\q
EOF

# Configure Redis
print_status "Configuring Redis..."
systemctl start redis-server
systemctl enable redis-server

# Create peertube user
print_status "Creating PeerTube user..."
if ! id "peertube" &>/dev/null; then
    adduser --system --home /var/www/peertube --shell /bin/bash --group peertube
fi

# Configure firewall
print_status "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable || true

print_status "Base installation complete!"
print_status "Database password saved in: /root/.peertube-db-password"
print_status "Ready for PeerTube installation!"
