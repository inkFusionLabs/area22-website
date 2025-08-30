// Area22 Maintenance Mode Toggle
// This script helps you easily switch between maintenance mode and normal site operation

class MaintenanceToggle {
    constructor() {
        this.isMaintenanceMode = false;
        this.maintenanceUrl = '/maintenance';
        this.mainSiteUrl = '/';
        this.init();
    }

    init() {
        // Check if we're in maintenance mode
        this.checkMaintenanceStatus();
        
        // Add toggle button to admin panel if it exists
        this.addToggleButton();
    }

    checkMaintenanceStatus() {
        // Check current URL to determine mode
        if (window.location.pathname === this.maintenanceUrl) {
            this.isMaintenanceMode = true;
            console.log('🛠️ Area22 is currently in MAINTENANCE MODE');
        } else {
            this.isMaintenanceMode = false;
            console.log('✅ Area22 is currently LIVE');
        }
    }

    addToggleButton() {
        // Look for admin panel or add button to page
        const adminPanel = document.querySelector('.admin-panel') || document.body;
        
        if (adminPanel) {
            const toggleButton = document.createElement('button');
            toggleButton.innerHTML = this.isMaintenanceMode ? '🚀 Go Live' : '🛠️ Enable Maintenance';
            toggleButton.className = 'maintenance-toggle-btn';
            toggleButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                padding: 12px 20px;
                background: ${this.isMaintenanceMode ? '#00ff00' : '#ff6b35'};
                color: #000;
                border: none;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            `;
            
            toggleButton.addEventListener('click', () => {
                this.toggleMaintenanceMode();
            });
            
            toggleButton.addEventListener('mouseenter', () => {
                toggleButton.style.transform = 'scale(1.05)';
            });
            
            toggleButton.addEventListener('mouseleave', () => {
                toggleButton.style.transform = 'scale(1)';
            });
            
            adminPanel.appendChild(toggleButton);
        }
    }

    toggleMaintenanceMode() {
        if (this.isMaintenanceMode) {
            // Switch to live site
            this.goLive();
        } else {
            // Switch to maintenance mode
            this.enableMaintenance();
        }
    }

    enableMaintenance() {
        if (confirm('🛠️ Are you sure you want to enable MAINTENANCE MODE?\n\nThis will redirect all visitors to the maintenance page.')) {
            console.log('🛠️ Enabling maintenance mode...');
            
            // Redirect to maintenance page
            window.location.href = this.maintenanceUrl;
        }
    }

    goLive() {
        if (confirm('🚀 Are you sure you want to go LIVE?\n\nThis will restore normal site operation.')) {
            console.log('🚀 Going live...');
            
            // Redirect to main site
            window.location.href = this.mainSiteUrl;
        }
    }

    // Method to check maintenance status from external sources
    async checkRemoteMaintenanceStatus() {
        try {
            // You can add API calls here to check maintenance status
            // For example, checking a configuration file or API endpoint
            const response = await fetch('/api/maintenance-status');
            const data = await response.json();
            return data.isMaintenanceMode;
        } catch (error) {
            console.log('Could not check remote maintenance status:', error);
            return this.isMaintenanceMode;
        }
    }

    // Method to set maintenance duration
    setMaintenanceDuration(hours) {
        const durationElement = document.querySelector('.status-value');
        if (durationElement && durationElement.textContent.includes('Expected Duration')) {
            const parentItem = durationElement.closest('.status-item');
            if (parentItem) {
                const valueElement = parentItem.querySelector('.status-value');
                if (valueElement) {
                    valueElement.textContent = `${hours} Hours`;
                }
            }
        }
    }

    // Method to update maintenance message
    updateMaintenanceMessage(message) {
        const descriptionElement = document.querySelector('.maintenance-description');
        if (descriptionElement) {
            descriptionElement.textContent = message;
        }
    }
}

// Initialize maintenance toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.maintenanceToggle = new MaintenanceToggle();
    
    // Add some helpful console messages
    console.log(`
🎵 Area22 Maintenance System Loaded! 🎵

Quick Commands:
- window.maintenanceToggle.enableMaintenance() - Enable maintenance mode
- window.maintenanceToggle.goLive() - Go live
- window.maintenanceToggle.setMaintenanceDuration(12) - Set duration to 12 hours
- window.maintenanceToggle.updateMaintenanceMessage('Custom message') - Update message

Current Status: ${window.maintenanceToggle.isMaintenanceMode ? '🛠️ MAINTENANCE MODE' : '✅ LIVE'}
    `);
});

// Add keyboard shortcuts for quick access
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + M to toggle maintenance mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        if (window.maintenanceToggle) {
            window.maintenanceToggle.toggleMaintenanceMode();
        }
    }
    
    // Ctrl/Cmd + Shift + L to go live
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        if (window.maintenanceToggle) {
            window.maintenanceToggle.goLive();
        }
    }
});
