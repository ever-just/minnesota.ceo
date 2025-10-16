#!/usr/bin/env node
const https = require('https');

const dnsRecords = [
  { type: 'NS', name: '@', data: 'ns53.domaincontrol.com', ttl: 3600 },
  { type: 'NS', name: '@', data: 'ns54.domaincontrol.com', ttl: 3600 },
  { type: 'CNAME', name: 'www', data: 'minnesota-ceo-q3f57.ondigitalocean.app.', ttl: 600 },
  { type: 'CNAME', name: 'app', data: 'minnesota-ceo-q3f57.ondigitalocean.app.', ttl: 600 },
  { type: 'CNAME', name: 'admin', data: 'minnesota-ceo-q3f57.ondigitalocean.app.', ttl: 600 }
];

const options = {
  hostname: 'api.godaddy.com',
  path: '/v1/domains/minnesota.ceo/records',
  method: 'PUT',
  headers: {
    'Authorization': 'sso-key gHKhkafh4D1G_QNMwoJ3AJiLEMrD96B62J6:He3jt9WKdPFeevVbVrbanZ',
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ DNS UPDATED SUCCESSFULLY!');
      console.log('\nAll subdomains now point to: minnesota-ceo-q3f57.ondigitalocean.app');
      console.log('\n🌐 LIVE NOW: https://minnesota-ceo-q3f57.ondigitalocean.app');
      console.log('\n⏱️  Custom domains will work in 5-10 minutes');
    } else {
      console.error(`❌ Error ${res.statusCode}:`, body);
    }
  });
});

req.on('error', error => console.error('Error:', error));
req.write(JSON.stringify(dnsRecords));
req.end();
