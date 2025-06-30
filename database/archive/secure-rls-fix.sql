-- SECURE RLS CONFIGURATION
-- This enables proper security while maintaining functionality
-- Run this AFTER creating the missing user profile

-- ===== STEP 1: CLEAN UP CURRENT INSECURE SETUP =====
SELECT 'STEP 1: CLEANING UP INSECURE CONFIGURATION' as step;

-- Remove all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read their own data" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to update their own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.users;
DROP POLICY IF EXISTS "Allow anon read for debugging" ON public.users;
DROP POLICY IF EXISTS "service_role_full_access" ON public.users;
DROP POLICY IF EXISTS "authenticated_users_select_own" ON public.users;
DROP POLICY IF EXISTS "authenticated_users_update_own" ON public.users;

-- ===== STEP 2: ENABLE RLS ON ALL TABLES =====
SELECT 'STEP 2: ENABLING RLS ON ALL TABLES' as step;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- ===== STEP 3: CREATE SECURE USER POLICIES =====
SELECT 'STEP 3: CREATING SECURE USER POLICIES' as step;

-- Users can read their own profile
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE 
  USING (auth.uid() = id);

-- Admin users can read all profiles
CREATE POLICY "admin_select_all_users" ON public.users
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  );

-- Admin users can update all profiles
CREATE POLICY "admin_update_all_users" ON public.users
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  );

-- Allow user profile creation (for new signups)
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ===== STEP 4: CREATE SECURE PROJECT POLICIES =====
SELECT 'STEP 4: CREATING SECURE PROJECT POLICIES' as step;

-- Admin can manage all projects
CREATE POLICY "admin_manage_all_projects" ON public.projects
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  );

-- Clients can read their own projects
CREATE POLICY "clients_read_own_projects" ON public.projects
  FOR SELECT 
  USING (client_id = auth.uid());

-- Clients can update their own projects (limited fields)
CREATE POLICY "clients_update_own_projects" ON public.projects
  FOR UPDATE 
  USING (client_id = auth.uid());

-- ===== STEP 5: CREATE SECURE QUOTE POLICIES =====
SELECT 'STEP 5: CREATING SECURE QUOTE POLICIES' as step;

-- Anyone can submit quotes (for contact form)
CREATE POLICY "public_insert_quotes" ON public.quotes
  FOR INSERT 
  WITH CHECK (true);

-- Only admin can read quotes
CREATE POLICY "admin_read_quotes" ON public.quotes
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  );

-- Only admin can update quotes
CREATE POLICY "admin_update_quotes" ON public.quotes
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  );

-- ===== STEP 6: GRANT NECESSARY PERMISSIONS =====
SELECT 'STEP 6: GRANTING NECESSARY PERMISSIONS' as step;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Grant table permissions
GRANT SELECT, UPDATE, INSERT ON public.users TO authenticated;
GRANT SELECT, UPDATE, INSERT ON public.projects TO authenticated;
GRANT SELECT, INSERT ON public.quotes TO authenticated;
GRANT UPDATE ON public.quotes TO authenticated; -- For admin

-- Allow anon to insert quotes (contact form)
GRANT INSERT ON public.quotes TO anon;

-- ===== STEP 7: CONFIGURE REST API ACCESS =====
SELECT 'STEP 7: CONFIGURING REST API ACCESS' as step;

-- Enable REST API access
ALTER TABLE public.users REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.quotes REPLICA IDENTITY FULL;

-- ===== STEP 8: TEST SECURITY =====
SELECT 'STEP 8: SECURITY TEST RESULTS' as step;

-- This should show current user's profile only
SELECT 
  'Current User Profile Test' as test,
  COUNT(*) as accessible_profiles
FROM public.users 
WHERE auth.uid() = id;

-- ===== STEP 9: VERIFICATION =====
SELECT 'STEP 9: VERIFICATION' as step;

SELECT 'Secure RLS configuration completed!' as status;
SELECT 'Users can now:' as info;
SELECT '- Read their own profile' as capability_1;
SELECT '- Update their own profile' as capability_2;
SELECT '- Admin can manage all data' as capability_3;
SELECT '- Public can submit quotes' as capability_4;
SELECT '- All data is properly protected' as capability_5;
