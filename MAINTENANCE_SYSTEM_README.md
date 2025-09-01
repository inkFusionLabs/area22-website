# Area22 Maintenance System - Vercel Integration

This maintenance system allows you to easily toggle your Area22 website between normal operation and maintenance mode using Vercel environment variables.

## 🚀 Quick Start

### Method 1: Vercel Environment Variable (Recommended)

1. **Enable Maintenance Mode:**
   ```bash
   vercel env add MAINTENANCE_MODE true
   vercel --prod
   ```

2. **Disable Maintenance Mode:**
   ```bash
   vercel env add MAINTENANCE_MODE false
   vercel --prod
   ```

### Method 2: Using the Toggle Script

1. **Check Current Status:**
   ```bash
   node toggle-maintenance.js status
   ```

2. **Enable Maintenance Mode:**
   ```bash
   node toggle-maintenance.js on
   ```

3. **Disable Maintenance Mode:**
   ```bash
   node toggle-maintenance.js off
   ```

4. **Toggle Current State:**
   ```bash
   node toggle-maintenance.js
   ```

## 🔧 How It Works

### 1. Environment Variable Check
The system first checks for `MAINTENANCE_MODE=true` in your Vercel environment variables via the `/api/maintenance-status` endpoint.

### 2. Fallback Methods
If the API endpoint isn't available, the system falls back to checking:
- `/maintenance-status.txt` - Simple text file containing "true" or "false"
- `/maintenance-status.json` - JSON file with detailed status information
- Meta tag in HTML (if available)

### 3. Automatic Redirect
When maintenance mode is detected, visitors are automatically redirected to `/maintenance.html` with a 503 status code.

## 📁 Files Overview

- **`maintenance-toggle.js`** - Main maintenance system script
- **`api/maintenance-status.js`** - Vercel API endpoint for checking maintenance status
- **`maintenance-status.txt`** - Simple text status file
- **`maintenance-status.json`** - JSON status file with metadata
- **`toggle-maintenance.js`** - Command-line script for toggling maintenance mode
- **`vercel.json`** - Vercel configuration with API routes

## 🌐 Vercel Deployment

### Setting Environment Variables

1. **Via Vercel Dashboard:**
   - Go to your project in Vercel
   - Navigate to Settings → Environment Variables
   - Add `MAINTENANCE_MODE` with value `true` or `false`

2. **Via Vercel CLI:**
   ```bash
   # Add environment variable
   vercel env add MAINTENANCE_MODE true
   
   # List environment variables
   vercel env ls
   
   # Remove environment variable
   vercel env rm MAINTENANCE_MODE
   ```

### API Endpoint
The system includes a Vercel API endpoint at `/api/maintenance-status` that:
- Reads the `MAINTENANCE_MODE` environment variable
- Returns JSON response with maintenance status
- Includes CORS headers for cross-origin requests
- Handles errors gracefully

## 🎯 Usage Scenarios

### Scenario 1: Planned Maintenance
1. Set `MAINTENANCE_MODE=true` in Vercel
2. Deploy to production
3. All visitors see maintenance page
4. Complete maintenance tasks
5. Set `MAINTENANCE_MODE=false` and redeploy

### Scenario 2: Emergency Maintenance
1. Use the toggle script: `node toggle-maintenance.js on`
2. Commit and push changes
3. Deploy immediately: `vercel --prod`
4. Site goes into maintenance mode
5. Fix the issue and disable maintenance mode

### Scenario 3: Testing Maintenance Mode
1. Use the toggle script locally: `node toggle-maintenance.js on`
2. Test the maintenance page locally
3. Verify redirects work correctly
4. Disable when done: `node toggle-maintenance.js off`

## 🔒 Security Features

- **Admin Authentication:** Password-protected admin controls
- **Production Hiding:** Admin controls hidden by default on production sites
- **URL Parameters:** Use `?admin=true` to show admin controls
- **Local Development:** Full admin access on localhost

## 📱 Admin Controls

### Keyboard Shortcuts (after authentication)
- **Ctrl/Cmd + Shift + M** - Toggle maintenance mode
- **Ctrl/Cmd + Shift + L** - Go live
- **Ctrl/Cmd + Shift + O** - Logout

### Console Commands
```javascript
// Enable maintenance mode
window.maintenanceToggle.enableMaintenance()

// Go live
window.maintenanceToggle.goLive()

// Logout
window.maintenanceToggle.logout()

// Set maintenance duration
window.maintenanceToggle.setMaintenanceDuration(12)

// Update maintenance message
window.maintenanceToggle.updateMaintenanceMessage('Custom message')
```

## 🚨 Troubleshooting

### Maintenance Mode Not Working
1. Check if `MAINTENANCE_MODE=true` is set in Vercel
2. Verify the API endpoint is accessible: `/api/maintenance-status`
3. Check browser console for error messages
4. Ensure status files are properly updated

### API Endpoint Issues
1. Verify `vercel.json` includes the API function configuration
2. Check Vercel function logs for errors
3. Ensure the API file is in the correct location: `api/maintenance-status.js`

### Status Files Not Updating
1. Check file permissions
2. Verify the toggle script has write access
3. Check for any file locks or conflicts

## 📊 Monitoring

### Console Logs
The system provides detailed console logging:
- 🛠️ Maintenance mode enabled
- ✅ Site is live
- 🔄 Redirecting to maintenance page
- ⚠️ Error messages and fallbacks

### Status Information
Each status check includes:
- Current maintenance state
- Timestamp of last check
- Environment information
- Error details (if any)

## 🔄 Updates and Maintenance

### Regular Tasks
- Update status files as needed
- Monitor API endpoint performance
- Review and update admin passwords
- Test maintenance mode functionality

### Version Control
- Commit status file changes when toggling maintenance
- Tag releases with maintenance mode changes
- Document any configuration updates

## 📞 Support

For issues with the maintenance system:
1. Check the browser console for error messages
2. Verify Vercel environment variables are set correctly
3. Test the API endpoint directly: `/api/maintenance-status`
4. Review the status files for consistency

---

**Last Updated:** January 2025  
**Version:** 2.0 - Vercel Integration  
**Maintainer:** Area22 Development Team
