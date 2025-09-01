#!/usr/bin/env node

// Area22 Maintenance Mode Toggle Script
// This script helps you easily toggle maintenance mode by updating status files
// Usage: node toggle-maintenance.js [on|off]

const fs = require('fs');
const path = require('path');

class MaintenanceToggle {
    constructor() {
        this.statusFiles = {
            txt: 'maintenance-status.txt',
            json: 'maintenance-status.json'
        };
    }

    async toggleMaintenance(enable = null) {
        try {
            // If no argument provided, toggle current state
            if (enable === null) {
                enable = !(await this.isMaintenanceMode());
            }

            const status = enable ? 'true' : 'false';
            const message = enable ? 'Site is currently in maintenance mode' : 'Site is currently live';
            const timestamp = new Date().toISOString();

            // Update text file
            await this.updateTextFile(status);

            // Update JSON file
            await this.updateJsonFile(enable, timestamp, message);

            console.log(`✅ Maintenance mode ${enable ? 'ENABLED' : 'DISABLED'}`);
            console.log(`📝 Status files updated`);
            console.log(`🔄 Next deployment will reflect the changes`);
            
            if (enable) {
                console.log(`\n💡 To enable maintenance mode in Vercel:`);
                console.log(`   1. Set environment variable: MAINTENANCE_MODE=true`);
                console.log(`   2. Redeploy your site`);
                console.log(`   3. Or use: vercel env add MAINTENANCE_MODE true`);
            } else {
                console.log(`\n💡 To disable maintenance mode in Vercel:`);
                console.log(`   1. Set environment variable: MAINTENANCE_MODE=false`);
                console.log(`   2. Redeploy your site`);
                console.log(`   3. Or use: vercel env add MAINTENANCE_MODE false`);
            }

        } catch (error) {
            console.error('❌ Error toggling maintenance mode:', error.message);
            process.exit(1);
        }
    }

    async isMaintenanceMode() {
        try {
            const content = await fs.promises.readFile(this.statusFiles.txt, 'utf8');
            return content.trim().toLowerCase() === 'true';
        } catch (error) {
            return false;
        }
    }

    async updateTextFile(status) {
        await fs.promises.writeFile(this.statusFiles.txt, status);
    }

    async updateJsonFile(maintenanceMode, timestamp, message) {
        const jsonContent = {
            maintenanceMode,
            timestamp,
            message
        };
        await fs.promises.writeFile(this.statusFiles.json, JSON.stringify(jsonContent, null, 2));
    }
}

// Main execution
async function main() {
    const toggle = new MaintenanceToggle();
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // No arguments - show current status and toggle
        const currentStatus = await toggle.isMaintenanceMode();
        console.log(`🎵 Area22 Maintenance Mode Toggle`);
        console.log(`📊 Current Status: ${currentStatus ? '🛠️ MAINTENANCE MODE' : '✅ LIVE'}`);
        console.log(`🔄 Toggling to: ${currentStatus ? 'LIVE' : 'MAINTENANCE MODE'}`);
        await toggle.toggleMaintenance();
    } else if (args[0] === 'on' || args[0] === 'true') {
        console.log(`🎵 Area22 Maintenance Mode Toggle`);
        console.log(`🛠️ Enabling maintenance mode...`);
        await toggle.toggleMaintenance(true);
    } else if (args[0] === 'off' || args[0] === 'false') {
        console.log(`🎵 Area22 Maintenance Mode Toggle`);
        console.log(`✅ Disabling maintenance mode...`);
        await toggle.toggleMaintenance(false);
    } else if (args[0] === 'status') {
        const currentStatus = await toggle.isMaintenanceMode();
        console.log(`🎵 Area22 Maintenance Mode Status`);
        console.log(`📊 Current Status: ${currentStatus ? '🛠️ MAINTENANCE MODE' : '✅ LIVE'}`);
        console.log(`📁 Status Files:`);
        console.log(`   - ${toggle.statusFiles.txt}: ${currentStatus ? 'true' : 'false'}`);
        console.log(`   - ${toggle.statusFiles.json}: Updated`);
    } else {
        console.log(`🎵 Area22 Maintenance Mode Toggle`);
        console.log(`\nUsage:`);
        console.log(`  node toggle-maintenance.js          # Toggle current state`);
        console.log(`  node toggle-maintenance.js on       # Enable maintenance mode`);
        console.log(`  node toggle-maintenance.js off      # Disable maintenance mode`);
        console.log(`  node toggle-maintenance.js status   # Show current status`);
        console.log(`\nExamples:`);
        console.log(`  node toggle-maintenance.js on       # Enable maintenance`);
        console.log(`  node toggle-maintenance.js off      # Disable maintenance`);
        console.log(`  node toggle-maintenance.js status   # Check status`);
    }
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = MaintenanceToggle;
