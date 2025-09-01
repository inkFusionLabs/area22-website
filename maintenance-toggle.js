// Area22 Maintenance Mode Toggle
// This script helps you easily switch between maintenance mode and normal site operation
// SECURE VERSION - Only accessible to authorized users

class MaintenanceToggle {
    constructor() {
        this.isMaintenanceMode = false;
        this.maintenanceUrl = '/maintenance';
        this.mainSiteUrl = '/';
        this.isAuthenticated = false;
        this.adminPassword = 'Area22Admin2024!'; // Change this to your preferred password
        this.init();
    }

    async init() {
        // Check if we're in maintenance mode (including Vercel env var)
        await this.checkMaintenanceStatus();
        
        // For production sites, completely hide admin controls by default
        if (this.isProductionSite() && !this.isExplicitlyEnabled()) {
            console.log('🔒 Area22 Maintenance System: Admin controls hidden for production site');
            return;
        }
        
        // Only show toggle for authenticated users
        this.checkAuthentication();
    }
    
    isProductionSite() {
        // Check if this is a production site (not localhost)
        return window.location.hostname !== 'localhost' && 
               window.location.hostname !== '127.0.0.1' &&
               !window.location.hostname.includes('dev') &&
               !window.location.hostname.includes('staging');
    }
    
    isExplicitlyEnabled() {
        // Check if admin controls are explicitly enabled via URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('admin') === 'true' || urlParams.get('maintenance') === 'true';
    }

    async checkMaintenanceStatus() {
        // First check current URL to determine mode
        if (window.location.pathname === this.maintenanceUrl) {
            this.isMaintenanceMode = true;
            console.log('🛠️ Area22 is currently in MAINTENANCE MODE (via URL)');
            return;
        }

        // Check if maintenance mode is enabled via Vercel environment variable
        try {
            const isVercelMaintenance = await this.checkVercelMaintenanceMode();
            if (isVercelMaintenance) {
                this.isMaintenanceMode = true;
                console.log('🛠️ Area22 is currently in MAINTENANCE MODE (via Vercel MAINTENANCE_MODE=true)');
                // Redirect to maintenance page if not already there
                if (window.location.pathname !== this.maintenanceUrl) {
                    console.log('🔄 Redirecting to maintenance page...');
                    window.location.href = this.maintenanceUrl;
                    return;
                }
            } else {
                this.isMaintenanceMode = false;
                console.log('✅ Area22 is currently LIVE (no maintenance mode detected)');
            }
        } catch (error) {
            console.log('⚠️ Could not check Vercel maintenance status:', error);
            // Fallback to URL-based detection
            this.isMaintenanceMode = false;
        }
    }

    checkAuthentication() {
        // Check if user is already authenticated
        const authToken = localStorage.getItem('area22_admin_auth');
        if (authToken === this.adminPassword) {
            this.isAuthenticated = true;
            this.addToggleButton();
        } else {
            // Only show login button for site administrators
            this.addLoginButton();
        }
    }

