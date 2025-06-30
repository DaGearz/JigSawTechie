-- DEBUG USER PROFILE ISSUE
-- Let's find out exactly what's happening

-- STEP 1: Check if the user exists in auth.users
SELECT 
  'AUTH USER CHECK' as check_type,
  au.id,
  au.email,
  au.email_confirmed_at,
  au.raw_user_meta_data,
  au.created_at
FROM auth.users au 
WHERE au.id = '06884af8-ea6f-4a2a-8fde-f189faff6462';

-- STEP 2: Check if profile exists in public.users
SELECT 
  'PROFILE CHECK' as check_type,
  pu.*
FROM public.users pu 
WHERE pu.id = '06884af8-ea6f-4a2a-8fde-f189faff6462';

-- STEP 3: Check users table structure
SELECT 
  'TABLE STRUCTURE' as check_type,
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- STEP 4: Check all users in the table
SELECT 
  'ALL USERS' as check_type,
  id,
  email,
  name,
  role,
  created_at
FROM public.users
ORDER BY created_at DESC;

-- STEP 5: Check RLS policies on users table
SELECT 
  'RLS POLICIES' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- STEP 6: Check if RLS is enabled
SELECT 
  'RLS STATUS' as check_type,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- STEP 7: Try to create the profile manually
DO $$
BEGIN
  -- First try to insert
  INSERT INTO public.users (id, email, name, role, created_at, updated_at)
  VALUES (
    '06884af8-ea6f-4a2a-8fde-f189faff6462',
    'twill003@gmail.com',
    'twill003',
    'client',
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Profile created successfully';
  
EXCEPTION 
  WHEN unique_violation THEN
    -- If it already exists, update it
    UPDATE public.users 
    SET 
      email = 'twill003@gmail.com',
      name = 'twill003',
      role = 'client',
      updated_at = NOW()
    WHERE id = '06884af8-ea6f-4a2a-8fde-f189faff6462';
    
    RAISE NOTICE 'Profile updated successfully';
    
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
END $$;

-- STEP 8: Verify the profile was created
SELECT 
  'FINAL VERIFICATION' as check_type,
  pu.*
FROM public.users pu 
WHERE pu.id = '06884af8-ea6f-4a2a-8fde-f189faff6462';

-- STEP 9: Test if we can query with current auth context
SELECT 
  'AUTH CONTEXT TEST' as check_type,
  current_user as current_db_user,
  session_user as session_db_user;

SELECT 'Debug complete - check results above' as status;
