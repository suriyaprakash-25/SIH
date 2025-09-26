#!/bin/bash

echo "🚀 Deploying KMRL Metro System to Vercel..."

# Build the frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Frontend build complete!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo "📱 Your KMRL Metro System is now live!"