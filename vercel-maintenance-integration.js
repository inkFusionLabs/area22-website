// Vercel Maintenance Integration for Area22
// This file adds Vercel environment variable support to your existing maintenance system
// Add this script to your HTML files after maintenance-toggle.js

class VercelMaintenanceIntegration {
    constructor() {
        this.isMaintenanceMode = false;
        this.checkInterval = null;
        this.init();
    }

    init() {
        console.log('🔧 Vercel Maintenance Integration: Initializing...');
        
        // Check for Vercel maintenance mode immediately
        this.checkVercelMaintenanceMode();
        
        // Set up periodic checking (every 30 seconds)
        this.checkInterval = setInterval(() => {
            this.checkVercelMaintenanceMode();
        }, 30000);
        
        // Also check when page becomes visible (user returns to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkVercelMaintenanceMode();
            }
        });
    }

    async checkVercelMaintenanceMode() {
        // Method 1: Check status files
        try {
            const textResponse = await fetch('/maintenance-status.txt');
            if (textResponse.ok) {
                const text = await textResponse.text();
                if (text.trim().toLowerCase() === 'true') {
                    this.enableMaintenanceMode();
                    return;
                }
            }
        } catch (error) {
            console.log('📄 Text file not accessible');
        }

        try {
            const jsonResponse = await fetch('/maintenance-status.json');
            if (jsonResponse.ok) {
                const data = await jsonResponse.json();
                if (data.maintenanceMode === true) {
                    this.enableMaintenanceMode();
                    return;
                }
            }
        } catch (error) {
            console.log('📋 JSON file not accessible');
        }

        // Method 2: Check meta tag
        const maintenanceMeta = document.querySelector('meta[name="maintenance-mode"]');
        if (maintenanceMeta && maintenanceMeta.getAttribute('content') === 'true') {
            this.enableMaintenanceMode();
            return;
        }

        // If we get here, no maintenance mode is detected
        this.disableMaintenanceMode();
    }

    enableMaintenanceMode() {
        if (this.isMaintenanceMode) return; // Already enabled
        
        console.log('🛠️ Vercel Integration: Enabling maintenance mode...');
        this.isMaintenanceMode = true;
        
        // Check if we're already on the maintenance page
        if (window.location.pathname === '/maintenance' || 
            window.location.pathname === '/maintenance.html') {
            console.log('✅ Already on maintenance page');
            return;
        }
        
        // Redirect to maintenance page
        console.log('🔄 Redirecting to maintenance page...');
        window.location.href = '/maintenance';
    }

    disableMaintenanceMode() {
        if (!this.isMaintenanceMode) return; // Already disabled
        
        console.log('✅ Vercel Integration: Maintenance mode disabled');
        this.isMaintenanceMode = false;
        
        // If we're on the maintenance page and maintenance is disabled, redirect to home
        if (window.location.pathname === '/maintenance' || 
            window.location.pathname === '/maintenance.html') {
            console.log('🔄 Redirecting to home page...');
            window.location.href = '/';
        }
    }

    // Method to manually check maintenance status
    async manualCheck() {
        console.log('🔍 Manual maintenance check requested...');
        await this.checkVercelMaintenanceMode();
    }

    // Method to get current status
    getStatus() {
        return {
            isMaintenanceMode: this.isMaintenanceMode,
            timestamp: new Date().toISOString(),
            source: 'vercel-integration'
        };
    }

    // Cleanup method
    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        console.log('🔧 Vercel Maintenance Integration: Cleaned up');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main maintenance system to initialize
    setTimeout(() => {
        window.vercelMaintenance = new VercelMaintenanceIntegration();
        
        // Add some helpful console messages
        console.log(`
🎵 Vercel Maintenance Integration Loaded! 🎵

Available Commands:
- window.vercelMaintenance.manualCheck() - Manually check maintenance status
- window.vercelMaintenance.getStatus() - Get current status
- window.vercelMaintenance.destroy() - Clean up integration

This integration works alongside your existing maintenance system.
        `);
    }, 1000);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VercelMaintenanceIntegration;
}
