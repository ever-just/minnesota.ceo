#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[SYSTEMD]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Creating PeerTube systemd service..."

# Create systemd service file
cat > /etc/systemd/system/peertube.service << 'SYSTEMD_CONFIG'
[Unit]
Description=PeerTube daemon
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
Environment=NODE_ENV=production
Environment=NODE_CONFIG_DIR=/var/www/peertube/config
User=peertube
Group=peertube
WorkingDirectory=/var/www/peertube
ExecStart=/usr/bin/node dist/server
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=peertube

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/var/www/peertube/storage

# Resource limits
LimitNOFILE=65536
TimeoutStartSec=60

[Install]
WantedBy=multi-user.target
SYSTEMD_CONFIG

print_status "Systemd service file created"

# Reload systemd daemon
systemctl daemon-reload
print_status "Systemd daemon reloaded"

# Enable the service
systemctl enable peertube
print_status "PeerTube service enabled to start on boot"

# Function to check if PeerTube is ready
check_peertube_ready() {
    # Check if database exists and is accessible
    sudo -u postgres psql -d peertube_prod -c "SELECT 1" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_error "Database not ready"
        return 1
    fi
    
    # Check if PeerTube is built
    if [ ! -d "/var/www/peertube/dist" ]; then
        print_error "PeerTube not built yet"
        return 1
    fi
    
    # Check if config exists
    if [ ! -f "/var/www/peertube/config/production.yaml" ]; then
        print_error "Production configuration not found"
        return 1
    fi
    
    return 0
}

# Check if PeerTube is ready to start
if check_peertube_ready; then
    print_status "Starting PeerTube service..."
    systemctl start peertube
    
    # Wait for service to start
    sleep 5
    
    # Check service status
    if systemctl is-active --quiet peertube; then
        print_status "PeerTube service started successfully!"
        systemctl status peertube --no-pager
    else
        print_error "Failed to start PeerTube service"
        journalctl -u peertube -n 50 --no-pager
        exit 1
    fi
else
    print_status "PeerTube is not ready to start yet. Run this script again after installation is complete."
    print_status "You can manually start it with: systemctl start peertube"
fi

print_status "Systemd configuration completed!"
