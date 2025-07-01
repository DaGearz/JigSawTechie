-- ENABLE PRODUCTION RLS SECURITY
-- Run this script in Supabase SQL Editor to enable Row Level Security
-- IMPORTANT: Test thoroughly in development before running in production

-- ===== STEP 1: CLEAN UP EXISTING POLICIES =====
SELECT 'STEP 1: CLEANING UP EXISTING POLICIES' as step;

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can read quotes" ON quotes;
DROP POLICY IF EXISTS "Anyone can update quotes" ON quotes;
DROP POLICY IF EXISTS "Anyone can insert quotes" ON quotes;
DROP POLICY IF EXISTS "Public can submit quotes" ON quotes;
DROP POLICY IF EXISTS "Admin can read all quotes" ON quotes;
DROP POLICY IF EXISTS "Admin can update quotes" ON quotes;
DROP POLICY IF EXISTS "Admin can delete quotes" ON quotes;

-- Users table policies
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Admin can update all users" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;

-- Projects table policies
DROP POLICY IF EXISTS "Admin can manage all projects" ON projects;
DROP POLICY IF EXISTS "Users can read accessible projects" ON projects;

-- ===== STEP 2: ENABLE RLS ON ALL TABLES =====
SELECT 'STEP 2: ENABLING RLS ON ALL TABLES' as step;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_deployments ENABLE ROW LEVEL SECURITY;

-- ===== STEP 3: QUOTES TABLE POLICIES =====
SELECT 'STEP 3: CREATING QUOTES TABLE POLICIES' as step;

-- Allow public quote submissions (for contact form)
CREATE POLICY "public_can_submit_quotes" ON quotes
  FOR INSERT 
  WITH CHECK (true);

-- Only admin can read quotes
CREATE POLICY "admin_can_read_quotes" ON quotes
  FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Only admin can update quotes
CREATE POLICY "admin_can_update_quotes" ON quotes
  FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ===== STEP 4: USERS TABLE POLICIES =====
SELECT 'STEP 4: CREATING USERS TABLE POLICIES' as step;

-- Users can read their own profile
CREATE POLICY "users_can_read_own_profile" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON users
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow user profile creation during signup
CREATE POLICY "users_can_create_own_profile" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Admin can read all users
CREATE POLICY "admin_can_read_all_users" ON users
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  );

-- Admin can update all users
CREATE POLICY "admin_can_update_all_users" ON users
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  );

-- ===== STEP 5: PROJECTS TABLE POLICIES =====
SELECT 'STEP 5: CREATING PROJECTS TABLE POLICIES' as step;

-- Admin can manage all projects
CREATE POLICY "admin_can_manage_all_projects" ON projects
  FOR ALL 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Users can read projects they have access to
CREATE POLICY "users_can_read_accessible_projects" ON projects
  FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND
    (
      -- Project owner/client
      client_id = auth.uid() OR
      -- Has explicit project access
      EXISTS (
        SELECT 1 FROM project_access pa
        WHERE pa.project_id = projects.id 
        AND pa.user_id = auth.uid()
      )
    )
  );

-- ===== STEP 6: CLIENT MESSAGES POLICIES =====
SELECT 'STEP 6: CREATING CLIENT MESSAGES POLICIES' as step;

-- Users can read messages they sent or received
CREATE POLICY "users_can_read_own_messages" ON client_messages
  FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND
    (sender_id = auth.uid() OR recipient_id = auth.uid())
  );

-- Users can send messages
CREATE POLICY "users_can_send_messages" ON client_messages
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND
    sender_id = auth.uid()
  );

-- Users can update their own messages (mark as read, etc.)
CREATE POLICY "users_can_update_own_messages" ON client_messages
  FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND
    (sender_id = auth.uid() OR recipient_id = auth.uid())
  );

-- ===== STEP 7: SERVICE ROLE ACCESS =====
SELECT 'STEP 7: ENABLING SERVICE ROLE ACCESS' as step;

-- Allow service role full access for API operations
CREATE POLICY "service_role_full_access_users" ON users
  FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_full_access_quotes" ON quotes
  FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_full_access_projects" ON projects
  FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_full_access_messages" ON client_messages
  FOR ALL 
  USING (auth.role() = 'service_role');

-- ===== STEP 8: VERIFICATION =====
SELECT 'STEP 8: VERIFICATION COMPLETE' as step;

-- Test queries (run these manually to verify)
-- SELECT 'RLS enabled on users:' as test, COUNT(*) as count FROM users;
-- SELECT 'RLS enabled on quotes:' as test, COUNT(*) as count FROM quotes;
-- SELECT 'RLS enabled on projects:' as test, COUNT(*) as count FROM projects;

SELECT 'RLS SECURITY POLICIES ENABLED SUCCESSFULLY!' as status;
SELECT 'All tables now have Row Level Security enabled' as info;
SELECT 'Service role maintains full access for API operations' as api_info;
SELECT 'Test the application thoroughly before deploying to production' as warning;
