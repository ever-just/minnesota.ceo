#!/usr/bin/env node

const https = require('https');

const API_KEY = 'gHKhkafh4D1G_QNMwoJ3AJiLEMrD96B62J6';
const API_SECRET = 'He3jt9WKdPFeevVbVrbanZ';
const DOMAIN = 'minnesota.ceo';

// DigitalOcean App Platform requires CNAME records, not A records
// The root domain needs to be an ALIAS or CNAME which GoDaddy doesn't support well
// So we'll use CNAME for www, app, admin and let DigitalOcean handle the root via their DNS

const dnsRecords = [
  // Keep nameservers
  { type: 'NS', name: '@', data: 'ns53.domaincontrol.com', ttl: 3600 },
  { type: 'NS', name: '@', data: 'ns54.domaincontrol.com', ttl: 3600 },
  // Remove the wrong A record - use CNAME forwarding for www instead
  { type: 'CNAME', name: 'www', data: '@', ttl: 600 },
  { type: 'CNAME', name: 'app', data: '@', ttl: 600 },
  { type: 'CNAME', name: 'admin', data: '@', ttl: 600 }
];

const options = {
  hostname: 'api.godaddy.com',
  path: `/v1/domains/${DOMAIN}/records`,
  method: 'PUT',
  headers: {
    'Authorization': `sso-key ${API_KEY}:${API_SECRET}`,
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify(dnsRecords);

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ DNS updated - removed wrong A record');
      console.log('Note: Root domain (@) now has no record');
      console.log('You need to configure this in DigitalOcean dashboard');
    } else {
      console.error('❌ Error:', res.statusCode, body);
    }
  });
});

req.on('error', error => console.error('❌ Request failed:', error));
req.write(data);
req.end();
