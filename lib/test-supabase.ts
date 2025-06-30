// Test file to verify Supabase connection
// Run this in the browser console to test the connection

import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test 1: Check if Supabase client is initialized
    console.log('✅ Supabase client initialized:', !!supabase)
    
    // Test 2: Test database connection
    const { data, error } = await supabase
      .from('quotes')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    console.log('📊 Current quotes count:', data)
    
    // Test 3: Test table structure
    const { data: tableData, error: tableError } = await supabase
      .from('quotes')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Table query failed:', tableError.message)
      return false
    }
    
    console.log('✅ Table structure looks good')
    console.log('📋 Sample data structure:', tableData)
    
    return true
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error)
    return false
  }
}

// Test quote creation
export async function testQuoteCreation() {
  try {
    console.log('🧪 Testing quote creation...')
    
    const testQuote = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-0123',
      company: 'Test Company',
      website: 'https://test.com',
      project_type: 'New Website',
      budget: '$1,000 - $2,500',
      timeline: '1 month',
      description: 'This is a test quote to verify the system is working.',
      features: ['Responsive Design', 'SEO Optimization']
    }
    
    const { data, error } = await supabase
      .from('quotes')
      .insert([testQuote])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Quote creation failed:', error.message)
      return false
    }
    
    console.log('✅ Test quote created successfully:', data)
    
    // Clean up - delete the test quote
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .eq('id', data.id)
    
    if (deleteError) {
      console.warn('⚠️ Failed to clean up test quote:', deleteError.message)
    } else {
      console.log('🧹 Test quote cleaned up')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Quote creation test failed:', error)
    return false
  }
}

// Run all tests
export async function runAllTests() {
  console.log('🚀 Starting Supabase tests...')
  
  const connectionTest = await testSupabaseConnection()
  const creationTest = await testQuoteCreation()
  
  if (connectionTest && creationTest) {
    console.log('🎉 All tests passed! Supabase is ready to go.')
  } else {
    console.log('❌ Some tests failed. Check your Supabase configuration.')
  }
  
  return connectionTest && creationTest
}

// Instructions for running tests
console.log(`
🧪 Supabase Test Instructions:

1. Make sure you've updated your .env.local file with correct Supabase credentials
2. Make sure you've run the SQL to create the quotes table
3. Open browser console and run:

   import { runAllTests } from './lib/test-supabase'
   runAllTests()

4. Check the console output for test results
`)
