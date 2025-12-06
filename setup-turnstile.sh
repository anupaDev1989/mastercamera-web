#!/bin/bash

# Cloudflare Turnstile Environment Variables Setup Script
# This script helps you add Turnstile keys to your Cloudflare Pages project

PROJECT_NAME="kitly-webpage"

echo "🔐 Cloudflare Turnstile Setup for $PROJECT_NAME"
echo "================================================"
echo ""

# Check if user has Turnstile keys
echo "Before running this script, you need to get your Turnstile keys:"
echo "1. Visit: https://dash.cloudflare.com/?to=/:account/turnstile"
echo "2. Click 'Add Site'"
echo "3. Enter your domain (or 'localhost' for testing)"
echo "4. Choose 'Managed' widget type"
echo "5. Copy both keys (Site Key and Secret Key)"
echo ""

read -p "Do you have your Turnstile keys ready? (y/n): " ready

if [ "$ready" != "y" ]; then
    echo "❌ Please get your Turnstile keys first, then run this script again."
    exit 1
fi

echo ""
echo "📝 Enter your Turnstile keys:"
echo ""

# Get Site Key (Public)
read -p "Enter your SITE KEY (public): " SITE_KEY

if [ -z "$SITE_KEY" ]; then
    echo "❌ Site key cannot be empty"
    exit 1
fi

# Get Secret Key (Private)
read -sp "Enter your SECRET KEY (private): " SECRET_KEY
echo ""

if [ -z "$SECRET_KEY" ]; then
    echo "❌ Secret key cannot be empty"
    exit 1
fi

echo ""
echo "🚀 Adding environment variables to Cloudflare Pages..."
echo ""

# Add VITE_TURNSTILE_SITE_KEY (for frontend)
echo "Adding VITE_TURNSTILE_SITE_KEY..."
wrangler pages secret put VITE_TURNSTILE_SITE_KEY --project-name="$PROJECT_NAME" <<< "$SITE_KEY"

if [ $? -eq 0 ]; then
    echo "✅ VITE_TURNSTILE_SITE_KEY added successfully"
else
    echo "❌ Failed to add VITE_TURNSTILE_SITE_KEY"
    exit 1
fi

echo ""

# Add TURNSTILE_SECRET_KEY (for backend)
echo "Adding TURNSTILE_SECRET_KEY..."
wrangler pages secret put TURNSTILE_SECRET_KEY --project-name="$PROJECT_NAME" <<< "$SECRET_KEY"

if [ $? -eq 0 ]; then
    echo "✅ TURNSTILE_SECRET_KEY added successfully"
else
    echo "❌ Failed to add TURNSTILE_SECRET_KEY"
    exit 1
fi

echo ""
echo "🎉 Success! Environment variables have been added to $PROJECT_NAME"
echo ""
echo "Next steps:"
echo "1. Update your local .env file with the site key"
echo "2. Redeploy your site to apply the changes"
echo "3. Test the Turnstile widget on your live site"
echo ""
echo "To redeploy, run: wrangler pages deploy dist --project-name=$PROJECT_NAME"
echo ""
