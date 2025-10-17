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
    domain: 'minnesota.ceo'
  }, null, 2));
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { apiKey, apiSecret, domain } = config;

// PeerTube droplet IP
const PEERTUBE_IP = '159.89.134.232';

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

// Function to update A record for app subdomain
function updateAppSubdomain() {
  // First, get existing records
  const getOptions = {
    hostname: API_BASE,
    path: `/v1/domains/${domain}/records`,
    method: 'GET',
    headers
  };

  const getReq = https.request(getOptions, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        const existingRecords = JSON.parse(responseBody);
        console.log('📋 Current DNS records retrieved');
        
        // Filter out any existing 'app' records
        const filteredRecords = existingRecords.filter(record => 
          !(record.type === 'A' && record.name === 'app') &&
          !(record.type === 'CNAME' && record.name === 'app')
        );
        
        // Add new A record for app.minnesota.ceo
        filteredRecords.push({
          type: 'A',
          name: 'app',
          data: PEERTUBE_IP,
          ttl: 600
        });
        
        // Update all records
        const updateData = JSON.stringify(filteredRecords);
        
        const updateOptions = {
          hostname: API_BASE,
          path: `/v1/domains/${domain}/records`,
          method: 'PUT',
          headers: {
            ...headers,
            'Content-Length': updateData.length
          }
        };

        const updateReq = https.request(updateOptions, (updateRes) => {
          let updateResponseBody = '';

          updateRes.on('data', (chunk) => {
            updateResponseBody += chunk;
          });

          updateRes.on('end', () => {
            if (updateRes.statusCode === 200) {
              console.log('✅ DNS records updated successfully!');
              console.log('\n🌐 PeerTube DNS Configuration:');
              console.log(`   A record: app.${domain} → ${PEERTUBE_IP}`);
              console.log('\n⏱️  DNS propagation may take up to 48 hours (usually 5-30 minutes)');
              console.log('🔒 SSL certificate will be obtained via Let\'s Encrypt during setup');
              console.log('\n📝 You can access PeerTube at: https://app.minnesota.ceo');
            } else {
              console.error('❌ Error updating DNS records:');
              console.error(`Status: ${updateRes.statusCode}`);
              console.error(`Response: ${updateResponseBody}`);
            }
          });
        });

        updateReq.on('error', (error) => {
          console.error('❌ Update request error:', error);
        });

        updateReq.write(updateData);
        updateReq.end();
        
      } else {
        console.error('❌ Error fetching current DNS records:');
        console.error(`Status: ${res.statusCode}`);
        console.error(`Response: ${responseBody}`);
      }
    });
  });

  getReq.on('error', (error) => {
    console.error('❌ Get request error:', error);
  });

  getReq.end();
}

// Start the process
console.log('🚀 Configuring DNS for PeerTube Instance');
console.log('=========================================');
console.log(`📍 Domain: app.${domain}`);
console.log(`🖥️  Server IP: ${PEERTUBE_IP}`);
console.log('');

updateAppSubdomain();
