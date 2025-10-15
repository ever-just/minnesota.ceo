# MINNESOTA.CEO Deployment Guide

## Overview
This guide will help you deploy MINNESOTA.CEO to DigitalOcean App Platform with PostgreSQL database and configure DNS via GoDaddy.

## Prerequisites
- DigitalOcean account with API access
- SendGrid account with API key
- Domain: minnesota.ceo (already owned)
- GitHub repository (created at: https://github.com/ever-just/minnesota-ceo)

## Step 1: Create PostgreSQL Database on DigitalOcean

1. Log in to DigitalOcean dashboard
2. Create a new Database Cluster:
   - Engine: PostgreSQL 15
   - Plan: Basic ($15/month)
   - Region: NYC
   - Name: minnesota-ceo-db

3. Once created, get the connection string from the "Connection Details" tab

## Step 2: Deploy to DigitalOcean App Platform

### Option A: Using DigitalOcean Dashboard (Recommended)

1. Go to DigitalOcean Apps
2. Click "Create App"
3. Choose GitHub as source
4. Select repository: ever-just/minnesota-ceo
5. Configure app settings:
   - Name: minnesota-ceo
   - Region: NYC
   - Instance: Basic ($5/month)
   
6. Add Environment Variables:
   ```
   DATABASE_URL=<your-postgresql-connection-string>
   SENDGRID_API_KEY=<your-sendgrid-api-key>
   SENDGRID_FROM_EMAIL=notifications@minnesota.ceo
   SENDGRID_FROM_NAME=MINNESOTA.CEO
   ADMIN_PASSWORD=weldon
   NEXT_PUBLIC_APP_URL=https://minnesota.ceo
   NODE_ENV=production
   ```

7. Deploy

### Option B: Using DigitalOcean CLI

1. Install doctl: `brew install doctl`
2. Authenticate: `doctl auth init`
3. Create app: 
   ```bash
   doctl apps create --spec deploy-config.json
   ```

## Step 3: Initialize Database

After deployment, connect to your database and run:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50) DEFAULT 'main',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nominations (
  id SERIAL PRIMARY KEY,
  nominee_name VARCHAR(255) NOT NULL,
  nominee_title VARCHAR(255),
  nominee_organization VARCHAR(255),
  category VARCHAR(100),
  reason TEXT,
  nominator_name VARCHAR(255),
  nominator_email VARCHAR(255),
  nominator_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  page_path VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id SERIAL PRIMARY KEY,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
```

## Step 4: Configure DNS (GoDaddy)

### Using the script:

1. Create a file `.godaddy-config.json`:
   ```json
   {
     "apiKey": "gHKhkafh4D1G_QNMwoJ3AJiLEMrD96B62J6",
     "apiSecret": "He3jt9WKdPFeevVbVrbanZ",
     "domain": "minnesota.ceo"
   }
   ```

2. Update DNS records to point to DigitalOcean:
   - Get your app's IP/URL from DigitalOcean
   - Set A record for @ pointing to the IP
   - Set CNAME for www pointing to the DigitalOcean app URL
   - Set CNAME for app pointing to the DigitalOcean app URL
   - Set CNAME for admin pointing to the DigitalOcean app URL

### Manual Configuration:
1. Log in to GoDaddy
2. Go to DNS Management for minnesota.ceo
3. Update records as described above

## Step 5: Configure SSL

1. In DigitalOcean App Platform settings
2. Go to Settings → Domains
3. Add custom domain: minnesota.ceo
4. Add subdomain: www.minnesota.ceo
5. Add subdomain: app.minnesota.ceo
6. Add subdomain: admin.minnesota.ceo
7. DigitalOcean will automatically provision Let's Encrypt SSL certificates

## Step 6: Verify Deployment

1. Visit https://minnesota.ceo - Main landing page
2. Visit https://app.minnesota.ceo - Platform preview
3. Visit https://admin.minnesota.ceo - Admin dashboard (password: weldon)
4. Test waitlist signup
5. Test leader nomination form
6. Check admin analytics

## Step 7: Set up SendGrid (if needed)

1. Log in to SendGrid
2. Go to Settings → API Keys
3. Create new API key with "Full Access"
4. Add the key to environment variables
5. Verify sender: notifications@minnesota.ceo

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| SENDGRID_API_KEY | SendGrid API key for emails | Yes |
| SENDGRID_FROM_EMAIL | From email address | Yes |
| SENDGRID_FROM_NAME | From name in emails | Yes |
| ADMIN_PASSWORD | Admin dashboard password | Yes |
| NEXT_PUBLIC_APP_URL | Public URL of the app | Yes |
| NODE_ENV | Environment (production) | Yes |
| GODADDY_API_KEY | GoDaddy API key (optional) | No |
| GODADDY_API_SECRET | GoDaddy API secret (optional) | No |

## Monitoring

1. Set up DigitalOcean monitoring alerts
2. Configure uptime monitoring (e.g., UptimeRobot)
3. Monitor database performance
4. Check application logs regularly

## Troubleshooting

### App not loading
- Check build logs in DigitalOcean
- Verify all environment variables are set
- Check database connection

### Database connection issues
- Verify DATABASE_URL format
- Check firewall rules
- Ensure SSL mode is correct

### Email not sending
- Verify SendGrid API key
- Check sender verification
- Review SendGrid activity logs

### DNS not resolving
- Wait 24-48 hours for propagation
- Clear DNS cache
- Verify GoDaddy records

## Support

For issues, contact:
- EVERJUST COMPANY: company@everjust.org
- Project Lead: Weldon

## Security Notes

- Never commit `.env.local` or `deploy-config.json`
- Rotate API keys regularly
- Use strong passwords
- Enable 2FA on all accounts
- Regular security updates
