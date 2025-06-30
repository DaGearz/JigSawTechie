-- SAFE CLEANUP: Remove test users while preserving admin and handling foreign keys
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what users we have
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'role' as role_in_metadata,
  u.role as role_in_users_table,
  au.created_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
ORDER BY au.created_at;

-- 2. Find your admin user ID (replace with your actual admin email)
DO $$
DECLARE
    admin_user_id UUID;
    test_user_record RECORD;
BEGIN
    -- Get admin user ID (using your correct admin email)
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'twilliams@jigsawtechie.com' OR raw_user_meta_data->>'role' = 'admin'
    LIMIT 1;

    RAISE NOTICE 'Admin user ID: %', admin_user_id;

    -- Delete related data for non-admin users first (to handle foreign keys)
    -- Delete project files for projects owned by non-admin users
    DELETE FROM public.project_files
    WHERE project_id IN (
        SELECT p.id FROM public.projects p
        WHERE p.client_id != admin_user_id
    );

    -- Delete project updates for projects owned by non-admin users
    DELETE FROM public.project_updates
    WHERE project_id IN (
        SELECT p.id FROM public.projects p
        WHERE p.client_id != admin_user_id
    );

    -- Delete projects owned by non-admin users
    DELETE FROM public.projects
    WHERE client_id != admin_user_id;

    -- Now safe to delete non-admin users from public.users
    DELETE FROM public.users
    WHERE id != admin_user_id;

    -- Finally, delete non-admin users from auth.users
    DELETE FROM auth.users
    WHERE id != admin_user_id;

    RAISE NOTICE 'Cleanup completed. Only admin user should remain.';
END $$;

-- 3. Verify cleanup - should only show admin user
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'role' as role_in_metadata,
  u.role as role_in_users_table,
  au.created_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
ORDER BY au.created_at;
