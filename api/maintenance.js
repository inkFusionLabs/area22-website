/**
 * Vercel API endpoint for managing maintenance mode
 * Usage: POST /api/maintenance
 *
 * Body parameters:
 * - action: 'enable' | 'disable' | 'status'
 * - message: (optional) Custom maintenance message
 * - returnDate: (optional) Estimated return date (ISO string)
 * - apiKey: (optional) API key for authentication
 */

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'This endpoint only accepts POST requests'
        });
    }

    try {
        const { action, message, returnDate, apiKey } = req.body;

        // Optional API key authentication
        const expectedApiKey = process.env.MAINTENANCE_API_KEY;
        if (expectedApiKey && apiKey !== expectedApiKey) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid API key'
            });
        }

        // Handle different actions
        switch (action) {
            case 'enable':
                // Enable maintenance mode
                process.env.VERCEL_MAINTENANCE_ENABLED = 'true';
                if (message) {
                    process.env.VERCEL_MAINTENANCE_MESSAGE = message;
                }
                if (returnDate) {
                    process.env.VERCEL_MAINTENANCE_RETURN = returnDate;
                }

                return res.status(200).json({
                    success: true,
                    message: 'Maintenance mode enabled',
                    config: {
                        enabled: true,
                        message: message || 'We are currently performing maintenance. Please check back soon.',
                        returnDate: returnDate || null
                    }
                });

            case 'disable':
                // Disable maintenance mode
                process.env.VERCEL_MAINTENANCE_ENABLED = 'false';
                process.env.VERCEL_MAINTENANCE_MESSAGE = '';
                process.env.VERCEL_MAINTENANCE_RETURN = '';

                return res.status(200).json({
                    success: true,
                    message: 'Maintenance mode disabled',
                    config: {
                        enabled: false,
                        message: null,
                        returnDate: null
                    }
                });

            case 'status':
                // Get current status
                return res.status(200).json({
                    success: true,
                    config: {
                        enabled: process.env.VERCEL_MAINTENANCE_ENABLED === 'true',
                        message: process.env.VERCEL_MAINTENANCE_MESSAGE || null,
                        returnDate: process.env.VERCEL_MAINTENANCE_RETURN || null
                    }
                });

            default:
                return res.status(400).json({
                    error: 'Invalid action',
                    message: 'Action must be: enable, disable, or status',
                    availableActions: ['enable', 'disable', 'status']
                });
        }

    } catch (error) {
        console.error('Maintenance API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while processing your request'
        });
    }
}
