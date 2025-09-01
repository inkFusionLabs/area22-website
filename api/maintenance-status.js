// Vercel API endpoint to check maintenance mode status
// This endpoint reads the MAINTENANCE_MODE environment variable

export default function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Check if MAINTENANCE_MODE environment variable is set to 'true'
    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
    
    // Return the maintenance status
    res.status(200).json({
      maintenanceMode: maintenanceMode,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      message: maintenanceMode 
        ? 'Site is currently in maintenance mode' 
        : 'Site is currently live'
    });
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      maintenanceMode: false // Default to live mode on error
    });
  }
}
