-- COMPREHENSIVE WEBSITE DIAGNOSIS SCRIPT
-- Run this in Supabase SQL Editor to identify all authentication and database issues
-- This will help us understand exactly what's wrong and fix it

-- ===== SECTION 1: ENVIRONMENT CHECK =====
SELECT 'SECTION 1: ENVIRONMENT CHECK' as section;

-- Check if we can access basic tables
SELECT 
  'quotes' as table_name,
  COUNT(*) as record_count,
  'SUCCESS' as status
FROM quotes
UNION ALL
SELECT 
  'users' as table_name,
  COUNT(*) as record_count,
  'SUCCESS' as status
FROM users
UNION ALL
SELECT 
  'projects' as table_name,
  COUNT(*) as record_count,
  'SUCCESS' as status
FROM projects;

-- ===== SECTION 2: USER AUTHENTICATION ANALYSIS =====
SELECT 'SECTION 2: USER AUTHENTICATION ANALYSIS' as section;

-- Check auth users vs profile users
SELECT 
  'Auth Users' as type,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profile Users' as type,
  COUNT(*) as count
FROM public.users;

-- Check for orphaned auth users (no profile)
SELECT 
  'Orphaned Auth Users (no profile)' as issue,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Check for orphaned profiles (no auth)
SELECT 
  'Orphaned Profiles (no auth)' as issue,
  COUNT(*) as count
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL;

-- Check specific user that's having issues
SELECT 
  'User Analysis: twill003@gmail.com' as analysis,
  au.id as auth_id,
  au.email as auth_email,
  au.email_confirmed_at,
  au.raw_user_meta_data,
  pu.id as profile_id,
  pu.email as profile_email,
  pu.role as profile_role,
  pu.full_name as profile_name
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'twill003@gmail.com';

-- ===== SECTION 3: DATABASE SCHEMA ANALYSIS =====
SELECT 'SECTION 3: DATABASE SCHEMA ANALYSIS' as section;

-- Check users table structure
SELECT 
  'users table columns' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===== SECTION 4: RLS POLICIES ANALYSIS =====
SELECT 'SECTION 4: RLS POLICIES ANALYSIS' as section;

-- Check RLS status on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('users', 'quotes', 'projects', 'project_updates', 'project_files');

-- Check current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public';

-- ===== SECTION 5: PERMISSIONS ANALYSIS =====
SELECT 'SECTION 5: PERMISSIONS ANALYSIS' as section;

-- Check table permissions
SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'quotes', 'projects')
ORDER BY table_name, grantee;

-- ===== SECTION 6: TRIGGER ANALYSIS =====
SELECT 'SECTION 6: TRIGGER ANALYSIS' as section;

-- Check if user creation trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if trigger function exists
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- ===== SECTION 7: API ACCESS TEST =====
SELECT 'SECTION 7: API ACCESS TEST' as section;

-- Test if we can query users table (this simulates the REST API call)
SELECT 
  'REST API Simulation' as test_type,
  COUNT(*) as accessible_users
FROM users 
WHERE id = '06884af8-ea6f-4a2a-8fde-f189faff6462';

-- ===== SECTION 8: RECOMMENDATIONS =====
SELECT 'SECTION 8: RECOMMENDATIONS' as section;

-- This will be filled based on the results above
SELECT 'Run this diagnostic first, then we will provide specific fixes' as recommendation;
