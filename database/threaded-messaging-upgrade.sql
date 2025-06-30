-- THREADED MESSAGING SYSTEM UPGRADE
-- Run this in Supabase SQL Editor to add threading support

-- ===== ADD THREAD SUPPORT TO CLIENT_MESSAGES =====

-- Add thread_id column to group related messages
ALTER TABLE client_messages 
ADD COLUMN IF NOT EXISTS thread_id UUID;

-- Add reply_to_id to reference parent message
ALTER TABLE client_messages 
ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES client_messages(id) ON DELETE SET NULL;

-- Add thread_subject for the main thread topic
ALTER TABLE client_messages 
ADD COLUMN IF NOT EXISTS thread_subject TEXT;

-- Add is_thread_starter to identify the first message in a thread
ALTER TABLE client_messages 
ADD COLUMN IF NOT EXISTS is_thread_starter BOOLEAN DEFAULT FALSE;

-- ===== UPDATE EXISTING MESSAGES TO BE THREAD STARTERS =====

-- Set existing messages as thread starters and create thread IDs
UPDATE client_messages 
SET 
  thread_id = id,
  thread_subject = subject,
  is_thread_starter = TRUE
WHERE thread_id IS NULL;

-- ===== CREATE EMAIL NOTIFICATIONS TABLE =====

CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  thread_id UUID NOT NULL,
  is_reply BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== CREATE INDEXES FOR PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_client_messages_thread_id ON client_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_reply_to_id ON client_messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_sender_recipient ON client_messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created_at ON email_notifications(created_at);

-- ===== CREATE MESSAGE THREADS VIEW =====

CREATE OR REPLACE VIEW message_threads AS
SELECT 
  cm.thread_id,
  cm.thread_subject,
  cm.sender_id as thread_starter_id,
  cm.recipient_id as thread_recipient_id,
  cm.created_at as thread_started_at,
  COUNT(replies.id) as reply_count,
  MAX(COALESCE(replies.created_at, cm.created_at)) as last_activity,
  BOOL_OR(NOT cm.is_read) OR BOOL_OR(NOT COALESCE(replies.is_read, TRUE)) as has_unread,
  starter_user.name as starter_name,
  starter_user.email as starter_email,
  recipient_user.name as recipient_name,
  recipient_user.email as recipient_email
FROM client_messages cm
LEFT JOIN client_messages replies ON replies.thread_id = cm.thread_id AND replies.id != cm.id
LEFT JOIN users starter_user ON starter_user.id = cm.sender_id
LEFT JOIN users recipient_user ON recipient_user.id = cm.recipient_id
WHERE cm.is_thread_starter = TRUE
GROUP BY 
  cm.thread_id, cm.thread_subject, cm.sender_id, cm.recipient_id, 
  cm.created_at, starter_user.name, starter_user.email,
  recipient_user.name, recipient_user.email
ORDER BY last_activity DESC;

-- ===== CREATE FUNCTION TO GET THREAD MESSAGES =====

CREATE OR REPLACE FUNCTION get_thread_messages(thread_uuid UUID)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  recipient_id UUID,
  message TEXT,
  is_read BOOLEAN,
  reply_to_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  sender_name TEXT,
  sender_email TEXT,
  recipient_name TEXT,
  recipient_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.id,
    cm.sender_id,
    cm.recipient_id,
    cm.message,
    cm.is_read,
    cm.reply_to_id,
    cm.created_at,
    sender_user.name as sender_name,
    sender_user.email as sender_email,
    recipient_user.name as recipient_name,
    recipient_user.email as recipient_email
  FROM client_messages cm
  LEFT JOIN users sender_user ON sender_user.id = cm.sender_id
  LEFT JOIN users recipient_user ON recipient_user.id = cm.recipient_id
  WHERE cm.thread_id = thread_uuid
  ORDER BY cm.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- ===== CREATE FUNCTION TO START NEW THREAD =====

