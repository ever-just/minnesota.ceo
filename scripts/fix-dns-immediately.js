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

console.log('🚨 EMERGENCY DNS FIX FOR MINNESOTA.CEO 🚨');
console.log('Fixing DNS to point to correct DigitalOcean app...\n');

// CORRECT DNS RECORDS - Point to the actual working app
const records = [
  // Required nameservers
  {
    type: 'NS',
    name: '@',
    data: 'ns53.domaincontrol.com',
    ttl: 3600
  },
  {
    type: 'NS',
    name: '@',
    data: 'ns54.domaincontrol.com',
    ttl: 3600
  },
  // Use multiple A records for root to point to Cloudflare IPs
  {
    type: 'A',
    name: '@',
    data: '172.66.0.96',
    ttl: 600
  },
  {
    type: 'A',
    name: '@',
    data: '104.16.51.36',
    ttl: 600
  },
  {
    type: 'CNAME', 
    name: 'www',
    data: 'minnesota-ceo-jydwx.ondigitalocean.app',
    ttl: 600
  },
  {
    type: 'CNAME',
    name: 'app',
    data: 'minnesota-ceo-jydwx.ondigitalocean.app',
    ttl: 600
  },
  {
    type: 'CNAME',
    name: 'admin',
    data: 'minnesota-ceo-jydwx.ondigitalocean.app',
    ttl: 600
  }
];

// Function to update DNS records
function updateRecords() {
  const data = JSON.stringify(records);
  
  const options = {
    hostname: API_BASE,
    path: `/v1/domains/${domain}/records`,
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ DNS records updated successfully!');
        console.log('\n🔧 Configuration Applied:');
        records.forEach(record => {
          console.log(`  ${record.name === '@' ? domain : record.name + '.' + domain} → ${record.data}`);
        });
        console.log('\n⏱️  DNS propagation may take 5-30 minutes');
        console.log('🌐 Your site is IMMEDIATELY available at: https://minnesota-ceo-jydwx.ondigitalocean.app');
      } else {
        console.error(`❌ Error updating DNS: ${res.statusCode}`);
        console.error(responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });

  req.write(data);
  req.end();
}

// Execute the update
updateRecords();
