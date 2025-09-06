#!/usr/bin/env node

/**
 * Cache Busting Deployment Script for Area22 Website
 * 
 * This script updates version numbers and cache-busting parameters
 * to ensure users get the latest version of the website.
 */

const fs = require('fs');
const path = require('path');

// Get current timestamp for versioning
const timestamp = Date.now();
const version = `v2.0.${timestamp}`;

console.log(`🚀 Starting cache busting deployment with version: ${version}`);

// Files to update with cache busting
const filesToUpdate = [
    {
        file: 'index.html',
        patterns: [
            { from: /styles\.css\?v=[\d\.]+/g, to: `styles.css?v=${timestamp}` },
            { from: /script\.js\?v=[\d\.]+/g, to: `script.js?v=${timestamp}` },
            { from: /sw\.js\?v=[\d\.]+/g, to: `sw.js?v=${timestamp}` }
        ]
    },
    {
        file: 'sw.js',
        patterns: [
            { from: /const CACHE_NAME = 'area22-v[\d\.]+';/, to: `const CACHE_NAME = 'area22-${version}';` }
        ]
    },
    {
        file: '_headers',
        patterns: [
            { from: /ETag: "area22-v[\d\.]+"/, to: `ETag: "area22-${version}"` }
        ]
    },
    {
        file: 'vercel.json',
        patterns: [
            { from: /"ETag": "\\"area22-v[\d\.]+\\""/, to: `"ETag": "\\"area22-${version}\\""` }
        ]
    }
];

// Update each file
filesToUpdate.forEach(({ file, patterns }) => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        patterns.forEach(pattern => {
            if (pattern.from.test(content)) {
                content = content.replace(pattern.from, pattern.to);
                updated = true;
            }
        });
        
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${file}`);
        } else {
            console.log(`ℹ️  No changes needed: ${file}`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

// Update other HTML files with cache busting
const htmlFiles = ['about.html', 'services.html', 'gallery.html', 'pricing.html', 'contact.html', 'admin.html'];

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Update CSS references
        if (/styles\.css\?v=/.test(content)) {
            content = content.replace(/styles\.css\?v=[\d\.]+/g, `styles.css?v=${timestamp}`);
            updated = true;
        } else if (/href="styles\.css"/.test(content)) {
            content = content.replace(/href="styles\.css"/, `href="styles.css?v=${timestamp}"`);
            updated = true;
        }
        
        // Update JS references
        if (/script\.js\?v=/.test(content)) {
            content = content.replace(/script\.js\?v=[\d\.]+/g, `script.js?v=${timestamp}`);
            updated = true;
        } else if (/src="script\.js"/.test(content)) {
            content = content.replace(/src="script\.js"/, `src="script.js?v=${timestamp}"`);
            updated = true;
        }
        
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${file}`);
        } else {
            console.log(`ℹ️  No changes needed: ${file}`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

console.log(`\n🎉 Cache busting deployment completed!`);
console.log(`📋 Version: ${version}`);
console.log(`⏰ Timestamp: ${timestamp}`);
console.log(`\n📝 Next steps:`);
console.log(`1. Deploy to Vercel`);
console.log(`2. Visit /cache-invalidation.html to clear existing user caches`);
console.log(`3. Monitor browser developer tools for cache behavior`);
console.log(`\n🔧 For immediate cache clearing, users can:`);
console.log(`- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)`);
console.log(`- Clear browser cache manually`);
console.log(`- Visit /cache-invalidation.html`);
