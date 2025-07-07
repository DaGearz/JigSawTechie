-- 🏗️ JigsawTechie Demo System Database Schema
-- Run this in Supabase SQL Editor to add demo functionality

-- =====================================================
-- 1. CREATE DEMO_PROJECTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS demo_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    demo_name VARCHAR(255) NOT NULL,
    demo_slug VARCHAR(255) NOT NULL UNIQUE, -- URL-friendly version for /demo/[slug]
    demo_path VARCHAR(500) NOT NULL, -- Local file path on server
    demo_url VARCHAR(500) NOT NULL, -- Full URL: jigsawtechie.com/demo/[slug]
    status VARCHAR(50) DEFAULT 'preparing' CHECK (status IN ('preparing', 'building', 'ready', 'error', 'archived')),
    build_type VARCHAR(50) DEFAULT 'static' CHECK (build_type IN ('static', 'nextjs', 'react', 'html')),
    file_size_mb DECIMAL(10,2), -- Track demo file size
    deployed_at TIMESTAMP,
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Ensure one demo per project (for now)
    UNIQUE(project_id)
);

-- =====================================================
-- 2. UPDATE PROJECTS TABLE
-- =====================================================

-- Add demo-related columns to existing projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS has_demo BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS demo_id UUID REFERENCES demo_projects(id);

-- =====================================================
-- 3. CREATE DEMO_ACCESS_LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS demo_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID REFERENCES demo_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    accessed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    session_duration INTEGER -- in seconds
);

-- =====================================================
-- 4. CREATE DEMO_PERMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS demo_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID REFERENCES demo_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_type VARCHAR(50) DEFAULT 'view' CHECK (permission_type IN ('view', 'admin', 'edit')),
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP, -- Optional expiration
    
    -- Prevent duplicate permissions
    UNIQUE(demo_id, user_id, permission_type)
);

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for fast demo lookups by slug
CREATE INDEX IF NOT EXISTS idx_demo_projects_slug ON demo_projects(demo_slug);

-- Index for project-demo relationships
CREATE INDEX IF NOT EXISTS idx_demo_projects_project_id ON demo_projects(project_id);

-- Index for demo status queries
CREATE INDEX IF NOT EXISTS idx_demo_projects_status ON demo_projects(status);

-- Index for access log queries
CREATE INDEX IF NOT EXISTS idx_demo_access_logs_demo_id ON demo_access_logs(demo_id);
CREATE INDEX IF NOT EXISTS idx_demo_access_logs_user_id ON demo_access_logs(user_id);

-- Index for permission queries
CREATE INDEX IF NOT EXISTS idx_demo_permissions_demo_user ON demo_permissions(demo_id, user_id);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all demo tables
ALTER TABLE demo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_permissions ENABLE ROW LEVEL SECURITY;

-- Demo Projects Policies
CREATE POLICY "Admins can manage all demo projects" ON demo_projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'todd@jigsawtechie.com'
        )
    );

CREATE POLICY "Users can view demos they have access to" ON demo_projects
    FOR SELECT USING (
        -- Admin access
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'todd@jigsawtechie.com'
        )
        OR
        -- Client access to their project demos
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = demo_projects.project_id
            AND p.client_id = auth.uid()
        )
        OR
        -- Explicit permission access
        EXISTS (
            SELECT 1 FROM demo_permissions dp
            WHERE dp.demo_id = demo_projects.id
            AND dp.user_id = auth.uid()
            AND (dp.expires_at IS NULL OR dp.expires_at > NOW())
        )
    );

-- Demo Access Logs Policies
CREATE POLICY "Users can view their own access logs" ON demo_access_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert access logs" ON demo_access_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all access logs" ON demo_access_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'todd@jigsawtechie.com'
        )
    );

-- Demo Permissions Policies
CREATE POLICY "Admins can manage all demo permissions" ON demo_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'todd@jigsawtechie.com'
        )
    );

CREATE POLICY "Users can view their own demo permissions" ON demo_permissions
    FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to generate demo slug from project name
CREATE OR REPLACE FUNCTION generate_demo_slug(project_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(
        regexp_replace(project_name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
    ));
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can access demo
CREATE OR REPLACE FUNCTION can_access_demo(demo_slug TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    demo_record RECORD;
    is_admin BOOLEAN;
    has_access BOOLEAN := FALSE;
BEGIN
    -- Check if user is admin
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = user_id 
        AND email = 'todd@jigsawtechie.com'
    ) INTO is_admin;
    
    IF is_admin THEN
        RETURN TRUE;
    END IF;
    
    -- Get demo record
    SELECT * FROM demo_projects WHERE demo_projects.demo_slug = demo_slug INTO demo_record;
    
    IF demo_record IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user is the project client
    SELECT EXISTS (
        SELECT 1 FROM projects 
        WHERE id = demo_record.project_id 
        AND client_id = user_id
    ) INTO has_access;
    
    IF has_access THEN
        RETURN TRUE;
    END IF;
    
    -- Check explicit permissions
    SELECT EXISTS (
        SELECT 1 FROM demo_permissions 
        WHERE demo_id = demo_record.id 
        AND demo_permissions.user_id = can_access_demo.user_id
        AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO has_access;
    
    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================

-- Uncomment to insert sample demo data for testing
/*
INSERT INTO demo_projects (project_id, demo_name, demo_slug, demo_path, demo_url, status, build_type, created_by)
SELECT 
    p.id,
    'Demo: ' || p.name,
    generate_demo_slug(p.name),
    '/demos/' || generate_demo_slug(p.name),
    'https://jigsawtechie.com/demo/' || generate_demo_slug(p.name),
    'preparing',
    'static',
    p.created_by
FROM projects p
WHERE p.name ILIKE '%test%'
LIMIT 1;
*/

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================

-- Verify tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%demo%'
ORDER BY table_name;
