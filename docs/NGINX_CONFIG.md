# Nexodify AVA - Nginx Configuration

## Overview

This configuration routes:
- `app.nexodify.com` → React frontend (port 3000 or static files)
- `api.nexodify.com` → Node/Express backend (port 4100)

## Nginx Configuration

```nginx
# /etc/nginx/sites-available/nexodify

# Upstream definitions
upstream ava_backend {
    server 127.0.0.1:4100;
    keepalive 32;
}

upstream ava_frontend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name app.nexodify.com api.nexodify.com;
    return 301 https://$host$request_uri;
}

# API Server (api.nexodify.com)
server {
    listen 443 ssl http2;
    server_name api.nexodify.com;

    # SSL Configuration (use certbot/Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.nexodify.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.nexodify.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # CORS headers (adjust origin as needed)
    add_header Access-Control-Allow-Origin "https://app.nexodify.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
    add_header Access-Control-Allow-Credentials "true" always;

    # Handle preflight OPTIONS requests
    if ($request_method = OPTIONS) {
        return 204;
    }

    # File upload limits
    client_max_body_size 25M;
    client_body_buffer_size 10M;

    # Proxy timeouts for long OCR operations
    proxy_connect_timeout 60s;
    proxy_send_timeout 120s;
    proxy_read_timeout 120s;

    # Health check (no auth)
    location /health {
        proxy_pass http://ava_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static file downloads (PDF reports, etc.)
    location /api/runs/ {
        # Check if requesting a file download
        if ($request_uri ~* \.(pdf|json)$) {
            # Add caching headers for static files
            add_header Cache-Control "private, max-age=3600";
        }
        proxy_pass http://ava_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # All API routes
    location /api/ {
        proxy_pass http://ava_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";

        # Rate limiting
        limit_req zone=api_limit burst=20 nodelay;
    }

    # Stripe webhook (no rate limiting, different auth)
    location /api/stripe/webhook {
        proxy_pass http://ava_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Pass raw body for Stripe signature verification
        proxy_set_header X-Original-URI $request_uri;
    }

    # Default - reject
    location / {
        return 404;
    }
}

# Frontend App (app.nexodify.com)
server {
    listen 443 ssl http2;
    server_name app.nexodify.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/app.nexodify.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.nexodify.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # Option A: Proxy to React dev server (development)
    # location / {
    #     proxy_pass http://ava_frontend;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection "upgrade";
    #     proxy_set_header Host $host;
    #     proxy_cache_bypass $http_upgrade;
    # }

    # Option B: Serve static React build (production)
    root /var/www/nexodify-app/build;
    index index.html;

    # Static assets with caching
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - always serve index.html for client routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Rate limiting zone definitions (add to http block in nginx.conf)
# limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
```

## Installation Steps

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Create configuration

```bash
sudo nano /etc/nginx/sites-available/nexodify
# Paste the configuration above
```

### 3. Enable site

```bash
sudo ln -s /etc/nginx/sites-available/nexodify /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default
```

### 4. Add rate limiting to nginx.conf

```bash
sudo nano /etc/nginx/nginx.conf
# Add inside http { } block:
# limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
```

### 5. Set up SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.nexodify.com -d api.nexodify.com
```

### 6. Test and reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Environment Variables

The frontend needs these environment variables set at build time:

```bash
# /var/www/nexodify-app/.env.production
REACT_APP_BACKEND_URL=https://api.nexodify.com
```

## Deployment Commands

```bash
# Build frontend
cd /path/to/frontend
yarn build

# Copy to web root
sudo rm -rf /var/www/nexodify-app/build
sudo cp -r build /var/www/nexodify-app/

# Set permissions
sudo chown -R www-data:www-data /var/www/nexodify-app
```
