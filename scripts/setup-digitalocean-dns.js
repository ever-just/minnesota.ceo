#!/usr/bin/env node
const https = require('https');

console.log('🔧 Configuring DNS for DigitalOcean SSL...\n');

// Update nameservers to DigitalOcean so they can manage SSL
const nsRecords = [
  { type: 'NS', name: '@', data: 'ns1.digitalocean.com', ttl: 3600 },
  { type: 'NS', name: '@', data: 'ns2.digitalocean.com', ttl: 3600 },
  { type: 'NS', name: '@', data: 'ns3.digitalocean.com', ttl: 3600 }
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
      console.log('✅ Nameservers updated to DigitalOcean!');
      console.log('\nDigitalOcean will now manage DNS and SSL for minnesota.ceo');
      console.log('\n⏱️  Allow 10-30 minutes for:');
      console.log('   1. Nameserver propagation');
      console.log('   2. DigitalOcean domain verification');
      console.log('   3. SSL certificate provisioning');
      console.log('\n🌐 Site is live at: https://minnesota-ceo-q3f57.ondigitalocean.app');
    } else {
      console.error(`❌ Error ${res.statusCode}:`, body);
    }
  });
});

req.on('error', error => console.error('Error:', error));
req.write(JSON.stringify(nsRecords));
req.end();
