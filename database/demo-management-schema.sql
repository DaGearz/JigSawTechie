-- DEMO MANAGEMENT SYSTEM SCHEMA
-- Run this in Supabase SQL Editor to add demo management features

-- ===== ADD DEMO FIELDS TO PROJECTS TABLE =====

-- Add demo management columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS demo_password TEXT,
ADD COLUMN IF NOT EXISTS demo_status TEXT DEFAULT 'not_ready' CHECK (demo_status IN ('not_ready', 'ready', 'live', 'maintenance', 'archived')),
ADD COLUMN IF NOT EXISTS demo_notes TEXT,
ADD COLUMN IF NOT EXISTS demo_last_updated TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS demo_access_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS demo_feedback TEXT[];

-- ===== DEMO ACCESS LOGS TABLE =====
-- Track who accesses demos and when
CREATE TABLE IF NOT EXISTS demo_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  access_type TEXT DEFAULT 'view' CHECK (access_type IN ('view', 'download', 'feedback')),
  ip_address INET,
  user_agent TEXT,
  access_duration INTEGER, -- in seconds
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  feedback_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== DEMO FEEDBACK TABLE =====
-- Structured feedback from clients about demos
CREATE TABLE IF NOT EXISTS demo_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback_type TEXT DEFAULT 'general' CHECK (feedback_type IN ('general', 'design', 'functionality', 'performance', 'content')),
  comment TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  admin_response TEXT,
  responded_by UUID REFERENCES users(id),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== DEMO DEPLOYMENT HISTORY =====
-- Track demo deployments and versions
CREATE TABLE IF NOT EXISTS demo_deployments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  version_name TEXT NOT NULL,
  deployment_url TEXT NOT NULL,
  deployment_status TEXT DEFAULT 'deploying' CHECK (deployment_status IN ('deploying', 'success', 'failed', 'rollback')),
  deployment_size INTEGER, -- in bytes
  deployment_notes TEXT,
  deployed_by UUID REFERENCES users(id) NOT NULL,
  deployment_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deployment_completed_at TIMESTAMP WITH TIME ZONE,
  is_current BOOLEAN DEFAULT FALSE
);

-- ===== INDEXES FOR PERFORMANCE =====

-- Demo access logs indexes
CREATE INDEX IF NOT EXISTS idx_demo_access_logs_project_id ON demo_access_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_demo_access_logs_user_id ON demo_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_access_logs_created_at ON demo_access_logs(created_at);

-- Demo feedback indexes
CREATE INDEX IF NOT EXISTS idx_demo_feedback_project_id ON demo_feedback(project_id);
CREATE INDEX IF NOT EXISTS idx_demo_feedback_user_id ON demo_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_feedback_rating ON demo_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_demo_feedback_is_resolved ON demo_feedback(is_resolved);

-- Demo deployments indexes
CREATE INDEX IF NOT EXISTS idx_demo_deployments_project_id ON demo_deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_demo_deployments_is_current ON demo_deployments(is_current);
CREATE INDEX IF NOT EXISTS idx_demo_deployments_status ON demo_deployments(deployment_status);

-- ===== RLS POLICIES =====

-- Demo access logs: Admins can see all, users can see their own
ALTER TABLE demo_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all demo access logs" ON demo_access_logs
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Users can view their own demo access logs" ON demo_access_logs
  FOR SELECT 
  USING (user_id = auth.uid());

-- Demo feedback: Admins can see all, users can see their own
ALTER TABLE demo_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all demo feedback" ON demo_feedback
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Users can manage their own demo feedback" ON demo_feedback
  FOR ALL 
  USING (user_id = auth.uid());

-- Demo deployments: Admin only
ALTER TABLE demo_deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage demo deployments" ON demo_deployments
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- ===== FUNCTIONS =====

-- Function to log demo access
CREATE OR REPLACE FUNCTION log_demo_access(
  p_project_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_access_type TEXT DEFAULT 'view',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO demo_access_logs (project_id, user_id, access_type, ip_address, user_agent)
  VALUES (p_project_id, p_user_id, p_access_type, p_ip_address, p_user_agent)
  RETURNING id INTO log_id;
  
  -- Update access count on project
  UPDATE projects 
  SET demo_access_count = COALESCE(demo_access_count, 0) + 1,
      demo_last_updated = NOW()
  WHERE id = p_project_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to submit demo feedback
CREATE OR REPLACE FUNCTION submit_demo_feedback(
  p_project_id UUID,
  p_user_id UUID,
  p_rating INTEGER,
  p_feedback_type TEXT,
  p_comment TEXT
)
RETURNS UUID AS $$
DECLARE
  feedback_id UUID;
BEGIN
  INSERT INTO demo_feedback (project_id, user_id, rating, feedback_type, comment)
  VALUES (p_project_id, p_user_id, p_rating, p_feedback_type, p_comment)
  RETURNING id INTO feedback_id;
  
  -- Update project demo feedback array
  UPDATE projects 
  SET demo_feedback = COALESCE(demo_feedback, ARRAY[]::TEXT[]) || ARRAY[p_comment],
      demo_last_updated = NOW()
  WHERE id = p_project_id;
  
  RETURN feedback_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deploy demo
CREATE OR REPLACE FUNCTION deploy_demo(
  p_project_id UUID,
  p_version_name TEXT,
  p_deployment_url TEXT,
  p_deployed_by UUID,
  p_deployment_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  deployment_id UUID;
BEGIN
  -- Mark all previous deployments as not current
  UPDATE demo_deployments 
  SET is_current = FALSE 
  WHERE project_id = p_project_id;
  
  -- Create new deployment record
  INSERT INTO demo_deployments (
    project_id, version_name, deployment_url, deployed_by, deployment_notes, is_current
  )
  VALUES (
    p_project_id, p_version_name, p_deployment_url, p_deployed_by, p_deployment_notes, TRUE
  )
  RETURNING id INTO deployment_id;
  
  -- Update project demo URL and status
  UPDATE projects 
  SET demo_url = p_deployment_url,
      demo_status = 'ready',
      demo_last_updated = NOW()
  WHERE id = p_project_id;
  
  RETURN deployment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== TRIGGERS =====

-- Update demo_feedback updated_at timestamp
CREATE OR REPLACE FUNCTION update_demo_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_demo_feedback_updated_at ON demo_feedback;
CREATE TRIGGER update_demo_feedback_updated_at 
    BEFORE UPDATE ON demo_feedback 
    FOR EACH ROW EXECUTE FUNCTION update_demo_feedback_updated_at();

-- ===== VERIFICATION QUERIES =====
-- Run these to verify the schema was created correctly

-- Check if demo columns were added to projects
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'projects' 
-- AND column_name LIKE 'demo_%';

-- Check if new tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('demo_access_logs', 'demo_feedback', 'demo_deployments');

-- Check if functions exist
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name IN ('log_demo_access', 'submit_demo_feedback', 'deploy_demo');
