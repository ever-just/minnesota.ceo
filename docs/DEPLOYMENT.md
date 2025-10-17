# Deployment Guide

## Overview
Minnesota.CEO is a Next.js 14 application configured for deployment on DigitalOcean App Platform.

## Prerequisites
- Node.js 18.x or higher
- PostgreSQL database (optional, will use mock data if not configured)
- DigitalOcean account (for production deployment)
- Domain name (optional)

## Local Development

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

## Production Deployment

### DigitalOcean App Platform

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **Create App on DigitalOcean**
- Use the DigitalOcean MCP or web console
- Connect to your GitHub repository
- Select the main branch for deployment

3. **Configure Build Settings**
- Build Command: `npm install && npm run build`
- Run Command: `npm start`
- HTTP Port: 3000
- Instance: Basic (apps-s-1vcpu-0.5gb)

4. **Environment Variables**
Add the following in App Platform settings:
- `DATABASE_URL` - PostgreSQL connection string (if using)
- `NODE_ENV` - Set to "production"
- Any other required secrets

### Database Setup
If using PostgreSQL:
```bash
# Initialize database tables
node scripts/init-database.js

# Add analytics tables
node scripts/add-analytics-tables.js
```

## Domain Configuration

### Using Custom Domain
1. Add domain in DigitalOcean App Platform settings
2. Configure DNS at your registrar:
   - A records: Point to DigitalOcean's IPs
   - CNAME: For www subdomain

### DNS Management Script
For GoDaddy domains:
```bash
node scripts/update-godaddy-dns.js
```

For DigitalOcean DNS:
```bash
node scripts/setup-digitalocean-dns.js
```

## Monitoring & Maintenance

### Health Checks
- App Platform automatically monitors `/`
- Custom health endpoint at `/api/health` (if implemented)

### Logs
View logs via:
- DigitalOcean App Platform console
- CLI: `doctl apps logs <APP_ID>`

### Updates
1. Push changes to GitHub main branch
2. App Platform auto-deploys on push
3. Monitor deployment status in console

## Troubleshooting

### Build Failures
- Check Node.js version matches engines in package.json
- Verify all dependencies are in package.json
- Check build logs in App Platform

### Runtime Errors
- Verify environment variables are set
- Check database connectivity
- Review application logs

### Performance Issues
- Consider upgrading instance size
- Enable caching headers
- Optimize images and assets

## Security Considerations
- Never commit `.env` files
- Use App Platform's secret management
- Enable HTTPS (automatic with App Platform)
- Keep dependencies updated

## Support
For issues specific to:
- Next.js: https://nextjs.org/docs
- DigitalOcean: https://docs.digitalocean.com/products/app-platform/
- This app: Check docs/IMPLEMENTATION.md for feature details