CREATE OR REPLACE FUNCTION start_message_thread(
  p_sender_id UUID,
  p_recipient_id UUID,
  p_subject TEXT,
  p_message TEXT,
  p_message_type TEXT DEFAULT 'general',
  p_priority TEXT DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
  new_thread_id UUID;
  new_message_id UUID;
BEGIN
  -- Generate new thread ID
  new_thread_id := gen_random_uuid();
  
  -- Insert the thread starter message
  INSERT INTO client_messages (
    id,
    thread_id,
    sender_id,
    recipient_id,
    subject,
    thread_subject,
    message,
    message_type,
    priority,
    is_thread_starter
  ) VALUES (
    gen_random_uuid(),
    new_thread_id,
    p_sender_id,
    p_recipient_id,
    p_subject,
    p_subject,
    p_message,
    p_message_type,
    p_priority,
    TRUE
  ) RETURNING id INTO new_message_id;
  
  RETURN new_thread_id;
END;
$$ LANGUAGE plpgsql;

-- ===== CREATE FUNCTION TO REPLY TO THREAD =====

CREATE OR REPLACE FUNCTION reply_to_thread(
  p_thread_id UUID,
  p_sender_id UUID,
  p_recipient_id UUID,
  p_message TEXT,
  p_reply_to_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_message_id UUID;
  thread_subject_text TEXT;
BEGIN
  -- Get the thread subject
  SELECT thread_subject INTO thread_subject_text
  FROM client_messages 
  WHERE thread_id = p_thread_id AND is_thread_starter = TRUE
  LIMIT 1;
  
  -- Insert the reply message
  INSERT INTO client_messages (
    id,
    thread_id,
    sender_id,
    recipient_id,
    subject,
    thread_subject,
    message,
    message_type,
    priority,
    reply_to_id,
    is_thread_starter
  ) VALUES (
    gen_random_uuid(),
    p_thread_id,
    p_sender_id,
    p_recipient_id,
    'Re: ' || thread_subject_text,
    thread_subject_text,
    p_message,
    'general',
    'normal',
    p_reply_to_id,
    FALSE
  ) RETURNING id INTO new_message_id;
  
  RETURN new_message_id;
END;
$$ LANGUAGE plpgsql;

-- ===== UPDATE NOTIFICATION TRIGGER FOR THREADS =====

CREATE OR REPLACE FUNCTION notify_message_recipient()
RETURNS TRIGGER AS $$
BEGIN
  -- Create in-app notification
  INSERT INTO notifications (user_id, title, message, type, related_id, action_url)
  VALUES (
    NEW.recipient_id,
    CASE
      WHEN NEW.is_thread_starter THEN 'New Message: ' || NEW.subject
      ELSE 'Reply to: ' || NEW.thread_subject
    END,
    CASE
      WHEN NEW.is_thread_starter THEN 'New message from ' || (SELECT name FROM users WHERE id = NEW.sender_id)
      ELSE 'Reply from ' || (SELECT name FROM users WHERE id = NEW.sender_id)
    END,
    'message',
    NEW.thread_id,
    CASE
      WHEN (SELECT role FROM users WHERE id = NEW.recipient_id) = 'admin'
      THEN '/admin#messages'
      ELSE '/dashboard/' || NEW.recipient_id::text || '#messages'
    END
  );

  -- Create email notification record (to be processed by background job)
  INSERT INTO email_notifications (
    recipient_email,
    recipient_name,
    sender_email,
    sender_name,
    subject,
    message,
    thread_id,
    is_reply,
    priority,
    status
  )
  SELECT
    recipient.email,
    recipient.name,
    sender.email,
    sender.name,
    NEW.subject,
    NEW.message,
    NEW.thread_id,
    NOT NEW.is_thread_starter,
    NEW.priority,
    'pending'
  FROM users recipient, users sender
  WHERE recipient.id = NEW.recipient_id
    AND sender.id = NEW.sender_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== VERIFICATION QUERIES =====

-- Check the updated schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'client_messages' 
ORDER BY ordinal_position;

-- Check existing threads
SELECT * FROM message_threads LIMIT 5;

-- Test thread functions (uncomment to test)
-- SELECT start_message_thread(
--   (SELECT id FROM users WHERE role = 'client' LIMIT 1),
--   (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
--   'Test Thread',
--   'This is a test message thread'
-- );
