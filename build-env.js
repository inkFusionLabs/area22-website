#!/usr/bin/env node

/**
 * Build script to inject Vercel environment variables into HTML files
 * This allows client-side JavaScript to access environment variables at runtime
 */

const fs = require('fs');
const path = require('path');

// Environment variables to inject
const envVars = [
    'VERCEL_MAINTENANCE_ENABLED',
    'VERCEL_MAINTENANCE_MESSAGE',
    'VERCEL_MAINTENANCE_RETURN'
];

// HTML files to process (excluding maintenance.html to avoid circular logic)
const htmlFiles = [
    'index.html',
    'services.html',
    'about.html',
    'gallery.html',
    'pricing.html',
    'contact.html',
    // 'media-consent.html',
    'privacy-policy.html',
    'admin.html',
    'test-hamburger.html',
    'dj-dashboard.html',
    'debug-dashboard.html',
    'mobile-test.html',
    'cache-invalidation.html'
];

/**
 * Generate JavaScript code to inject environment variables
 */
function generateEnvScript() {
    let script = '// Injected environment variables from Vercel build process\n';
    script += 'window.VERCEL_ENV = {\n';

    envVars.forEach((varName, index) => {
        const value = process.env[varName];
        const formattedValue = value ? JSON.stringify(value) : 'undefined';
        script += `  ${varName}: ${formattedValue}`;

        if (index < envVars.length - 1) {
            script += ',';
        }
        script += '\n';
    });

    script += '};\n\n';

    // Make individual variables available for easier access
    envVars.forEach(varName => {
        script += `window.${varName} = window.VERCEL_ENV.${varName};\n`;
    });

    return script;
}

/**
 * Inject environment variables into HTML file
 */
function injectEnvVars(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Remove any existing injected environment variables
        content = content.replace(/<!-- INJECTED ENV VARS START -->[\s\S]*?<!-- INJECTED ENV VARS END -->/g, '');

        // Find the closing </head> tag
        const headEndIndex = content.indexOf('</head>');
        if (headEndIndex === -1) {
            console.warn(`Could not find </head> tag in ${filePath}`);
            return;
        }

        // Generate the script to inject
        const envScript = generateEnvVars();
        const injection = `\n    <!-- INJECTED ENV VARS START -->\n    <script>\n${envScript}    </script>\n    <!-- INJECTED ENV VARS END -->\n`;

        // Insert before </head>
        const newContent = content.slice(0, headEndIndex) + injection + content.slice(headEndIndex);

        // Write back to file
        fs.writeFileSync(filePath, newContent);
        console.log(`✅ Injected environment variables into ${filePath}`);

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

/**
 * Main build function
 */
function main() {
    console.log('🚀 Starting Vercel environment variable injection...');
    console.log('📋 Environment variables to inject:', envVars.join(', '));

    // Check if any environment variables are set
    const setVars = envVars.filter(varName => process.env[varName] !== undefined);
    if (setVars.length > 0) {
        console.log('✅ Found environment variables:', setVars.join(', '));
    } else {
        console.log('⚠️  No environment variables found. Maintenance mode will use localStorage or static config.');
    }

    // Process each HTML file
    htmlFiles.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            injectEnvVars(filePath);
        } else {
            console.warn(`⚠️  File not found: ${filePath}`);
        }
    });

    console.log('✨ Environment variable injection complete!');
}

/**
 * Generate environment variables script for manual injection
 */
function generateEnvVars() {
    const envScript = generateEnvScript();
    return envScript;
}

// Export for use in other scripts
module.exports = { generateEnvScript, injectEnvVars };

// Run if called directly
if (require.main === module) {
    main();
}
