'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    try {
      addResult('🚀 Starting Supabase tests...')
      
      // Test 1: Environment variables
      addResult('📋 Checking environment variables...')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl) {
        addResult('❌ NEXT_PUBLIC_SUPABASE_URL is not set')
        return
      }
      if (!supabaseKey) {
        addResult('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
        return
      }
      
      addResult(`✅ Supabase URL: ${supabaseUrl.substring(0, 30)}...`)
      addResult(`✅ Supabase Key: ${supabaseKey.substring(0, 30)}...`)
      
      // Test 2: Basic connection
      addResult('🔌 Testing basic connection...')
      const { data: connectionTest, error: connectionError } = await supabase
        .from('quotes')
        .select('count(*)')
        .limit(1)
      
      if (connectionError) {
        addResult(`❌ Connection failed: ${connectionError.message}`)
        addResult(`Error code: ${connectionError.code}`)
        addResult(`Error details: ${connectionError.details}`)
        return
      }
      
      addResult('✅ Database connection successful')
      
      // Test 3: Table structure
      addResult('📊 Testing table structure...')
      const { data: structureTest, error: structureError } = await supabase
        .from('quotes')
        .select('*')
        .limit(1)
      
      if (structureError) {
        addResult(`❌ Table query failed: ${structureError.message}`)
        return
      }
      
      addResult('✅ Table structure looks good')
      
      // Test 4: Insert test
      addResult('📝 Testing quote insertion...')
      const testQuote = {
        name: 'Debug Test User',
        email: 'debug@test.com',
        project_type: 'Test Project',
        budget: '$1,000 - $2,500',
        timeline: '1 month',
        description: 'This is a debug test quote.',
        features: ['Test Feature']
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('quotes')
        .insert([testQuote])
        .select()
        .single()
      
      if (insertError) {
        addResult(`❌ Insert failed: ${insertError.message}`)
        addResult(`Error code: ${insertError.code}`)
        return
      }
      
      addResult('✅ Test quote inserted successfully')
      addResult(`Quote ID: ${insertData.id}`)
      
      // Test 5: Cleanup
      addResult('🧹 Cleaning up test data...')
      const { error: deleteError } = await supabase
        .from('quotes')
        .delete()
        .eq('id', insertData.id)
      
      if (deleteError) {
        addResult(`⚠️ Cleanup failed: ${deleteError.message}`)
      } else {
        addResult('✅ Test data cleaned up')
      }
      
      addResult('🎉 All tests completed successfully!')
      
    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔧 Supabase Debug Console
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This page helps debug the Supabase connection and quote form functionality.
            </p>
            
            <button
              onClick={runTests}
              disabled={isRunning}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running Tests...' : 'Run Supabase Tests'}
            </button>
          </div>
          
          {/* Test Results */}
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            <div className="mb-2 text-gray-400">Test Results:</div>
            {testResults.length === 0 ? (
              <div className="text-gray-500">Click "Run Supabase Tests" to start...</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
          
          {/* Environment Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Environment Check:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>
                <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Create a Supabase project at <a href="https://supabase.com" className="underline">supabase.com</a></li>
              <li>Get your Project URL and anon key from Settings → API</li>
              <li>Update your .env.local file with the correct values</li>
              <li>Run the SQL to create the quotes table in Supabase SQL Editor</li>
              <li>Restart your development server</li>
              <li>Run the tests above to verify everything works</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
