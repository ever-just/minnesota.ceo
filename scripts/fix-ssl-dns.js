#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.join(__dirname, '..', '.godaddy-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { apiKey, apiSecret, domain } = config;

// GoDaddy API configuration
const API_BASE = 'api.godaddy.com';
const headers = {
  'Authorization': `sso-key ${apiKey}:${apiSecret}`,
  'Content-Type': 'application/json'
};

// Update DNS records to use DigitalOcean nameservers
// This allows DigitalOcean to manage SSL certificates
const nameservers = [
  'ns1.digitalocean.com',
  'ns2.digitalocean.com',
  'ns3.digitalocean.com'
];

console.log('🔧 Updating DNS for SSL certificate provisioning...');

// First, we need to delete existing records and set nameservers
function updateNameservers() {
  const data = JSON.stringify(nameservers.map(ns => ({ type: 'NS', name: '@', data: ns, ttl: 3600 })));
  
  const options = {
    hostname: API_BASE,
    path: `/v1/domains/${domain}/records`,
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Nameservers updated to DigitalOcean');
          resolve();
        } else {
          console.error('❌ Failed to update nameservers:', res.statusCode, body);
          reject(new Error(`Failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Alternative: Use CNAME records if nameserver update fails
function updateCNAMERecords() {
  // For custom domains on DigitalOcean App Platform
  // We need to point to the app's default ingress
  const records = [
    {
      type: 'CNAME',
      name: '@',
      data: 'minnesota-ceo.b.sni.global.fastly.net',
      ttl: 600
    },
    {
      type: 'CNAME',
      name: 'www',
      data: 'minnesota-ceo.b.sni.global.fastly.net',
      ttl: 600
    },
    {
      type: 'CNAME',
      name: 'app',
      data: 'minnesota-ceo.b.sni.global.fastly.net',
      ttl: 600
    },
    {
      type: 'CNAME',
      name: 'admin',
      data: 'minnesota-ceo.b.sni.global.fastly.net',
      ttl: 600
    }
  ];

  const data = JSON.stringify(records);
  
  const options = {
    hostname: API_BASE,
    path: `/v1/domains/${domain}/records`,
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ CNAME records updated');
          resolve();
        } else {
          console.error('❌ Failed to update CNAME records:', res.statusCode, body);
          reject(new Error(`Failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Main execution
async function main() {
  try {
    console.log('🌐 Fixing SSL certificate configuration for', domain);
    
    // Try to update nameservers first (preferred method)
    try {
      await updateNameservers();
      console.log('');
      console.log('✅ DNS configuration updated!');
      console.log('');
      console.log('⏳ IMPORTANT: SSL certificates will be automatically provisioned by DigitalOcean');
      console.log('   This may take 5-10 minutes to complete.');
      console.log('');
      console.log('📝 Next steps:');
      console.log('   1. Wait 5-10 minutes for SSL provisioning');
      console.log('   2. Visit https://' + domain + ' to verify SSL is working');
      console.log('   3. If SSL still shows as invalid, wait up to 1 hour for DNS propagation');
    } catch (nsError) {
      console.log('⚠️  Could not update nameservers, trying CNAME records...');
      await updateCNAMERecords();
      console.log('');
      console.log('✅ CNAME records updated!');
      console.log('   SSL certificates should provision automatically.');
    }
    
  } catch (error) {
    console.error('❌ Error updating DNS:', error);
    process.exit(1);
  }
}

main();
