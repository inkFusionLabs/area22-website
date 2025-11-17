// Maintenance Mode Configuration
// To enable maintenance mode: set enabled to true
// To disable maintenance mode: set enabled to false
// After changing this setting, redeploy your site to Vercel

window.MAINTENANCE_CONFIG = {
    // Set to true to enable maintenance mode, false to disable
    enabled: true,

    // Optional: Set a specific return date/time (ISO format)
    // If set, will show this date in the maintenance message
    // Leave as null to show "Soon"
    estimatedReturn: null, // Example: "2024-12-25T10:00:00Z"

    // Maintenance message (optional custom message)
    message: "We're currently performing some essential updates to bring you an even better experience. Our website will be back online shortly. Thank you for your patience!",

    // Pages to exclude from maintenance mode (these will still be accessible)
    // Useful for admin pages, API endpoints, etc.
    excludePaths: [
        '/admin.html',
        '/maintenance.html',
        '/admin',
        '/api/'
    ],

    // Auto-refresh interval in milliseconds (default: 5 minutes)
    // Set to 0 to disable auto-refresh
    autoRefreshInterval: 300000
};

// Helper function to check if current path should be excluded
window.isExcludedPath = function() {
    const currentPath = window.location.pathname;
    return window.MAINTENANCE_CONFIG.excludePaths.some(excludePath => {
        return currentPath.startsWith(excludePath);
    });
};

// Helper function to get estimated return time
window.getEstimatedReturnText = function() {
    if (!window.MAINTENANCE_CONFIG.estimatedReturn) {
        return "Soon";
    }

    try {
        const returnDate = new Date(window.MAINTENANCE_CONFIG.estimatedReturn);
        const now = new Date();
        const diffTime = returnDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            return "Very Soon";
        } else if (diffDays === 1) {
            return "Tomorrow";
        } else {
            return `In ${diffDays} days`;
        }
    } catch (e) {
        return "Soon";
    }
};
