#!/usr/bin/env node
const https = require('https');

const API_KEY = 'gHKhkafh4D1G_QNMwoJ3AJiLEMrD96B62J6';
const API_SECRET = 'He3jt9WKdPFeevVbVrbanZ';
const DOMAIN = 'minnesota.ceo';
const APP_URL = 'minnesota-ceo-q3f57.ondigitalocean.app';

const dnsRecords = [
  { type: 'CNAME', name: 'www', data: APP_URL + '.', ttl: 600 },
  { type: 'CNAME', name: 'app', data: APP_URL + '.', ttl: 600 },
  { type: 'CNAME', name: 'admin', data: APP_URL + '.', ttl: 600 }
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

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`✅ DNS Updated! Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('\nCNAME records set:');
      dnsRecords.forEach(r => console.log(`  ${r.name}.${DOMAIN} → ${r.data}`));
      console.log('\n⏱️  Wait 5-10 minutes for propagation');
      console.log(`🌐 Site is LIVE NOW at: https://${APP_URL}`);
    } else {
      console.error('Response:', body);
    }
  });
});

req.on('error', error => console.error('Error:', error));
req.write(JSON.stringify(dnsRecords));
req.end();
