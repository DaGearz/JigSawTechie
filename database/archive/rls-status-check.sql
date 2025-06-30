-- RLS STATUS CHECK AND RE-ENABLE SCRIPT
-- Run this in Supabase SQL Editor to check and fix RLS policies

-- ===== CHECK CURRENT RLS STATUS =====
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'projects', 'client_messages', 'project_requests', 'notifications')
ORDER BY tablename;

-- ===== CHECK CURRENT POLICIES =====
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===== RE-ENABLE RLS IF DISABLED =====
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===== VERIFY ADMIN USER EXISTS =====
SELECT id, email, role, name 
FROM users 
WHERE role = 'admin'
ORDER BY email;

-- ===== CHECK RECENT MESSAGES =====
SELECT 
    cm.id,
    cm.subject,
    cm.message_type,
    cm.priority,
    cm.is_read,
    cm.created_at,
    sender.email as sender_email,
    sender.name as sender_name,
    recipient.email as recipient_email,
    recipient.name as recipient_name
FROM client_messages cm
JOIN users sender ON cm.sender_id = sender.id
JOIN users recipient ON cm.recipient_id = recipient.id
ORDER BY cm.created_at DESC
LIMIT 10;

-- ===== CHECK NOTIFICATIONS =====
SELECT 
    n.id,
    n.title,
    n.message,
    n.type,
    n.is_read,
    n.created_at,
    u.email as user_email,
    u.name as user_name
FROM notifications n
JOIN users u ON n.user_id = u.id
ORDER BY n.created_at DESC
LIMIT 10;
