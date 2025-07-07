@echo off
REM 🤱 Vivie's Doula Demo Deployment Script (Windows)
REM Run this from the JigsawTechie project directory

echo 🚀 Starting Vivie's Doula Demo Deployment...
echo ================================================

REM Configuration
set "VIVIE_PROJECT_PATH=C:\Users\twill\OneDrive\Documents\01_Coding\0_Bussiness\Vivie Doula"
set "DEMO_NAME=vivie-doula-demo"
set "CLIENT_EMAIL=massvivie@gmail.com"

echo 📁 Project Path: %VIVIE_PROJECT_PATH%
echo 🎯 Demo Name: %DEMO_NAME%
echo 👤 Client: %CLIENT_EMAIL%
echo.

REM Step 1: Check if Vivie's project exists
echo 🔍 Step 1: Checking project directory...
if not exist "%VIVIE_PROJECT_PATH%" (
    echo ❌ Error: Vivie's project directory not found!
    echo    Expected: %VIVIE_PROJECT_PATH%
    pause
    exit /b 1
)
echo ✅ Project directory found

REM Step 2: Navigate to Vivie's project
echo.
echo 📂 Step 2: Navigating to Vivie's project...
cd /d "%VIVIE_PROJECT_PATH%"
echo ✅ Current directory: %CD%

REM Step 3: Check project structure
echo.
echo 🔍 Step 3: Verifying Next.js project structure...
if not exist "package.json" (
    echo ❌ Error: package.json not found!
    pause
    exit /b 1
)

if not exist "next.config.js" (
    echo ❌ Error: next.config.js not found!
    pause
    exit /b 1
)
echo ✅ Next.js project structure verified

REM Step 4: Install dependencies
echo.
echo 📦 Step 4: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Error: Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Step 5: Build the project
echo.
echo 🔨 Step 5: Building the project...
call npm run build
if errorlevel 1 (
    echo ❌ Error: Build failed
    pause
    exit /b 1
)
echo ✅ Build successful

REM Step 6: Deploy to Vercel
echo.
echo 🚀 Step 6: Deploying to Vercel...
echo    This will create a new Vercel project for the demo
echo.

REM Check if Vercel CLI is available
where vercel >nul 2>nul
if errorlevel 1 (
    echo ⚠️  Vercel CLI not found. Installing...
    call npm install -g vercel
)

REM Deploy with specific project name
echo 🌐 Deploying to Vercel...
call vercel --prod --name=%DEMO_NAME% --yes

if errorlevel 1 (
    echo ❌ Error: Vercel deployment failed
    pause
    exit /b 1
)

echo.
echo 🎉 DEPLOYMENT SUCCESSFUL!
echo ================================================
echo.
echo 📋 Next Steps:
echo 1. Copy the Vercel deployment URL from above
echo 2. Go to https://jigsawtechie.com/admin
echo 3. Navigate to 'Demo Management'
echo 4. Find or create Vivie's project entry
echo 5. Update the demo URL with the Vercel URL
echo 6. Set demo status to 'Live and Ready'
echo.
echo 👤 Client Access:
echo    - Client: %CLIENT_EMAIL%
echo    - Demo will be accessible through JigsawTechie client portal
echo    - Direct URL: [Use the Vercel URL from deployment]
echo.
echo 🔧 Admin Management:
echo    - Admin Dashboard: https://jigsawtechie.com/admin
echo    - Demo Management: https://jigsawtechie.com/admin#demo-management
echo.
echo ✅ Vivie's Doula Demo is now live!
echo.
pause
