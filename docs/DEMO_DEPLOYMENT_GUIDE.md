# 🚀 JigsawTechie Demo Deployment Guide

Complete step-by-step guide for deploying client demos using the CLI system.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Types & Deployment Methods](#project-types--deployment-methods)
3. [React Projects](#react-projects)
4. [Next.js Projects](#nextjs-projects)
5. [Static HTML/CSS/JS Projects](#static-htmlcssjs-projects)
6. [Development Profile Considerations](#development-profile-considerations)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

### Step 1: Get CLI Token (One-Time Setup)
1. Go to your admin dashboard: `http://localhost:3000/admin`
2. Click the **🟢 "Get CLI Token"** button (next to Logout)
3. Click **"📋 Copy Setup Command"** in the modal
4. Open terminal in your project directory
5. Paste and run the command

### Step 2: Deploy Any Project
1. Go to **"Demo Management"** tab in admin
2. Click **🟣 "Deploy Demo"** button on any project
3. Copy the appropriate command for your project type
4. Run in terminal from your project directory

---

## 🛠️ Project Types & Deployment Methods

### 📊 Deployment Matrix

| Project Type | Build Required | Deploy From | Command |
|-------------|----------------|-------------|---------|
| **React (CRA)** | ✅ Yes | `./build` | `npm run build && node cli/deploy-demo.js ./build PROJECT_ID` |
| **Next.js** | ✅ Yes | `./out` | `npm run build && npm run export && node cli/deploy-demo.js ./out PROJECT_ID` |
| **Vite React** | ✅ Yes | `./dist` | `npm run build && node cli/deploy-demo.js ./dist PROJECT_ID` |
| **HTML/CSS/JS** | ❌ No | `./` | `node cli/deploy-demo.js ./ PROJECT_ID` |
| **Static Site** | ❌ No | `./public` | `node cli/deploy-demo.js ./public PROJECT_ID` |

---

## ⚛️ React Projects

### Create React App (CRA)
```bash
# 1. Navigate to your React project
cd /path/to/your-react-project

# 2. Install dependencies (if needed)
npm install

# 3. Build the project
npm run build

# 4. Deploy the build folder
node cli/deploy-demo.js ./build YOUR_PROJECT_ID
```

### Vite React Projects
```bash
# 1. Navigate to your Vite React project
cd /path/to/your-vite-project

# 2. Install dependencies (if needed)
npm install

# 3. Build the project (creates ./dist folder)
npm run build

# 4. Deploy the dist folder
node cli/deploy-demo.js ./dist YOUR_PROJECT_ID
```

### React Development Considerations
- **Environment Variables**: Remove or replace any development-specific env vars
- **API Endpoints**: Ensure API calls work in demo environment
- **Routing**: Use HashRouter for better demo compatibility
- **Assets**: Ensure all assets are properly bundled

---

## 🔷 Next.js Projects

### Standard Next.js Deployment
```bash
# 1. Navigate to your Next.js project
cd /path/to/your-nextjs-project

# 2. Install dependencies (if needed)
npm install

# 3. Build the project
npm run build

# 4. Export static files (creates ./out folder)
npm run export

# 5. Deploy the out folder
node cli/deploy-demo.js ./out YOUR_PROJECT_ID
```

### Next.js Configuration for Static Export
Add to your `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### Next.js Considerations
- **Static Export Only**: Demos must be static (no server-side features)
- **Image Optimization**: Disable for static export
- **API Routes**: Won't work in static export
- **Dynamic Routes**: May need special handling

---

## 📄 Static HTML/CSS/JS Projects

### Simple Static Sites (No Build Required)
```bash
# 1. Navigate to your project directory
cd /path/to/your-static-site

# 2. Deploy directly (if index.html is in root)
node cli/deploy-demo.js ./ YOUR_PROJECT_ID

# 3. Or deploy from public folder
node cli/deploy-demo.js ./public YOUR_PROJECT_ID
```

### Example Static Project Structure
```
my-static-site/
├── index.html          # Main entry point
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   └── logo.png
└── assets/
    └── fonts/
```

### Static Site Best Practices
- **Entry Point**: Ensure `index.html` exists in deploy folder
- **Relative Paths**: Use relative paths for all assets
- **No Server Dependencies**: Everything must work client-side
- **Cross-Browser**: Test in multiple browsers

---

## 👨‍💻 Development Profile Considerations

### Do You Need to Modify Dev Profile Code?

**Short Answer: Usually NO, but here are considerations:**

### ✅ No Modification Needed If:
- Using relative paths for assets
- No hardcoded localhost URLs
- No development-only features
- Static assets are properly bundled

### ⚠️ May Need Modification If:
- **API Endpoints**: Hardcoded to localhost
- **Environment Variables**: Development-specific values
- **Authentication**: Dev-only auth providers
- **Database Connections**: Local database URLs

### 🔧 Common Modifications for Demos

#### 1. API Endpoints
```javascript
// ❌ Don't do this in demo code
const API_URL = 'http://localhost:3001/api';

// ✅ Do this instead
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api.com/api' 
  : 'http://localhost:3001/api';

// ✅ Or for demo-only (no API calls)
const DEMO_MODE = true;
const API_URL = DEMO_MODE ? null : 'http://localhost:3001/api';
```

#### 2. Demo Data
```javascript
// ✅ Use mock data for demos
const demoData = [
  { id: 1, name: 'Sample Product', price: '$99' },
  { id: 2, name: 'Demo Service', price: '$149' }
];

const data = DEMO_MODE ? demoData : await fetchFromAPI();
```

#### 3. Environment Variables
```bash
# .env.production (for demos)
REACT_APP_DEMO_MODE=true
REACT_APP_API_URL=https://demo-api.example.com
```

### 📁 Recommended Demo Preparation

#### Option 1: Demo Branch
```bash
# Create a demo-specific branch
git checkout -b demo-version
# Make demo-specific changes
# Deploy from this branch
```

#### Option 2: Demo Build Script
```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:demo": "REACT_APP_DEMO_MODE=true npm run build",
    "deploy:demo": "npm run build:demo && node cli/deploy-demo.js ./build"
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ "Source directory does not exist"
```bash
# Check if build folder exists
ls -la ./build  # or ./dist or ./out

# Run build command first
npm run build
```

#### ❌ "Authentication not set up"
```bash
# Get new token from admin dashboard
# Click "Get CLI Token" button
# Run the setup command again
```

#### ❌ "Upload failed"
```bash
# Check file size (should be < 50MB)
# Verify project ID is correct
# Ensure you have admin permissions
```

#### ❌ Demo shows blank page
- Check browser console for errors
- Verify `index.html` exists in deployed folder
- Check for hardcoded localhost URLs
- Ensure all assets use relative paths

#### ❌ Assets not loading
```html
<!-- ❌ Don't use absolute paths -->
<link href="/css/styles.css" rel="stylesheet">

<!-- ✅ Use relative paths -->
<link href="./css/styles.css" rel="stylesheet">
```

### 📞 Getting Help

1. **Check Admin Dashboard**: Demo Management tab shows deployment status
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Verify all assets are loading
4. **Demo Logs**: Check access logs in admin dashboard

---

## 🎯 Best Practices Summary

### ✅ Do This:
- Use relative paths for all assets
- Test locally before deploying
- Keep demos under 50MB
- Use mock data instead of live APIs
- Test in multiple browsers

### ❌ Avoid This:
- Hardcoded localhost URLs
- Large video/image files
- Server-side dependencies
- Development-only features
- Absolute file paths

---

**Ready to deploy? Start with the Quick Start section and choose your project type!** 🚀
