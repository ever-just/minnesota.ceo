# DNS Configuration Guide

## Overview
This guide covers DNS setup for Minnesota.CEO using either GoDaddy or DigitalOcean nameservers.

## Quick Setup

### Option 1: GoDaddy DNS (Recommended)
Keep DNS with GoDaddy and point to DigitalOcean App Platform.

1. **Configure A Records**
```
Type: A
Name: @
Value: 172.66.0.96
TTL: 600

Type: A  
Name: @
Value: 162.159.140.98
TTL: 600
```

2. **Configure CNAME for www**
```
Type: CNAME
Name: www
Value: <your-app-name>.ondigitalocean.app
TTL: 600
```

3. **Run Update Script**
```bash
# Configure your credentials
echo '{"apiKey":"YOUR_KEY","apiSecret":"YOUR_SECRET","domain":"minnesota.ceo"}' > .godaddy-config.json

# Update DNS records
node scripts/update-godaddy-dns.js
```

### Option 2: DigitalOcean DNS
Transfer DNS management to DigitalOcean.

1. **Update Nameservers at GoDaddy**
- ns1.digitalocean.com
- ns2.digitalocean.com
- ns3.digitalocean.com

2. **Create DNS Zone in DigitalOcean**
```bash
node scripts/setup-digitalocean-dns.js
```

3. **Wait for Propagation**
DNS changes can take 24-48 hours to fully propagate.

## SSL Certificates
- DigitalOcean App Platform provides free Let's Encrypt certificates
- Certificates auto-renew
- Works with both DNS configurations

## Verification

### Check DNS Propagation
```bash
# Check A records
dig minnesota.ceo

# Check CNAME
dig www.minnesota.ceo

# Check nameservers
dig NS minnesota.ceo
```

### Test SSL
```bash
# Check SSL certificate
curl -I https://minnesota.ceo
```

## Troubleshooting

### DNS Not Resolving
1. Verify nameserver configuration
2. Check DNS zone exists (if using DigitalOcean)
3. Wait for propagation (up to 48 hours)

### SSL Certificate Issues
1. Ensure domain is added to App Platform
2. Check DNS points to correct IPs
3. Wait for certificate generation (5-10 minutes)

### "Configuring" Status in App Platform
If DNS status shows "Configuring" for extended periods:
1. Switch back to GoDaddy nameservers
2. Manually configure A/CNAME records
3. SSL will still work correctly

## API Configuration

### GoDaddy API
Create API credentials at: https://developer.godaddy.com

Required scopes:
- DNS: Read/Write

### DigitalOcean API
Generate token at: https://cloud.digitalocean.com/account/api/tokens

Required scopes:
- Read
- Write

## Scripts Reference

### update-godaddy-dns.js
Updates DNS records via GoDaddy API.

Configuration file: `.godaddy-config.json`
```json
{
  "apiKey": "YOUR_API_KEY",
  "apiSecret": "YOUR_API_SECRET",
  "domain": "minnesota.ceo"
}
```

### setup-digitalocean-dns.js
Creates and configures DNS zone in DigitalOcean.

Requires environment variable:
- `DIGITALOCEAN_TOKEN` - API token with DNS write access

## Best Practices
1. Always backup existing DNS records before changes
2. Use low TTL values during migrations (600 seconds)
3. Test with dig/nslookup before updating production
4. Keep one backup DNS configuration method
5. Document your DNS setup for team members

## Common DNS Records

### Mail Configuration (if needed)
```
Type: MX
Name: @
Value: mail.minnesota.ceo
Priority: 10
TTL: 3600
```

### Subdomain Example
```
Type: CNAME
Name: api
Value: minnesota-api.ondigitalocean.app
TTL: 600
```

## Support Resources
- GoDaddy DNS: https://www.godaddy.com/help/dns-680
- DigitalOcean DNS: https://docs.digitalocean.com/products/networking/dns/
- DNS Propagation Checker: https://www.whatsmydns.net/
