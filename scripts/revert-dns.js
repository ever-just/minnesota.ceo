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

// Revert to GoDaddy nameservers with proper records for DigitalOcean
const records = [
  // Nameservers (required by GoDaddy)
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
  // Use A record for root domain
  {
    type: 'A',
    name: '@',
    data: '165.227.70.236', // DigitalOcean app IP
    ttl: 600
  },
  // CNAME for www
  {
    type: 'CNAME',
    name: 'www',
    data: 'minnesota-ceo-jydwx.ondigitalocean.app',
    ttl: 600
  },
  // CNAME for app
  {
    type: 'CNAME',
    name: 'app',
    data: 'minnesota-ceo-jydwx.ondigitalocean.app',
    ttl: 600
  },
  // CNAME for admin
  {
    type: 'CNAME',
    name: 'admin',
    data: 'minnesota-ceo-jydwx.ondigitalocean.app',
    ttl: 600
  }
];

console.log('🔧 Reverting DNS to use GoDaddy nameservers with proper DigitalOcean records...');

function updateRecords() {
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
          console.log('✅ DNS records updated successfully');
          resolve();
        } else {
          console.error('❌ Failed to update records:', res.statusCode, body);
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
    console.log('🌐 Fixing DNS for', domain);
    await updateRecords();
    
    console.log('');
    console.log('✅ DNS configuration has been reverted!');
    console.log('');
    console.log('📝 What happens next:');
    console.log('   1. DNS will propagate in 5-10 minutes');
    console.log('   2. DigitalOcean will detect the domain pointing to it');
    console.log('   3. SSL certificates will be auto-provisioned');
    console.log('   4. Your site will be secure at https://' + domain);
    console.log('');
    console.log('⏳ Please wait 10-15 minutes for full propagation and SSL provisioning.');
    
  } catch (error) {
    console.error('❌ Error updating DNS:', error);
    process.exit(1);
  }
}

main();
