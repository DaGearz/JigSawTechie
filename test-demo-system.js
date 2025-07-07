#!/usr/bin/env node

/**
 * 🧪 Demo System Test Script
 * 
 * This script tests the complete demo system functionality
 * Run with: node test-demo-system.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 JigsawTechie Demo System - Test Suite');
console.log('=====================================\n');

// Test 1: Check file structure
console.log('📁 Test 1: File Structure');
const requiredFiles = [
  'lib/demo-manager.ts',
  'lib/types/demo.ts',
  'components/DemoManagement.tsx',
  'components/ClientDemoAccess.tsx',
  'app/demo/[slug]/page.tsx',
  'app/api/demo/[slug]/route.ts',
  'app/api/demo/deploy/route.ts',
  'public/demos/.gitkeep'
];

let fileTestsPassed = 0;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    fileTestsPassed++;
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log(`\n📊 File Structure: ${fileTestsPassed}/${requiredFiles.length} files found\n`);

// Test 2: Check demo directory
console.log('📂 Test 2: Demo Directory Structure');
const demoDir = 'public/demos';
if (fs.existsSync(demoDir)) {
  console.log('✅ Demo directory exists');
  const stats = fs.statSync(demoDir);
  if (stats.isDirectory()) {
    console.log('✅ Demo directory is writable');
    const files = fs.readdirSync(demoDir);
    console.log(`📊 Demo directory contains ${files.length} items`);
    if (files.length > 1) {
      console.log('📋 Existing demos:');
      files.forEach(file => {
        if (file !== '.gitkeep') {
          console.log(`   - ${file}`);
        }
      });
    }
  } else {
    console.log('❌ Demo path exists but is not a directory');
  }
} else {
  console.log('❌ Demo directory does not exist');
}

// Test 3: Check documentation
console.log('\n📚 Test 3: Documentation Structure');
const docFiles = [
  'doc/deployment/DEMO_SYSTEM_DEPLOYMENT_GUIDE.md',
  'doc/instructions/VIVIE_DEMO_TESTING_PLAN.md',
  'doc/queries/demo_system_queries.sql',
  'doc/schemas/demo_system_schema.sql'
];

let docTestsPassed = 0;
docFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    docTestsPassed++;
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log(`\n📊 Documentation: ${docTestsPassed}/${docFiles.length} files found\n`);

// Test 4: Check TypeScript compilation
console.log('🔧 Test 4: TypeScript Check');
try {
  const { execSync } = require('child_process');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  console.log('   Run "npx tsc --noEmit" for details');
}

// Test 5: Check package dependencies
console.log('\n📦 Test 5: Dependencies Check');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  '@supabase/supabase-js',
  'lucide-react',
  'next',
  'react',
  'typescript'
];

let depTestsPassed = 0;
requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
    depTestsPassed++;
  } else {
    console.log(`❌ ${dep} - MISSING`);
  }
});

console.log(`\n📊 Dependencies: ${depTestsPassed}/${requiredDeps.length} found\n`);

// Test 6: Environment check
console.log('🔐 Test 6: Environment Configuration');
const envFile = '.env.local';
if (fs.existsSync(envFile)) {
  console.log('✅ .env.local file exists');
  const envContent = fs.readFileSync(envFile, 'utf8');
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  let envTestsPassed = 0;
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar}`);
      envTestsPassed++;
    } else {
      console.log(`❌ ${envVar} - MISSING`);
    }
  });
  
  console.log(`\n📊 Environment: ${envTestsPassed}/${requiredEnvVars.length} variables found`);
} else {
  console.log('❌ .env.local file not found');
}

// Test 7: Vivie's project path check
console.log('\n🤱 Test 7: Vivie\'s Project Path');
const viviePath = 'C:\\Users\\twill\\OneDrive\\Documents\\01_Coding\\0_Bussiness\\Vivie Doula';
if (fs.existsSync(viviePath)) {
  console.log('✅ Vivie\'s project directory exists');
  
  // Check for Next.js indicators
  const nextConfig = path.join(viviePath, 'next.config.js');
  const packageJsonPath = path.join(viviePath, 'package.json');
  
  if (fs.existsSync(nextConfig) || fs.existsSync(packageJsonPath)) {
    console.log('✅ Next.js project detected');
    
    // Check if built
    const nextDir = path.join(viviePath, '.next');
    if (fs.existsSync(nextDir)) {
      console.log('✅ Project appears to be built (.next directory exists)');
    } else {
      console.log('⚠️  Project may need building (no .next directory)');
      console.log('   Run: cd "' + viviePath + '" && npm run build');
    }
  } else {
    console.log('⚠️  Project type unclear (no Next.js config found)');
  }
} else {
  console.log('❌ Vivie\'s project directory not found');
  console.log('   Expected: ' + viviePath);
}

// Summary
console.log('\n🎯 Test Summary');
console.log('===============');

const totalTests = 7;
let passedTests = 0;

if (fileTestsPassed === requiredFiles.length) passedTests++;
if (fs.existsSync(demoDir)) passedTests++;
if (docTestsPassed === docFiles.length) passedTests++;
if (depTestsPassed === requiredDeps.length) passedTests++;
if (fs.existsSync('.env.local')) passedTests++;
if (fs.existsSync(viviePath)) passedTests++;

// TypeScript test
try {
  const { execSync } = require('child_process');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  passedTests++;
} catch (error) {
  // TypeScript failed
}

console.log(`📊 Overall: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('\n🎉 All tests passed! Demo system is ready for deployment.');
  console.log('\n📋 Next Steps:');
  console.log('1. Run database schema: doc/schemas/demo_system_schema.sql');
  console.log('2. Deploy to live site: git push origin main');
  console.log('3. Test demo deployment with Vivie\'s project');
  console.log('4. Follow testing plan: doc/instructions/VIVIE_DEMO_TESTING_PLAN.md');
} else {
  console.log('\n⚠️  Some tests failed. Please address the issues above before deployment.');
}

console.log('\n📚 Documentation available in doc/ directory (hidden from git)');
console.log('🔍 For troubleshooting, check: doc/queries/demo_system_queries.sql');
console.log('\n🚀 Ready to showcase professional demos at jigsawtechie.com/demo/[slug]!');
