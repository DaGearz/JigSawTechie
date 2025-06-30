-- SECURITY AUDIT: Check if your database is properly secured
-- Run this to verify RLS status and security policies

-- ===== SECTION 1: RLS STATUS CHECK =====
SELECT 'SECTION 1: RLS STATUS' as section;

SELECT 
  'RLS Status' as check_type,
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity = true THEN '✅ SECURE'
    ELSE '❌ INSECURE - RLS DISABLED'
  END as security_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'projects', 'quotes', 'project_updates', 'project_files')
ORDER BY tablename;

-- ===== SECTION 2: POLICY ANALYSIS =====
SELECT 'SECTION 2: CURRENT POLICIES' as section;

SELECT 
  'Policy Details' as check_type,
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN cmd = 'SELECT' THEN '👁️ READ'
    WHEN cmd = 'INSERT' THEN '➕ CREATE'
    WHEN cmd = 'UPDATE' THEN '✏️ MODIFY'
    WHEN cmd = 'DELETE' THEN '🗑️ DELETE'
    WHEN cmd = 'ALL' THEN '🔓 FULL ACCESS'
  END as permission_type,
  qual as condition
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- ===== SECTION 3: SECURITY GAPS ANALYSIS =====
SELECT 'SECTION 3: SECURITY GAPS' as section;

-- Check for tables without RLS
SELECT 
  'Tables without RLS' as security_issue,
  tablename,
  '❌ CRITICAL: No access control' as risk_level
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'projects', 'quotes', 'project_updates', 'project_files')
AND rowsecurity = false;

-- Check for overly permissive policies
SELECT 
  'Overly Permissive Policies' as security_issue,
  tablename,
  policyname,
  '⚠️ WARNING: May allow unauthorized access' as risk_level
FROM pg_policies 
WHERE schemaname = 'public'
AND (qual IS NULL OR qual = 'true' OR cmd = 'ALL');

-- ===== SECTION 4: RECOMMENDED SECURITY IMPROVEMENTS =====
SELECT 'SECTION 4: SECURITY RECOMMENDATIONS' as section;

-- Users table security
SELECT 
  'Users Table Security' as recommendation,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'users' 
      AND cmd = 'SELECT' 
      AND qual LIKE '%auth.uid()%'
    ) THEN '✅ Users can only read own data'
    ELSE '❌ NEEDS FIX: Users may access other user data'
  END as status;

-- Projects table security  
SELECT 
  'Projects Table Security' as recommendation,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = 'projects' 
      AND rowsecurity = true
    ) THEN '✅ Projects table has RLS enabled'
    ELSE '❌ NEEDS FIX: Projects table needs RLS'
  END as status;

-- Quotes table security
SELECT 
  'Quotes Table Security' as recommendation,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'quotes' 
      AND cmd = 'SELECT'
      AND qual LIKE '%admin%'
    ) THEN '✅ Only admins can read quotes'
    ELSE '❌ NEEDS FIX: Quotes may be publicly readable'
  END as status;

-- ===== SECTION 5: OVERALL SECURITY SCORE =====
SELECT 'SECTION 5: SECURITY SCORE' as section;

WITH security_metrics AS (
  SELECT 
    COUNT(*) as total_tables,
    COUNT(CASE WHEN rowsecurity = true THEN 1 END) as secured_tables,
    COUNT(CASE WHEN rowsecurity = false THEN 1 END) as unsecured_tables
  FROM pg_tables 
  WHERE schemaname = 'public' 
  AND tablename IN ('users', 'projects', 'quotes', 'project_updates', 'project_files')
)
SELECT 
  'Overall Security Score' as metric,
  CONCAT(
    ROUND((secured_tables::float / total_tables::float) * 100, 0), 
    '% (',
    secured_tables, 
    '/', 
    total_tables, 
    ' tables secured)'
  ) as score,
  CASE 
    WHEN secured_tables = total_tables THEN '🟢 EXCELLENT'
    WHEN secured_tables >= total_tables * 0.8 THEN '🟡 GOOD'
    WHEN secured_tables >= total_tables * 0.5 THEN '🟠 NEEDS IMPROVEMENT'
    ELSE '🔴 CRITICAL - IMMEDIATE ACTION REQUIRED'
  END as security_level
FROM security_metrics;

SELECT 'Security audit complete!' as status;
