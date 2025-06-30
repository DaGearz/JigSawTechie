-- Company Management System Database Schema
-- Run this in your Supabase SQL Editor

-- ===== COMPANIES TABLE =====
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  billing_email TEXT,
  billing_address TEXT,
  phone TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== COMPANY ROLES TABLE =====
CREATE TABLE IF NOT EXISTS company_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'member', 'billing_contact')),
  permissions JSONB DEFAULT '{"view_all_projects": false, "manage_team": false, "billing_access": false}',
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- ===== PROJECT ACCESS TABLE =====
CREATE TABLE IF NOT EXISTS project_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  access_level TEXT DEFAULT 'viewer' CHECK (access_level IN ('owner', 'collaborator', 'viewer')),
  permissions JSONB DEFAULT '{"view_demo": true, "view_files": false, "comment": false, "approve": false, "download": false}',
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- ===== ENHANCE EXISTING TABLES =====

-- Add company and billing fields to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS billing_type TEXT DEFAULT 'individual' CHECK (billing_type IN ('individual', 'company')),
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id),
ADD COLUMN IF NOT EXISTS billing_contact_id UUID REFERENCES users(id);

-- Add company fields to users table (optional)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company_role TEXT,
ADD COLUMN IF NOT EXISTS primary_contact BOOLEAN DEFAULT FALSE;

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_company_roles_company_id ON company_roles(company_id);
CREATE INDEX IF NOT EXISTS idx_company_roles_user_id ON company_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_project_access_project_id ON project_access(project_id);
CREATE INDEX IF NOT EXISTS idx_project_access_user_id ON project_access(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_billing_contact_id ON projects(billing_contact_id);

-- ===== ROW LEVEL SECURITY POLICIES =====
-- Note: RLS is currently disabled, but here are the policies for when you enable it

-- Companies: Only admins can manage companies
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admins can manage companies" ON companies FOR ALL USING (
--   EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
-- );

-- Company Roles: Only admins and company owners can manage roles
-- ALTER TABLE company_roles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admins and company owners can manage roles" ON company_roles FOR ALL USING (
--   EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
--   OR EXISTS (
--     SELECT 1 FROM company_roles cr 
--     WHERE cr.user_id = auth.uid() 
--     AND cr.company_id = company_roles.company_id 
--     AND cr.role IN ('owner', 'admin')
--   )
-- );

-- Project Access: Only admins can manage project access
-- ALTER TABLE project_access ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admins can manage project access" ON project_access FOR ALL USING (
--   EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
-- );

-- ===== FUNCTIONS FOR AUTOMATIC TIMESTAMPS =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== SAMPLE DATA (OPTIONAL) =====
-- Uncomment to add sample companies for testing

-- INSERT INTO companies (name, billing_email, billing_address, phone, website, notes) VALUES
-- ('Acme Corporation', 'billing@acme.com', '123 Business St, City, State 12345', '555-0123', 'https://acme.com', 'Large enterprise client'),
-- ('StartupXYZ', 'finance@startupxyz.com', '456 Innovation Ave, Tech City, TC 67890', '555-0456', 'https://startupxyz.com', 'Fast-growing startup'),
-- ('Local Business LLC', 'owner@localbiz.com', '789 Main St, Hometown, HT 11111', '555-0789', 'https://localbiz.com', 'Small local business');

-- ===== VERIFICATION QUERIES =====
-- Run these to verify the schema was created correctly

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('companies', 'company_roles', 'project_access');

-- Check if columns were added to existing tables
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'projects' 
-- AND column_name IN ('billing_type', 'company_id', 'billing_contact_id');

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('companies', 'company_roles', 'project_access');
