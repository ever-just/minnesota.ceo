#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.join(__dirname, '..', '.godaddy-config.json');
if (!fs.existsSync(configPath)) {
  console.error('Error: .godaddy-config.json not found');
  console.log('Create a .godaddy-config.json file with:');
  console.log(JSON.stringify({
    apiKey: 'your-api-key',
    apiSecret: 'your-api-secret',
    domain: 'minnesota.ceo',
    targetIP: 'your-digitalocean-app-ip'
  }, null, 2));
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { apiKey, apiSecret, domain, targetIP, appURL } = config;

if (!apiKey || !apiSecret || !domain) {
  console.error('Error: Missing required configuration in .godaddy-config.json');
  process.exit(1);
}

// GoDaddy API configuration
const API_BASE = 'api.godaddy.com';
const headers = {
  'Authorization': `sso-key ${apiKey}:${apiSecret}`,
  'Content-Type': 'application/json'
};

// DNS records to configure
const dnsRecords = [
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
  {
    type: 'A',
    name: '@',
    data: targetIP || '165.227.70.236',
    ttl: 600
  },
  {
    type: 'CNAME',
    name: 'www',
    data: appURL || `minnesota-ceo-fupnz.ondigitalocean.app`,
    ttl: 600
  },
  {
    type: 'CNAME',
    name: 'app',
    data: appURL || `minnesota-ceo-fupnz.ondigitalocean.app`,
    ttl: 600
  },
  {
    type: 'CNAME',
    name: 'admin',
    data: appURL || `minnesota-ceo-fupnz.ondigitalocean.app`,
    ttl: 600
  }
];

// Function to update DNS records
function updateDNSRecords() {
  const data = JSON.stringify(dnsRecords);

  const options = {
    hostname: API_BASE,
    path: `/v1/domains/${domain}/records`,
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ DNS records updated successfully!');
        console.log('\nConfigured records:');
        dnsRecords.forEach(record => {
          console.log(`  ${record.type} ${record.name === '@' ? domain : record.name + '.' + domain} → ${record.data}`);
        });
        console.log('\n⏱️  DNS propagation may take up to 48 hours');
        console.log('🔒 SSL certificates will be automatically provisioned by DigitalOcean');
      } else {
        console.error('❌ Error updating DNS records:');
        console.error(`Status: ${res.statusCode}`);
        console.error(`Response: ${responseBody}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });

  req.write(data);
  req.end();
}

// Function to get current DNS records
function getCurrentDNS() {
  const options = {
    hostname: API_BASE,
    path: `/v1/domains/${domain}/records`,
    method: 'GET',
    headers
  };

  const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        const records = JSON.parse(responseBody);
        console.log('Current DNS records for', domain + ':');
        records.forEach(record => {
          console.log(`  ${record.type} ${record.name === '@' ? domain : record.name + '.' + domain} → ${record.data}`);
        });
        console.log('\nUpdating DNS records...\n');
        updateDNSRecords();
      } else {
        console.error('❌ Error fetching DNS records:');
        console.error(`Status: ${res.statusCode}`);
        console.error(`Response: ${responseBody}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });

  req.end();
}

// Check if target IP is provided
if (!targetIP) {
  console.log('⚠️  Warning: targetIP not set in .godaddy-config.json');
  console.log('Please update it with your DigitalOcean app\'s IP address');
  console.log('You can find this in the DigitalOcean App Platform dashboard\n');
}

// Start the process
console.log('🌐 Updating DNS records for', domain);
console.log('=====================================\n');
getCurrentDNS();
