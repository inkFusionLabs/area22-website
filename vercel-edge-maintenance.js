// Vercel Edge Config Maintenance System for Area22
// Based on Vercel's official maintenance page template
// This is the recommended way to implement maintenance mode on Vercel

class VercelEdgeMaintenance {
    constructor() {
        this.isMaintenanceMode = false;
        this.edgeConfigUrl = null;
        this.checkInterval = null;
        this.init();
    }

    init() {
        console.log('🔧 Vercel Edge Maintenance: Initializing...');
        
        // Check if we're already on maintenance page
        if (window.location.pathname === '/maintenance' || 
            window.location.pathname === '/maintenance.html') {
            this.isMaintenanceMode = true;
            console.log('🛠️ Already on maintenance page');
            return;
        }

        // Try to get Edge Config URL from environment or meta tag
        this.edgeConfigUrl = this.getEdgeConfigUrl();
        
        if (this.edgeConfigUrl) {
            console.log('📡 Edge Config URL found, checking maintenance status...');
            this.checkMaintenanceStatus();
            
            // Set up periodic checking (every 30 seconds)
            this.checkInterval = setInterval(() => {
                this.checkMaintenanceStatus();
            }, 30000);
            
            // Also check when page becomes visible
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.checkMaintenanceStatus();
                }
            });
        } else {
            console.log('⚠️ No Edge Config URL found, using fallback methods...');
            this.checkFallbackMethods();
        }
    }

    getEdgeConfigUrl() {
        // Method 1: Check for Edge Config URL in meta tag
        const edgeConfigMeta = document.querySelector('meta[name="edge-config-url"]');
        if (edgeConfigMeta) {
            return edgeConfigMeta.getAttribute('content');
        }

        // Method 2: Check for environment variable (if available)
        if (window.EDGE_CONFIG_URL) {
            return window.EDGE_CONFIG_URL;
        }

        // Method 3: Try to construct from Vercel environment
        if (window.location.hostname.includes('vercel.app')) {
            // This would need to be set in your Vercel environment variables
            return null;
        }

        return null;
    }

    async checkMaintenanceStatus() {
        if (!this.edgeConfigUrl) {
            console.log('❌ No Edge Config URL available');
            return;
        }

        try {
            console.log('📡 Checking Edge Config for maintenance status...');
            
            const response = await fetch(this.edgeConfigUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('📡 Edge Config Response:', data);
                
                // Check for maintenance mode (support multiple formats)
                const maintenanceMode = data.isInMaintenanceMode === true || 
                                      data.maintenanceMode === true ||
                                      data.maintenance === true;
                
                if (maintenanceMode) {
                    this.enableMaintenanceMode();
                } else {
                    this.disableMaintenanceMode();
                }
            } else {
                console.log(`❌ Edge Config returned status: ${response.status}`);
                this.checkFallbackMethods();
            }
        } catch (error) {
            console.log('❌ Edge Config check failed:', error.message);
            this.checkFallbackMethods();
        }
    }

    async checkFallbackMethods() {
        console.log('🔄 Checking fallback methods...');
        
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

        // Method 3: Check URL parameter (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('maintenance') === 'true') {
            this.enableMaintenanceMode();
            return;
        }

        // If we get here, no maintenance mode is detected
        this.disableMaintenanceMode();
    }

    enableMaintenanceMode() {
        if (this.isMaintenanceMode) return; // Already enabled
        
        console.log('🛠️ Vercel Edge Maintenance: Enabling maintenance mode...');
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
        
        console.log('✅ Vercel Edge Maintenance: Maintenance mode disabled');
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
        if (this.edgeConfigUrl) {
            await this.checkMaintenanceStatus();
        } else {
            await this.checkFallbackMethods();
        }
    }

    // Method to get current status
    getStatus() {
        return {
            isMaintenanceMode: this.isMaintenanceMode,
            timestamp: new Date().toISOString(),
            source: 'vercel-edge-maintenance',
            edgeConfigUrl: this.edgeConfigUrl ? 'Available' : 'Not Available'
        };
    }

    // Method to set Edge Config URL
    setEdgeConfigUrl(url) {
        this.edgeConfigUrl = url;
        console.log('🔧 Edge Config URL set to:', url);
        this.checkMaintenanceStatus();
    }

    // Cleanup method
    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        console.log('🔧 Vercel Edge Maintenance: Cleaned up');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main maintenance system to initialize
    setTimeout(() => {
        window.vercelEdgeMaintenance = new VercelEdgeMaintenance();
        
        // Add helpful console messages
        console.log(`
🎵 Vercel Edge Maintenance System Loaded! 🎵

This system uses Vercel's recommended Edge Config approach for maintenance mode.

Available Commands:
- window.vercelEdgeMaintenance.manualCheck() - Manually check maintenance status
- window.vercelEdgeMaintenance.getStatus() - Get current status
- window.vercelEdgeMaintenance.setEdgeConfigUrl('URL') - Set Edge Config URL
- window.vercelEdgeMaintenance.destroy() - Clean up

To use Edge Config:
1. Create Edge Config in Vercel dashboard
2. Set content: { "isInMaintenanceMode": true }
3. Add meta tag: <meta name="edge-config-url" content="YOUR_EDGE_CONFIG_URL">

Fallback methods will work if Edge Config is not available.
        `);
    }, 1000);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VercelEdgeMaintenance;
}
