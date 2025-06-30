#!/usr/bin/env node

/**
 * JigsawTechie Demo CLI - Authentication Setup
 * Sets up authentication token for demo deployments
 */

const fs = require('fs-extra');
const path = require('path');

const CONFIG_FILE = '.jigsawtechie-config.json';

async function setupAuth() {
  const token = process.argv[2];
  
  if (!token) {
    console.error('❌ Error: No authentication token provided');
    console.log('');
    console.log('Usage: node cli/setup-auth.js <your-auth-token>');
    console.log('');
    console.log('To get your token:');
    console.log('1. Go to your admin dashboard');
    console.log('2. Login as admin');
    console.log('3. Open browser console (F12)');
    console.log('4. Run: JSON.parse(localStorage.getItem("sb-oyzycafkfmrrqmpwgtdg-auth-token")).access_token');
    console.log('5. Copy the token and use it here');
    process.exit(1);
  }

  try {
    const config = {
      adminToken: token,
      setupDate: new Date().toISOString(),
      version: '1.0.0'
    };

    await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
    
    console.log('✅ Authentication setup complete!');
    console.log(`📁 Config saved to: ${CONFIG_FILE}`);
    console.log('🚀 You can now deploy demos using: node cli/deploy-demo.js');
    
  } catch (error) {
    console.error('❌ Error setting up authentication:', error.message);
    process.exit(1);
  }
}

setupAuth();