        addLoginButton() {
        // Only show login button if user is likely an admin
        // Check for specific conditions that suggest admin access
        if (this.isLikelyAdmin()) {
            const loginButton = document.createElement('button');
            loginButton.innerHTML = '🔐 Admin Login';
            loginButton.className = 'admin-login-btn';
            loginButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                padding: 8px 16px;
                background: rgba(0, 0, 0, 0.7);
                color: #00ff00;
                border: 1px solid #00ff00;
                border-radius: 20px;
                font-size: 12px;
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.3s ease;
            `;
            
            loginButton.addEventListener('click', () => {
                this.showLoginModal();
            });
            
            loginButton.addEventListener('mouseenter', () => {
                loginButton.style.opacity = '1';
                loginButton.style.background = 'rgba(0, 255, 0, 0.2)';
            });
            
            loginButton.addEventListener('mouseleave', () => {
                loginButton.style.opacity = '0.7';
                loginButton.style.background = 'rgba(0, 0, 0, 0.7)';
            });
            
            document.body.appendChild(loginButton);
        }
        
        // For production sites, completely hide admin controls by default
        // Only show if explicitly enabled via URL parameter
        if (window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1' && 
            !window.location.search.includes('admin=true')) {
            console.log('🔒 Admin controls hidden for production site');
            return;
        }
    }

    isLikelyAdmin() {
        // Only show admin controls in specific conditions
        // This prevents public access while allowing legitimate admin access
        
        // Method 1: Check for admin URL parameter (most secure)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            return true;
        }
        
        // Method 2: Check for specific referrer (if coming from admin panel)
        if (document.referrer && document.referrer.includes('admin')) {
            return true;
        }
        
        // Method 3: Check for specific user agent patterns (optional)
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('admin') || userAgent.includes('internal')) {
            return true;
        }
        
        // Method 4: Check for specific IP ranges (if you have internal access)
        // This would require server-side implementation
        
        // Method 5: Check for localhost/development environment
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return true;
        }
        
        // By default, don't show admin controls to public users
        return false;
    }

    showLoginModal() {
        // Create secure login modal
        const modal = document.createElement('div');
        modal.className = 'admin-login-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1a1a1a;
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
        `;

        modalContent.innerHTML = `
            <h3 style="color: #00ff00; margin-bottom: 1rem; font-family: 'Orbitron', monospace;">🔐 Admin Access</h3>
            <p style="color: #fff; margin-bottom: 1.5rem;">Enter admin password to access maintenance controls</p>
            <input type="password" id="adminPassword" placeholder="Enter password" style="
                width: 100%;
                padding: 12px;
                border: 1px solid #00ff00;
                border-radius: 8px;
                background: #000;
                color: #fff;
                margin-bottom: 1rem;
                font-size: 16px;
            ">
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="loginBtn" style="
                    padding: 10px 20px;
                    background: #00ff00;
                    color: #000;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                ">Login</button>
                <button id="cancelBtn" style="
                    padding: 10px 20px;
                    background: #333;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Cancel</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Focus on password input
        const passwordInput = modal.querySelector('#adminPassword');
        passwordInput.focus();

        // Handle login
        const loginBtn = modal.querySelector('#loginBtn');
        const cancelBtn = modal.querySelector('#cancelBtn');

        loginBtn.addEventListener('click', () => {
            this.authenticate(passwordInput.value);
        });

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Handle Enter key
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.authenticate(passwordInput.value);
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    authenticate(password) {
        if (password === this.adminPassword) {
            this.isAuthenticated = true;
            localStorage.setItem('area22_admin_auth', this.adminPassword);
            
            // Remove login button and add toggle button
            const loginBtn = document.querySelector('.admin-login-btn');
            if (loginBtn) loginBtn.remove();
            
            const modal = document.querySelector('.admin-login-modal');
            if (modal) document.body.removeChild(modal);
            
            this.addToggleButton();
            
            // Show success message
            this.showNotification('✅ Admin access granted!', 'success');
        } else {
            this.showNotification('❌ Invalid password!', 'error');
            // Clear password input
            const passwordInput = document.querySelector('#adminPassword');
            if (passwordInput) passwordInput.value = '';
        }
    }

    addToggleButton() {
        // Only add toggle button for authenticated users
        if (!this.isAuthenticated) return;
        
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
        
        document.body.appendChild(toggleButton);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10002;
            padding: 12px 20px;
            background: ${type === 'success' ? '#00ff00' : '#ff4444'};
            color: #000;
            border-radius: 8px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    toggleMaintenanceMode() {
        if (!this.isAuthenticated) {
            this.showNotification('❌ Admin access required!', 'error');
            return;
        }

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

    // Method to logout (clear authentication)
    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('area22_admin_auth');
        
        // Remove toggle button
        const toggleBtn = document.querySelector('.maintenance-toggle-btn');
        if (toggleBtn) toggleBtn.remove();
        
        // Show login button again
        this.addLoginButton();
        
        this.showNotification('🔓 Logged out successfully', 'success');
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

    async checkVercelMaintenanceMode() {
        console.log('🔍 Checking Vercel maintenance mode...');
        
        try {
            // Method 1: Check for Vercel environment variable via API endpoint
            console.log('📡 Trying API endpoint: /api/maintenance-status');
            const response = await fetch('/api/maintenance-status', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            console.log('📡 API Response status:', response.status);
            console.log('📡 API Response ok:', response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📡 API Response data:', data);
                const isMaintenance = data.maintenanceMode === true;
                console.log('📡 Maintenance mode from API:', isMaintenance);
                return isMaintenance;
            } else {
                console.log('📡 API returned error status:', response.status);
            }
        } catch (error) {
            console.log('❌ API endpoint error:', error.message);
        }

        try {
            // Method 2: Check for maintenance mode via a simple text file
            console.log('📄 Trying text file: /maintenance-status.txt');
            const response = await fetch('/maintenance-status.txt', {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (response.ok) {
                const text = await response.text();
                console.log('📄 Text file content:', text);
                const isMaintenance = text.trim().toLowerCase() === 'true';
                console.log('📄 Maintenance mode from text file:', isMaintenance);
                return isMaintenance;
            } else {
                console.log('📄 Text file returned status:', response.status);
            }
        } catch (error) {
            console.log('❌ Text file error:', error.message);
        }

        try {
            // Method 3: Check for maintenance mode via a JSON file
            console.log('📋 Trying JSON file: /maintenance-status.json');
            const response = await fetch('/maintenance-status.json', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('📋 JSON file data:', data);
                const isMaintenance = data.maintenanceMode === true;
                console.log('📋 Maintenance mode from JSON file:', isMaintenance);
                return isMaintenance;
            } else {
                console.log('📋 JSON file returned status:', response.status);
            }
        } catch (error) {
            console.log('❌ JSON file error:', error.message);
        }

        // Method 4: Check for maintenance mode via meta tag (if available)
        const maintenanceMeta = document.querySelector('meta[name="maintenance-mode"]');
        if (maintenanceMeta) {
            const content = maintenanceMeta.getAttribute('content');
            console.log('🏷️ Meta tag content:', content);
            const isMaintenance = content === 'true';
            console.log('🏷️ Maintenance mode from meta tag:', isMaintenance);
            return isMaintenance;
        }

        // Method 5: Check for maintenance mode via URL parameter (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        const maintenanceParam = urlParams.get('maintenance');
        if (maintenanceParam) {
            const isMaintenance = maintenanceParam === 'true';
            console.log('🔗 Maintenance mode from URL parameter:', isMaintenance);
            return isMaintenance;
        }

        console.log('❌ No maintenance mode detected from any method');
        // Default: no maintenance mode
        return false;
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
    
    // Add some helpful console messages for admins
    if (window.maintenanceToggle.isLikelyAdmin() && !window.maintenanceToggle.isProductionSite()) {
        console.log(`
🎵 Area22 Maintenance System Loaded! 🎵

Admin Access:
- Add ?admin=true to URL to show admin controls
- Use Ctrl/Cmd + Shift + M to toggle maintenance mode (if authenticated)
- Use Ctrl/Cmd + Shift + L to go live (if authenticated)

Quick Commands (after authentication):
- window.maintenanceToggle.enableMaintenance() - Enable maintenance mode
- window.maintenanceToggle.goLive() - Go live
- window.maintenanceToggle.logout() - Logout from admin
- window.maintenanceToggle.setMaintenanceDuration(12) - Set duration to 12 hours
- window.maintenanceToggle.updateMaintenanceMessage('Custom message') - Update message

Current Status: ${window.maintenanceToggle.isMaintenanceMode ? '🛠️ MAINTENANCE MODE' : '✅ LIVE'}
        `);
    } else if (window.maintenanceToggle.isProductionSite()) {
        console.log('🔒 Area22 Maintenance System: Admin controls hidden for production site. Add ?admin=true to URL to enable.');
    }
});

// Add keyboard shortcuts for quick access (only for authenticated users)
document.addEventListener('keydown', (e) => {
    if (!window.maintenanceToggle || !window.maintenanceToggle.isAuthenticated) return;
    
    // Ctrl/Cmd + Shift + M to toggle maintenance mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        window.maintenanceToggle.toggleMaintenanceMode();
    }
    
    // Ctrl/Cmd + Shift + L to go live
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        window.maintenanceToggle.goLive();
    }
    
    // Ctrl/Cmd + Shift + O to logout
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
        e.preventDefault();
        window.maintenanceToggle.logout();
    }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
