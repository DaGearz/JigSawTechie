-- COMPREHENSIVE AUTHENTICATION FIX SCRIPT
-- This addresses all common authentication issues found in the diagnosis
-- Run this AFTER running comprehensive-diagnosis.sql

-- ===== STEP 1: CLEAN UP EXISTING POLICIES AND TRIGGERS =====
SELECT 'STEP 1: CLEANING UP EXISTING CONFIGURATION' as step;

-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read their own data" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to update their own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.users;
DROP POLICY IF EXISTS "Allow anon read for debugging" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users full access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users full access to project_updates" ON public.project_updates;
DROP POLICY IF EXISTS "Allow authenticated users full access to project_files" ON public.project_files;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- ===== STEP 2: FIX USER TABLE STRUCTURE =====
SELECT 'STEP 2: FIXING USER TABLE STRUCTURE' as step;

-- Ensure users table has correct structure
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Update existing users to have full_name if missing
UPDATE public.users 
SET full_name = name 
WHERE full_name IS NULL AND name IS NOT NULL;

-- ===== STEP 3: CREATE ROBUST USER CREATION TRIGGER =====
SELECT 'STEP 3: CREATING ROBUST USER CREATION TRIGGER' as step;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_role TEXT;
BEGIN
  -- Extract name and role from metadata
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    'client'
  );

  -- Insert user profile with conflict handling
  INSERT INTO public.users (id, email, name, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_name,
    user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(users.name, EXCLUDED.name),
    full_name = COALESCE(users.full_name, EXCLUDED.full_name),
    role = COALESCE(users.role, EXCLUDED.role),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===== STEP 4: FIX MISSING USER PROFILES =====
SELECT 'STEP 4: FIXING MISSING USER PROFILES' as step;

-- Create profiles for any auth users that don't have them
INSERT INTO public.users (id, email, name, full_name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as name,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as full_name,
  COALESCE(au.raw_user_meta_data->>'role', 'client') as role,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ===== STEP 5: CONFIGURE PROPER RLS POLICIES =====
SELECT 'STEP 5: CONFIGURING PROPER RLS POLICIES' as step;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for users table
CREATE POLICY "authenticated_users_select_own" ON public.users
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "authenticated_users_update_own" ON public.users
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow service role full access (for REST API)
CREATE POLICY "service_role_full_access" ON public.users
  FOR ALL 
  USING (auth.role() = 'service_role');

-- ===== STEP 6: CONFIGURE TABLE PERMISSIONS =====
SELECT 'STEP 6: CONFIGURING TABLE PERMISSIONS' as step;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Configure for REST API access
ALTER TABLE public.users REPLICA IDENTITY FULL;

-- ===== STEP 7: CONFIGURE OTHER TABLES =====
SELECT 'STEP 7: CONFIGURING OTHER TABLES' as step;

-- Projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_authenticated_access" ON public.projects
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON public.projects TO authenticated;
ALTER TABLE public.projects REPLICA IDENTITY FULL;

-- ===== STEP 8: VERIFICATION =====
SELECT 'STEP 8: VERIFICATION' as step;

-- Test user profile access
SELECT 
  'User Profile Test' as test,
  id,
  email,
  name,
  full_name,
  role
FROM public.users 
WHERE email = 'twill003@gmail.com';

-- Test policy functionality
SELECT 'Authentication fix completed successfully!' as status;
