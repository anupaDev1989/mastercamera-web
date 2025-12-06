#!/bin/bash

# Quick deployment script for Kitly webpage
# This builds and deploys to Cloudflare Pages

echo "🚀 Building and deploying Kitly webpage..."
echo ""

# Check if .env file exists and has the site key
if [ -f .env ]; then
    if grep -q "VITE_TURNSTILE_SITE_KEY=your_real_site_key_here" .env; then
        echo "⚠️  Warning: .env still has placeholder Turnstile site key"
        echo "   The widget will show 'Testing only, always pass'"
        echo ""
    fi
fi

# Build the project
echo "📦 Building..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Cloudflare Pages
echo "🌍 Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=kitly-webpage --branch=main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📝 Note: To use real Turnstile (not test mode):"
    echo "   1. Go to Cloudflare Pages dashboard"
    echo "   2. Settings → Environment variables"
    echo "   3. Add VITE_TURNSTILE_SITE_KEY with your real site key"
    echo "   4. Trigger a new deployment"
else
    echo "❌ Deployment failed!"
    exit 1
fi
