# 🚀 Demo Deployment Quick Reference

## ⚡ Super Quick Start

### 1. Get Token (One Time)
```bash
# Admin Dashboard → Click "Get CLI Token" → Copy command → Run:
node cli/setup-auth.js YOUR_TOKEN_HERE
```

### 2. Deploy Demo
```bash
# Admin Dashboard → Demo Management → Click "Deploy Demo" → Copy command
```

---

## 📋 Common Commands

### React (Create React App)
```bash
npm run build
node cli/deploy-demo.js ./build PROJECT_ID
```

### Next.js
```bash
npm run build && npm run export
node cli/deploy-demo.js ./out PROJECT_ID
```

### Vite React
```bash
npm run build
node cli/deploy-demo.js ./dist PROJECT_ID
```

### Static HTML/CSS/JS
```bash
node cli/deploy-demo.js ./ PROJECT_ID
```

### Test Site (No Build)
```bash
node cli/deploy-demo.js ./demo-test-site PROJECT_ID
```

---

## 🎯 Test the System

### Use the Included Test Site
```bash
# 1. Get your project ID from admin dashboard
# 2. Run this command:
node cli/deploy-demo.js ./demo-test-site YOUR_PROJECT_ID

# 3. Set demo URL in "Manage Demo"
# 4. Test the demo link
```

---

## ⚠️ Dev Profile Modifications

### Usually NO modifications needed if:
- ✅ Using relative paths
- ✅ No hardcoded localhost URLs  
- ✅ No dev-only features

### May need changes if:
- ❌ API calls to localhost
- ❌ Development environment variables
- ❌ Database connections

### Quick Fix for APIs:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api.com' 
  : 'http://localhost:3001';
```

---

## 🔧 Troubleshooting

| Error | Solution |
|-------|----------|
| "Source directory does not exist" | Run build command first |
| "Authentication not set up" | Click "Get CLI Token" again |
| "Upload failed" | Check file size < 50MB |
| Blank demo page | Check for `index.html` in deploy folder |
| Assets not loading | Use relative paths `./css/` not `/css/` |

---

## 📁 Project Structure Examples

### React Build Output
```
build/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
```

### Static Site
```
my-site/
├── index.html
├── css/
├── js/
└── images/
```

---

**Need help? Check the full guide: `DEMO_DEPLOYMENT_GUIDE.md`** 📖
