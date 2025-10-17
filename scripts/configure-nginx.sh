#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[NGINX]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Configuring Nginx for PeerTube..."

# Create Nginx configuration for PeerTube
cat > /etc/nginx/sites-available/peertube << 'NGINX_CONFIG'
# Redirect HTTP to HTTPS
server {
  listen 80;
  listen [::]:80;
  server_name app.minnesota.ceo;

  location /.well-known/acme-challenge/ {
    default_type "text/plain";
    root /var/www/certbot;
  }

  location / {
    return 301 https://$server_name$request_uri;
  }
}

# HTTPS Server
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name app.minnesota.ceo;

  # Will be configured by certbot
  # ssl_certificate /etc/letsencrypt/live/app.minnesota.ceo/fullchain.pem;
  # ssl_certificate_key /etc/letsencrypt/live/app.minnesota.ceo/privkey.pem;

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header X-Robots-Tag "none" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
  
  # Maximum file upload size
  client_max_body_size 8G;
  proxy_connect_timeout 600s;
  proxy_send_timeout 600s;
  proxy_read_timeout 600s;
  send_timeout 600s;

  # Websocket support
  location /tracker/socket {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_pass http://localhost:9000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

  location /socket.io {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_pass http://localhost:9000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

  # PeerTube API
  location ~ ^/api/v1/(videos|video-playlists|users/me/avatar/pick)$ {
    client_max_body_size 8G;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_connect_timeout 600s;
    proxy_send_timeout 600s;
    proxy_read_timeout 600s;
    send_timeout 600s;
    proxy_pass http://localhost:9000;
  }

  # PeerTube
  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://localhost:9000;
  }

  # Static files
  location ~ ^/static/(thumbnails|avatars)/ {
    if ($request_method = 'OPTIONS') {
      add_header 'Access-Control-Allow-Origin' '*';
      add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
      add_header 'Access-Control-Allow-Headers' 'Range,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
      add_header 'Access-Control-Max-Age' 1728000;
      add_header 'Content-Type' 'text/plain charset=UTF-8';
      add_header 'Content-Length' 0;
      return 204;
    }

    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Range,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
    
    root /var/www/peertube/storage;
    try_files $uri @api;
  }

  location @api {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://localhost:9000;
  }
}
NGINX_CONFIG

# Remove default nginx site if exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
    print_status "Removed default Nginx site"
fi

# Enable PeerTube site
ln -sf /etc/nginx/sites-available/peertube /etc/nginx/sites-enabled/
print_status "Enabled PeerTube Nginx configuration"

# Test Nginx configuration
nginx -t
if [ $? -eq 0 ]; then
    print_status "Nginx configuration is valid"
    systemctl reload nginx
    print_status "Nginx reloaded successfully"
else
    print_error "Nginx configuration test failed!"
    exit 1
fi

# Create directory for Let's Encrypt
mkdir -p /var/www/certbot

print_status "Nginx configuration completed!"
print_status "Now run: certbot --nginx -d app.minnesota.ceo to obtain SSL certificate"
