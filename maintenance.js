// Maintenance Mode Handler
// This script should be included in all HTML pages (except maintenance.html and excluded pages)

(function() {
    'use strict';

    // Prevent multiple executions
    if (window.maintenanceInitialized) {
        return;
    }
    window.maintenanceInitialized = true;

    // Load maintenance config - priority: Vercel env vars > localStorage > static config
    function loadMaintenanceConfig() {
        return new Promise((resolve, reject) => {
            let config = { enabled: false };

            // Priority 1: Check Vercel environment variables (injected at build time)
            if (window.VERCEL_MAINTENANCE_ENABLED !== undefined) {
                config = {
                    enabled: window.VERCEL_MAINTENANCE_ENABLED === 'true',
                    message: window.VERCEL_MAINTENANCE_MESSAGE || 'We are currently performing maintenance. Please check back soon.',
                    estimatedReturn: window.VERCEL_MAINTENANCE_RETURN || null,
                    source: 'vercel'
                };

                // Merge with static config for excluded paths
                if (window.MAINTENANCE_CONFIG && window.MAINTENANCE_CONFIG.excludePaths) {
                    config.excludePaths = window.MAINTENANCE_CONFIG.excludePaths;
                }

                resolve(config);
                return;
            }

            // Priority 2: Check localStorage (admin panel managed)
            const localConfig = localStorage.getItem('area22_maintenance_config');
            if (localConfig) {
                try {
                    const parsedConfig = JSON.parse(localConfig);
                    // Ensure excluded paths are preserved from static config
                    if (window.MAINTENANCE_CONFIG && window.MAINTENANCE_CONFIG.excludePaths) {
                        parsedConfig.excludePaths = window.MAINTENANCE_CONFIG.excludePaths;
                    }
                    parsedConfig.source = 'localStorage';
                    resolve(parsedConfig);
                    return;
                } catch (e) {
                    console.warn('Failed to parse localStorage maintenance config:', e);
                }
            }

            // Priority 3: Fall back to static config
            if (window.MAINTENANCE_CONFIG) {
                config = { ...window.MAINTENANCE_CONFIG, source: 'static' };
                resolve(config);
                return;
            }

            // Priority 4: Load config script if not loaded
            const configScript = document.createElement('script');
            configScript.src = 'maintenance-config.js';
            configScript.onload = function() {
                const finalConfig = window.MAINTENANCE_CONFIG || { enabled: false };
                finalConfig.source = 'static';
                resolve(finalConfig);
            };
            configScript.onerror = function() {
                console.warn('Failed to load maintenance config');
                resolve({ enabled: false, source: 'fallback' });
            };
            document.head.appendChild(configScript);
        });
    }

    // Check if maintenance mode should be active
    function shouldShowMaintenance(config) {
        // Check if maintenance is enabled
        if (!config.enabled) {
            return false;
        }

        // Check if current path is excluded
        if (window.isExcludedPath && window.isExcludedPath()) {
            return false;
        }

        // Check if current page is the maintenance page itself
        if (window.location.pathname.includes('maintenance.html')) {
            return false;
        }

        return true;
    }

    // Redirect to maintenance page
    function redirectToMaintenance(config) {
        // Update maintenance page with config data
        sessionStorage.setItem('maintenance_message', config.message || '');
        sessionStorage.setItem('maintenance_return', window.getEstimatedReturnText ? window.getEstimatedReturnText() : 'Soon');

        // Redirect to maintenance page
        window.location.href = 'maintenance.html';
    }

    // Setup auto-refresh if configured
    function setupAutoRefresh(config) {
        if (config.autoRefreshInterval && config.autoRefreshInterval > 0) {
            setTimeout(() => {
                window.location.reload();
            }, config.autoRefreshInterval);
        }
    }

    // Initialize maintenance mode check
    function initMaintenanceMode() {
        loadMaintenanceConfig().then(config => {
            if (shouldShowMaintenance(config)) {
                redirectToMaintenance(config);
            } else {
                setupAutoRefresh(config);
            }
        }).catch(error => {
            console.warn('Maintenance mode check failed:', error);
        });
    }

    // Run maintenance check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMaintenanceMode);
    } else {
        // DOM already loaded, run immediately
        initMaintenanceMode();
    }

})();
