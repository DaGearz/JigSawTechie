#!/bin/bash

# 🤱 Vivie's Doula Demo Deployment Script
# Run this from the JigsawTechie project directory

echo "🚀 Starting Vivie's Doula Demo Deployment..."
echo "================================================"

# Configuration
VIVIE_PROJECT_PATH="C:/Users/twill/OneDrive/Documents/01_Coding/0_Bussiness/Vivie Doula"
DEMO_NAME="vivie-doula-demo"
CLIENT_EMAIL="massvivie@gmail.com"

echo "📁 Project Path: $VIVIE_PROJECT_PATH"
echo "🎯 Demo Name: $DEMO_NAME"
echo "👤 Client: $CLIENT_EMAIL"
echo ""

# Step 1: Check if Vivie's project exists
echo "🔍 Step 1: Checking project directory..."
if [ ! -d "$VIVIE_PROJECT_PATH" ]; then
    echo "❌ Error: Vivie's project directory not found!"
    echo "   Expected: $VIVIE_PROJECT_PATH"
    exit 1
fi
echo "✅ Project directory found"

# Step 2: Navigate to Vivie's project
echo ""
echo "📂 Step 2: Navigating to Vivie's project..."
cd "$VIVIE_PROJECT_PATH"
echo "✅ Current directory: $(pwd)"

# Step 3: Check project structure
echo ""
echo "🔍 Step 3: Verifying Next.js project structure..."
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    exit 1
fi

if [ ! -f "next.config.js" ]; then
    echo "❌ Error: next.config.js not found!"
    exit 1
fi
echo "✅ Next.js project structure verified"

# Step 4: Install dependencies
echo ""
echo "📦 Step 4: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"

# Step 5: Build the project
echo ""
echo "🔨 Step 5: Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi
echo "✅ Build successful"

# Step 6: Deploy to Vercel
echo ""
echo "🚀 Step 6: Deploying to Vercel..."
echo "   This will create a new Vercel project for the demo"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy with specific project name
echo "🌐 Deploying to Vercel..."
vercel --prod --name="$DEMO_NAME" --yes

if [ $? -ne 0 ]; then
    echo "❌ Error: Vercel deployment failed"
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "================================================"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the Vercel deployment URL from above"
echo "2. Go to https://jigsawtechie.com/admin"
echo "3. Navigate to 'Demo Management'"
echo "4. Find or create Vivie's project entry"
echo "5. Update the demo URL with the Vercel URL"
echo "6. Set demo status to 'Live and Ready'"
echo ""
echo "👤 Client Access:"
echo "   - Client: $CLIENT_EMAIL"
echo "   - Demo will be accessible through JigsawTechie client portal"
echo "   - Direct URL: [Use the Vercel URL from deployment]"
echo ""
echo "🔧 Admin Management:"
echo "   - Admin Dashboard: https://jigsawtechie.com/admin"
echo "   - Demo Management: https://jigsawtechie.com/admin#demo-management"
echo ""
echo "✅ Vivie's Doula Demo is now live!"
