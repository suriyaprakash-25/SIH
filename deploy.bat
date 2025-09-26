@echo off
echo 🚀 Deploying KMRL Metro System to Vercel...

REM Build the frontend
echo 📦 Building frontend...
cd frontend
call npm run build
cd ..

echo ✅ Frontend build complete!

REM Deploy to Vercel 
echo 🌐 Deploying to Vercel...
vercel --prod

echo 🎉 Deployment complete!
echo 📱 Your KMRL Metro System is now live!
pause