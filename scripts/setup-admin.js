// Admin User Setup Script
// Run this ONCE after deploying to production to create your admin account
// Usage: node setup-admin.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdmin() {
  console.log('🚀 Setting up admin user for Jigsaw Techie\n');
  
  // Admin credentials - CHANGE THESE!
  const ADMIN_EMAIL = 'twilliams@jigsawtechie.com';
  const ADMIN_PASSWORD = 'TempPassword123!'; // CHANGE THIS IMMEDIATELY
  const ADMIN_NAME = 'Tyler Williams';
  
  console.log('⚠️  IMPORTANT: Change the admin password immediately after setup!');
  console.log(`📧 Admin Email: ${ADMIN_EMAIL}`);
  console.log(`🔑 Temp Password: ${ADMIN_PASSWORD}\n`);
  
  try {
    // Step 1: Create auth user
    console.log('1️⃣ Creating admin auth user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          name: ADMIN_NAME,
          role: 'admin'
        }
      }
    });
    
    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ Admin user already exists in auth system');
        
        // Try to sign in to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        });
        
        if (signInError) {
          console.log('❌ Could not sign in with existing admin account');
          console.log('   You may need to reset the password or check credentials');
          return;
        }
        
        authData.user = signInData.user;
      } else {
        throw authError;
      }
    } else {
      console.log('✅ Admin auth user created successfully');
    }
    
    if (!authData.user) {
      throw new Error('No user data returned from auth');
    }
    
    // Step 2: Create user profile
    console.log('2️⃣ Creating admin user profile...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: 'admin'
      })
      .select()
      .single();
    
    if (userError) {
      console.log('⚠️  User profile creation failed:', userError.message);
      console.log('   This might be okay if the profile already exists');
    } else {
      console.log('✅ Admin user profile created successfully');
    }
    
    // Step 3: Verify admin access
    console.log('3️⃣ Verifying admin access...');
    const { data: testQuotes, error: quotesError } = await supabase
      .from('quotes')
      .select('count(*)')
      .limit(1);
    
    if (quotesError) {
      console.log('❌ Admin cannot access quotes table:', quotesError.message);
      console.log('   Make sure to apply the secure RLS policies');
    } else {
      console.log('✅ Admin can access quotes table');
    }
    
    console.log('\n🎉 Admin setup complete!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Log in to your admin dashboard at /admin');
    console.log('2. IMMEDIATELY change your password');
    console.log('3. Test all admin functionality');
    console.log('4. Apply the secure RLS policies if not already done');
    console.log('5. Delete this setup script from production');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Make sure your Supabase project is accessible');
    console.log('2. Verify environment variables are correct');
    console.log('3. Check that the users table exists');
    console.log('4. Ensure RLS policies allow user creation');
  }
}

// Run the setup
setupAdmin().catch(console.error);
