# 🚀 Jigsaw Techie - Pre-Launch Checklist

## 🔒 **CRITICAL SECURITY TASKS** (Must Complete Before Launch)

### **Database Security**
- [ ] **Apply Secure RLS Policies**
  - Run `database/secure-rls-policies.sql` in Supabase SQL Editor
  - This replaces the overly permissive "anyone can read/update" policies
  - **CRITICAL**: Without this, all customer data is publicly accessible

- [ ] **Create Admin User**
  - Run `node setup-admin.js` to create your admin account
  - Change the default password immediately
  - Test admin login at `/admin`

- [ ] **Verify Security**
  - Test that non-admin users cannot access `/admin`
  - Verify quote submissions work for public users
  - Confirm only admin can view/manage quotes

### **Environment Security**
- [ ] **Production Environment Variables**
  - Create production Supabase project (or use existing)
  - Set environment variables in Vercel dashboard
  - Never commit `.env.local` to git

## 🚀 **DEPLOYMENT TASKS**

### **Vercel Deployment**
- [ ] **Connect Repository**
  - Connect GitHub repo to Vercel
  - Configure build settings (already in `vercel.json`)

- [ ] **Environment Variables**
  - Add `NEXT_PUBLIC_SUPABASE_URL` in Vercel dashboard
  - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard

- [ ] **Deploy and Test**
  - Deploy to production
  - Test all functionality on live site

### **Domain Setup** (Optional)
- [ ] **Custom Domain**
  - Configure custom domain in Vercel
  - Set up DNS records
  - Verify SSL certificate

## 🧪 **FUNCTIONALITY TESTING**

### **Public Features**
- [ ] **Homepage**
  - All sections load correctly
  - Navigation works
  - Mobile responsive

- [ ] **Quote Form** (`/quote`)
  - Form submits successfully
  - Data appears in admin dashboard
  - Email validation works
  - Required fields enforced

- [ ] **Contact/About Pages**
  - All content displays correctly
  - Forms work (if any)

### **Admin Features**
- [ ] **Admin Login** (`/admin`)
  - Admin can log in with correct credentials
  - Non-admin users are blocked
  - Session management works

- [ ] **Quote Management**
  - View all submitted quotes
  - Update quote statuses
  - Quote details display correctly

- [ ] **Company Management**
  - Create/edit companies
  - Manage company users
  - Role assignments work

- [ ] **User Management**
  - View all users
  - Create new users
  - Assign roles and permissions

### **Client Portal** (If Implemented)
- [ ] **Client Dashboard** (`/dashboard/[clientId]`)
  - Clients can access their projects
  - Project access controls work
  - Permissions are enforced

## 📊 **PERFORMANCE & MONITORING**

### **Performance**
- [ ] **Page Load Speed**
  - Homepage loads in < 3 seconds
  - Admin dashboard is responsive
  - Images are optimized

- [ ] **Mobile Experience**
  - All pages work on mobile
  - Forms are usable on small screens
  - Navigation is mobile-friendly

### **Monitoring** (Post-Launch)
- [ ] **Error Tracking**
  - Set up error monitoring (Sentry, LogRocket, etc.)
  - Monitor Vercel function logs
  - Check Supabase logs regularly

- [ ] **Analytics** (Optional)
  - Google Analytics setup
  - Track quote submissions
  - Monitor user behavior

## 🔧 **POST-LAUNCH TASKS**

### **Immediate (First 24 Hours)**
- [ ] **Monitor for Errors**
  - Check Vercel deployment logs
  - Monitor Supabase error logs
  - Test all critical paths

- [ ] **Create Real Test Data**
  - Submit real test quotes
  - Create test client accounts
  - Verify email notifications (if implemented)

### **First Week**
- [ ] **User Feedback**
  - Test with real users
  - Gather feedback on UX
  - Fix any reported issues

- [ ] **Performance Optimization**
  - Monitor page load times
  - Optimize slow queries
  - Compress images if needed

### **Ongoing Maintenance**
- [ ] **Regular Backups**
  - Set up automated Supabase backups
  - Export important data regularly

- [ ] **Security Updates**
  - Keep dependencies updated
  - Monitor for security advisories
  - Review access logs periodically

## 🚨 **EMERGENCY PROCEDURES**

### **If Something Goes Wrong**
1. **Check Vercel Deployment Logs**
2. **Check Supabase Logs**
3. **Rollback to Previous Deployment** (if needed)
4. **Contact Support** (Vercel/Supabase if needed)

### **Critical Issues**
- **Site Down**: Check Vercel status, redeploy if needed
- **Database Issues**: Check Supabase dashboard, verify RLS policies
- **Security Breach**: Immediately revoke API keys, check access logs

## ✅ **LAUNCH READINESS CRITERIA**

**Ready to Launch When:**
- [ ] All security tasks completed
- [ ] Admin user created and tested
- [ ] Quote form works end-to-end
- [ ] Admin dashboard functional
- [ ] Mobile experience tested
- [ ] Performance acceptable
- [ ] Error monitoring in place

**Estimated Time to Complete:** 2-4 hours

---

## 📞 **Support Contacts**

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Domain/DNS Issues**: Contact your domain provider

**Remember**: Test everything in production after deployment!
