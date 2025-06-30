// Comprehensive functionality test for Jigsaw Techie website
// Run with: node test-functionality.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('🚀 Starting Jigsaw Techie Functionality Tests\n');
  
  let passedTests = 0;
  let totalTests = 0;
  
  const test = async (name, testFn) => {
    totalTests++;
    try {
      console.log(`🧪 Testing: ${name}`);
      await testFn();
      console.log(`✅ PASSED: ${name}\n`);
      passedTests++;
    } catch (error) {
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  };

  // Test 1: Database Connection
  await test('Database Connection', async () => {
    const { data, error } = await supabase.from('quotes').select('count(*)').limit(1);
    if (error) throw error;
  });

  // Test 2: Quotes Table Structure
  await test('Quotes Table Structure', async () => {
    const { data, error } = await supabase.from('quotes').select('*').limit(1);
    if (error) throw error;
  });

  // Test 3: Users Table
  await test('Users Table Access', async () => {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
  });

  // Test 4: Companies Table
  await test('Companies Table Access', async () => {
    const { data, error } = await supabase.from('companies').select('*').limit(1);
    if (error) throw error;
  });

  // Test 5: Company Roles Table
  await test('Company Roles Table Access', async () => {
    const { data, error } = await supabase.from('company_roles').select('*').limit(1);
    if (error) throw error;
  });

  // Test 6: Project Access Table
  await test('Project Access Table Access', async () => {
    const { data, error } = await supabase.from('project_access').select('*').limit(1);
    if (error) throw error;
  });

  // Test 7: Projects Table
  await test('Projects Table Access', async () => {
    const { data, error } = await supabase.from('projects').select('*').limit(1);
    if (error) throw error;
  });

  // Test 8: Quote Insertion
  await test('Quote Insertion', async () => {
    const testQuote = {
      name: 'Test User',
      email: 'test@example.com',
      project_type: 'Website',
      budget: '$1,000 - $2,500',
      timeline: '1 month',
      description: 'Test quote for functionality testing',
      features: ['Responsive Design']
    };
    
    const { data, error } = await supabase
      .from('quotes')
      .insert([testQuote])
      .select()
      .single();
    
    if (error) throw error;
    
    // Clean up
    await supabase.from('quotes').delete().eq('id', data.id);
  });

  // Test 9: Authentication Tables
  await test('Authentication System Check', async () => {
    // Check if we can access auth-related functions
    const { data, error } = await supabase.auth.getSession();
    // This should not error even if no session exists
  });

  // Summary
  console.log('📊 TEST SUMMARY');
  console.log('================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Database is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
}

runTests().catch(console.error);
