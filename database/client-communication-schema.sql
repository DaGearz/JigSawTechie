-- CLIENT COMMUNICATION SYSTEM DATABASE SCHEMA
-- Run this in Supabase SQL Editor to add communication features

-- ===== PROJECT REQUESTS TABLE =====
-- Clients can submit project requests that admins review and approve
CREATE TABLE IF NOT EXISTS project_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_type TEXT NOT NULL, -- 'website', 'app', 'ecommerce', 'custom'
  budget_range TEXT NOT NULL, -- '$1,000-$2,500', '$2,500-$5,000', etc.
  timeline TEXT NOT NULL, -- '1 month', '2-3 months', etc.
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  features TEXT[], -- Array of requested features
  additional_info TEXT, -- Any extra details
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'declined', 'converted')),
  admin_notes TEXT, -- Admin's internal notes
  reviewed_by UUID REFERENCES users(id), -- Which admin reviewed it
  reviewed_at TIMESTAMP WITH TIME ZONE,
  converted_project_id UUID REFERENCES projects(id), -- If approved and converted to project
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== CLIENT MESSAGES TABLE =====
-- Direct messaging between clients and admin
CREATE TABLE IF NOT EXISTS client_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- Optional: message about specific project
  project_request_id UUID REFERENCES project_requests(id) ON DELETE CASCADE, -- Optional: message about project request
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  message_type TEXT DEFAULT 'general' CHECK (message_type IN ('general', 'project_inquiry', 'support', 'feedback')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== NOTIFICATIONS TABLE =====
-- System notifications for admins and clients
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('project_request', 'message', 'project_update', 'system')),
  related_id UUID, -- ID of related record (project_request, message, etc.)
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT, -- URL to navigate to when clicked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_project_requests_client_id ON project_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_requests_created_at ON project_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_client_messages_sender_id ON client_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_recipient_id ON client_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_project_id ON client_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_is_read ON client_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_client_messages_created_at ON client_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ===== TRIGGERS FOR AUTOMATIC TIMESTAMPS =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_project_requests_updated_at ON project_requests;
CREATE TRIGGER update_project_requests_updated_at 
    BEFORE UPDATE ON project_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_client_messages_updated_at ON client_messages;
CREATE TRIGGER update_client_messages_updated_at 
    BEFORE UPDATE ON client_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== NOTIFICATION TRIGGERS =====
-- Automatically create notifications when events happen

-- Trigger for new project requests
CREATE OR REPLACE FUNCTION notify_admin_new_project_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all admin users
  INSERT INTO notifications (user_id, title, message, type, related_id, action_url)
  SELECT 
    u.id,
    'New Project Request',
    'New project request from ' || (SELECT name FROM users WHERE id = NEW.client_id),
    'project_request',
    NEW.id,
    '/admin#project-requests'
  FROM users u 
  WHERE u.role = 'admin';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_admin_new_project_request ON project_requests;
CREATE TRIGGER trigger_notify_admin_new_project_request
  AFTER INSERT ON project_requests
  FOR EACH ROW EXECUTE FUNCTION notify_admin_new_project_request();

-- Trigger for new messages
CREATE OR REPLACE FUNCTION notify_message_recipient()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify the recipient
  INSERT INTO notifications (user_id, title, message, type, related_id, action_url)
  VALUES (
    NEW.recipient_id,
    'New Message: ' || NEW.subject,
    'New message from ' || (SELECT name FROM users WHERE id = NEW.sender_id),
    'message',
    NEW.id,
    CASE 
      WHEN (SELECT role FROM users WHERE id = NEW.recipient_id) = 'admin' 
      THEN '/admin#messages'
      ELSE '/dashboard/' || NEW.recipient_id::text || '#messages'
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_message_recipient ON client_messages;
CREATE TRIGGER trigger_notify_message_recipient
  AFTER INSERT ON client_messages
  FOR EACH ROW EXECUTE FUNCTION notify_message_recipient();

-- ===== ROW LEVEL SECURITY POLICIES =====
-- Enable RLS on new tables
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Project Requests Policies
CREATE POLICY "clients_can_create_own_requests" ON project_requests
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "clients_can_read_own_requests" ON project_requests
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "clients_can_update_own_requests" ON project_requests
  FOR UPDATE USING (auth.uid() = client_id AND status = 'pending');

CREATE POLICY "admin_can_manage_all_requests" ON project_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Messages Policies
CREATE POLICY "users_can_send_messages" ON client_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "users_can_read_their_messages" ON client_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "users_can_update_their_received_messages" ON client_messages
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Notifications Policies
CREATE POLICY "users_can_read_own_notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ===== GRANT PERMISSIONS =====
GRANT SELECT, INSERT, UPDATE ON project_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON client_messages TO authenticated;
GRANT SELECT, UPDATE ON notifications TO authenticated;

-- ===== VERIFICATION =====
SELECT 'Client communication system database schema created successfully!' as status;
SELECT 'Tables created: project_requests, client_messages, notifications' as info;
SELECT 'RLS policies applied for security' as security_info;
SELECT 'Automatic notifications enabled' as automation_info;
