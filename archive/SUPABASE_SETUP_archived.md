# 🚀 Supabase Setup Guide for Jigsaw Techie

This guide will help you set up Supabase to handle quote requests and prepare for the future client portal system.

## 📋 Prerequisites

- Node.js and npm installed
- A Supabase account (free)
- Basic understanding of SQL

## 🔧 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up** with GitHub (recommended) or email
3. **Create a new project:**
   - **Name**: `jigsaw-techie-production`
   - **Database Password**: Generate a strong password and **save it securely**
   - **Region**: Choose closest to your location (US West/East)
4. **Wait** for project creation (2-3 minutes)

## 🔑 Step 2: Get Your Credentials

1. **Go to your project dashboard**
2. **Click Settings** → **API** in the sidebar
3. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## 📝 Step 3: Update Environment Variables

1. **Open** `website/jigsaw_techie-website/.env.local`
2. **Replace the placeholder values:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Save the file**

## 🗄️ Step 4: Create Database Tables

1. **Go to your Supabase project**
2. **Click SQL Editor** in the sidebar
3. **Click New Query**
4. **Copy and paste** the entire contents of `supabase-setup.sql`
5. **Click Run** to execute the SQL
6. **Verify** you see "Success. No rows returned" message

## 🧪 Step 5: Test the Setup

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Go to the debug page:**
   ```
   http://localhost:3001/debug
   ```

3. **Click "Run Supabase Tests"**
4. **Verify all tests pass** (green checkmarks)

## ✅ Step 6: Test Quote Form

1. **Go to the quote page:**
   ```
   http://localhost:3001/quote
   ```

2. **Fill out and submit** a test quote
3. **Check for success message**
4. **Verify in Supabase:**
   - Go to **Table Editor** → **quotes**
   - You should see your test quote

## 👨‍💼 Step 7: Test Admin Dashboard

1. **Go to the admin page:**
   ```
   http://localhost:3001/admin
   ```

2. **Verify you can see** your test quotes
3. **Try changing** a quote status
4. **Confirm** the status updates

## 🔍 Troubleshooting

### Common Issues:

**❌ "Failed to fetch" error:**
- Check your internet connection
- Verify Supabase project is running
- Check environment variables are correct

**❌ "JWT" or authentication error:**
- Verify your anon key is correct
- Make sure you copied the full key
- Restart your development server

**❌ "Table 'quotes' doesn't exist":**
- Make sure you ran the SQL setup script
- Check the SQL executed without errors
- Verify the table exists in Table Editor

**❌ Environment variables not working:**
- Make sure `.env.local` is in the correct directory
- Restart your development server after changes
- Check for typos in variable names

### Debug Steps:

1. **Check environment variables:**
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Use the debug page:**
   - Go to `/debug` and run tests
   - Check browser console for detailed errors

3. **Check Supabase logs:**
   - Go to your Supabase project
   - Click **Logs** → **API**
   - Look for recent errors

## 🎯 What You Get

After successful setup:

✅ **Working Quote Form** - Customers can submit requests
✅ **Database Storage** - All quotes saved securely
✅ **Admin Dashboard** - View and manage quotes
✅ **Status Tracking** - Update quote progress
✅ **Real-time Updates** - Changes appear instantly
✅ **Professional UI** - Clean, responsive interface

## 🚀 Next Steps

Once basic setup is working:

1. **Email Notifications** - Get notified of new quotes
2. **Client Authentication** - Secure login system
3. **Protected Previews** - Client website previews
4. **Project Tracking** - Full project management
5. **File Uploads** - Client asset sharing

## 💡 Future Client Portal Features

The database is designed to support:

- **Client Accounts** - Secure login for customers
- **Project Tracking** - Real-time progress updates
- **Website Previews** - Protected development URLs
- **File Sharing** - Upload/download project assets
- **Communication** - Direct messaging with clients
- **Invoicing** - Integrated billing system

## 📞 Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **Use the debug page** at `/debug`
3. **Check browser console** for error details
4. **Review Supabase documentation** at [supabase.com/docs](https://supabase.com/docs)

The setup should take 15-30 minutes total. Once complete, you'll have a professional quote management system that can scale with your business!
