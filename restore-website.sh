#!/bin/bash

echo "🔄 Restoring Area22 website from maintenance mode..."

# Remove the www subdomain alias first
echo "🗑️  Removing www.area-22.co.uk alias..."
vercel alias rm www.area-22.co.uk

# Restore the original vercel.json
echo "📁 Restoring original configuration..."
cp vercel.json.backup vercel.json

# Deploy the restored website
echo "📤 Deploying restored website to Vercel..."
vercel --prod

echo "✅ Website restored successfully!"
echo "🌐 Your website should now be accessible at: https://area-22.co.uk"
echo "📝 Note: It may take a few minutes for the changes to propagate."
echo "ℹ️  The www.area-22.co.uk subdomain has been removed from maintenance mode."
