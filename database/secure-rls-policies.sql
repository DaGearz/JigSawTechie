-- SECURE RLS POLICIES FOR PRODUCTION
-- Run this in Supabase SQL Editor to replace the overly permissive policies

-- ===== REMOVE INSECURE POLICIES =====
DROP POLICY IF EXISTS "Anyone can read quotes" ON quotes;
DROP POLICY IF EXISTS "Anyone can update quotes" ON quotes;
DROP POLICY IF EXISTS "Anyone can insert quotes" ON quotes;

-- ===== CREATE SECURE POLICIES =====

-- 1. Allow public quote submissions (for the contact form)
CREATE POLICY "Public can submit quotes" ON quotes
  FOR INSERT 
  WITH CHECK (true);

-- 2. Only authenticated admin users can read quotes
CREATE POLICY "Admin can read all quotes" ON quotes
  FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 3. Only authenticated admin users can update quotes
CREATE POLICY "Admin can update quotes" ON quotes
  FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 4. Only authenticated admin users can delete quotes (if needed)
CREATE POLICY "Admin can delete quotes" ON quotes
  FOR DELETE 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ===== SECURE USERS TABLE =====

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE 
  USING (auth.uid() = id);

-- Admin can read all users
CREATE POLICY "Admin can read all users" ON users
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Admin can update all users
CREATE POLICY "Admin can update all users" ON users
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ===== SECURE COMPANIES TABLE =====

-- Enable RLS on companies table
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Admin can manage all companies
CREATE POLICY "Admin can manage companies" ON companies
  FOR ALL 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Company members can read their company
CREATE POLICY "Company members can read own company" ON companies
  FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM company_roles cr
      WHERE cr.company_id = companies.id 
      AND cr.user_id = auth.uid()
    )
  );

-- ===== SECURE COMPANY ROLES TABLE =====

-- Enable RLS on company_roles table
ALTER TABLE company_roles ENABLE ROW LEVEL SECURITY;

-- Admin can manage all company roles
CREATE POLICY "Admin can manage company roles" ON company_roles
  FOR ALL 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Users can read their own company roles
CREATE POLICY "Users can read own company roles" ON company_roles
  FOR SELECT 
  USING (auth.uid() = user_id);

-- ===== SECURE PROJECTS TABLE =====

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Admin can manage all projects
CREATE POLICY "Admin can manage all projects" ON projects
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
CREATE POLICY "Users can read accessible projects" ON projects
  FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND
    (
      -- Project owner
      client_id = auth.uid() OR
      -- Has project access
      EXISTS (
        SELECT 1 FROM project_access pa
        WHERE pa.project_id = projects.id 
        AND pa.user_id = auth.uid()
      )
    )
  );

-- ===== SECURE PROJECT ACCESS TABLE =====

-- Enable RLS on project_access table
ALTER TABLE project_access ENABLE ROW LEVEL SECURITY;

-- Admin can manage all project access
CREATE POLICY "Admin can manage project access" ON project_access
  FOR ALL 
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Users can read their own project access
CREATE POLICY "Users can read own project access" ON project_access
  FOR SELECT 
  USING (auth.uid() = user_id);

-- ===== VERIFICATION QUERIES =====
-- Run these to verify policies are working:

-- This should return results only for admin users:
-- SELECT * FROM quotes;

-- This should work for anyone:
-- INSERT INTO quotes (name, email, project_type, budget, timeline, description) 
-- VALUES ('Test', 'test@example.com', 'Website', '$1000', '1 month', 'Test description');

-- ===== NOTES =====
-- 1. Make sure to create your admin user BEFORE applying these policies
-- 2. Test thoroughly in development before applying to production
-- 3. These policies assume the users table exists with proper role assignments
