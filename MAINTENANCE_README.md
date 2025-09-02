# Area22 Maintenance Mode System

A simple JavaScript-based maintenance mode system for your Area22 DJ Services website with **Vercel integration**.

## Quick Start (Vercel)

1. **Set Environment Variables in Vercel Dashboard:**
   ```
   VERCEL_MAINTENANCE_ENABLED = false
   VERCEL_MAINTENANCE_MESSAGE = We are currently performing maintenance. Please check back soon.
   VERCEL_MAINTENANCE_RETURN = 2024-12-25T10:00:00Z
   ```

2. **Toggle Maintenance Mode:**
   - Enable: Set `VERCEL_MAINTENANCE_ENABLED = true` and redeploy
   - Disable: Set `VERCEL_MAINTENANCE_ENABLED = false` and redeploy

3. **Done!** Your site will automatically show the maintenance page when enabled.

---

**Alternative Methods:** Admin Panel, Static Config, API Endpoint

## Files Added/Modified

### New Files:
- `maintenance.html` - The maintenance page shown to visitors
- `maintenance-config.js` - Configuration file for maintenance settings
- `maintenance.js` - Core maintenance mode logic
- `MAINTENANCE_README.md` - This documentation

### Modified Files:
- All HTML pages (except `maintenance.html`) - Added maintenance check script
- `admin.html` - Added maintenance mode management interface

## How to Use

### Method 1: Vercel Environment Variables (Recommended)

**Priority Order:** Vercel Environment Variables > Admin Panel > Static Config

#### Setup Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project dashboard
   - Go to Settings → Environment Variables

2. **Add Maintenance Variables**
   ```
   VERCEL_MAINTENANCE_ENABLED = false
   VERCEL_MAINTENANCE_MESSAGE = We are currently performing maintenance. Please check back soon.
   VERCEL_MAINTENANCE_RETURN = 2024-12-25T10:00:00Z
   ```

3. **Toggle Maintenance Mode**
   - **Enable**: Set `VERCEL_MAINTENANCE_ENABLED = true`
   - **Disable**: Set `VERCEL_MAINTENANCE_ENABLED = false`
   - **Redeploy**: Changes take effect on next deployment

#### Using the API Endpoint (Advanced)

You can also toggle maintenance mode programmatically:

```bash
# Enable maintenance mode
curl -X POST https://your-domain.vercel.app/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{"action": "enable", "message": "Scheduled maintenance in progress"}'

# Disable maintenance mode
curl -X POST https://your-domain.vercel.app/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{"action": "disable"}'

# Check status
curl -X POST https://your-domain.vercel.app/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{"action": "status"}'
```

**Optional API Authentication:**
Set `MAINTENANCE_API_KEY` environment variable for secure API access.

### Method 2: Admin Panel

1. **Access the Admin Panel**
   - Navigate to `/admin.html` on your website
   - Go to the "Settings" tab

2. **Enable Maintenance Mode**
   - In the "Maintenance Mode" section, click "Enable Maintenance Mode"
   - The status indicator will show "Active" in red

3. **Configure (Optional)**
   - **Custom Message**: Enter a custom message to display on the maintenance page
   - **Estimated Return Date**: Set when you expect the site to be back online
   - Click "Save Configuration" to apply changes

4. **Disable Maintenance Mode**
   - Click "Disable Maintenance Mode" to restore normal website access
   - The status indicator will show "Disabled" in green

### Method 3: Manual Configuration

1. **Edit `maintenance-config.js`**
   ```javascript
   window.MAINTENANCE_CONFIG = {
       enabled: true, // Set to true to enable, false to disable
       message: "Your custom maintenance message here",
       estimatedReturn: "2024-12-25T10:00:00Z", // Optional ISO date
       // ... other settings
   };
   ```

2. **Deploy Changes**
   - After editing, redeploy your site to Vercel

## Features

### Automatic Redirection
- When maintenance mode is enabled, all visitors (except admin) are redirected to `maintenance.html`
- Excluded pages: `/admin.html`, `/maintenance.html`, and API paths

### Dynamic Content
- Custom maintenance messages
- Estimated return times
- Professional design matching your site's branding

### Admin Interface
- Easy toggle buttons in the admin panel
- Real-time status updates
- Configuration management
- Toast notifications for actions

### Auto-Refresh
- Maintenance page auto-refreshes every 5 minutes to check if maintenance is over
- Configurable refresh interval

## Configuration Options

### Static Configuration (`maintenance-config.js`)
```javascript
window.MAINTENANCE_CONFIG = {
    enabled: false,                    // Enable/disable maintenance mode
    message: "Custom message",         // Maintenance message
    estimatedReturn: null,             // ISO date string or null
    excludePaths: [                    // Pages that bypass maintenance
        '/admin.html',
        '/maintenance.html',
        '/api/'
    ],
    autoRefreshInterval: 300000        // Auto-refresh interval (ms)
};
```

### Dynamic Configuration (Admin Panel)
- Settings stored in browser localStorage
- Overrides static configuration
- Persists across sessions

## Security Notes

- Admin panel access is not password-protected
- Consider adding authentication if needed
- Maintenance configuration is stored in localStorage (client-side)
- For production, consider server-side configuration

## Troubleshooting

### Maintenance Mode Not Working
1. Check browser console for JavaScript errors
2. Verify `maintenance.js` is loaded on all pages
3. Clear browser cache and localStorage
4. Check that `maintenance-config.js` loads correctly

### Admin Panel Not Updating
1. Clear browser localStorage
2. Refresh the admin page
3. Check browser console for errors

### Changes Not Taking Effect
1. Redeploy to Vercel after editing static config
2. Clear CDN cache if using caching
3. Check file permissions and paths

## Customization

### Styling the Maintenance Page
Edit the CSS in `maintenance.html` to match your brand:
- Colors use CSS custom properties matching your site's theme
- Responsive design for mobile devices
- Gradient backgrounds and animations

### Adding More Excluded Pages
Add paths to the `excludePaths` array in `maintenance-config.js`:
```javascript
excludePaths: [
    '/admin.html',
    '/maintenance.html',
    '/api/',
    '/special-page.html'
]
```

## Vercel Setup Guide

### Initial Setup

1. **Connect Repository to Vercel**
   - Import your GitHub/GitLab repository to Vercel
   - Vercel will automatically detect the `vercel.json` configuration

2. **Configure Environment Variables**
   - Go to your project dashboard
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     ```
     VERCEL_MAINTENANCE_ENABLED = false
     VERCEL_MAINTENANCE_MESSAGE = We are currently performing maintenance. Please check back soon.
     VERCEL_MAINTENANCE_RETURN = 2024-12-25T10:00:00Z
     MAINTENANCE_API_KEY = your-secure-api-key-here  # Optional
     ```

3. **Environment Variable Scopes**
   - **Production**: Affects your live website
   - **Preview**: Affects deployment previews (PRs, branches)
   - **Development**: Affects local development (not applicable for static sites)

### Toggling Maintenance Mode

#### Method A: Environment Variables (Recommended)

1. **Go to Vercel Dashboard**
2. **Settings → Environment Variables**
3. **Update `VERCEL_MAINTENANCE_ENABLED`**
   - Set to `true` to enable maintenance mode
   - Set to `false` to disable maintenance mode
4. **Trigger Redeploy**
   - Changes require a new deployment to take effect
   - You can trigger this manually or push a commit

#### Method B: API Endpoint

Use the provided API endpoint for programmatic control:

```javascript
// Enable maintenance
fetch('/api/maintenance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'enable',
    message: 'Scheduled maintenance in progress',
    apiKey: 'your-api-key' // if authentication is enabled
  })
});

// Disable maintenance
fetch('/api/maintenance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'disable',
    apiKey: 'your-api-key'
  })
});
```

### Build Process

The `build-env.js` script automatically runs during deployment and:
- Injects environment variables into your HTML files
- Makes them available to client-side JavaScript
- Ensures maintenance mode works with Vercel's CDN

## Deployment

1. **Local Development**
   - All files are static and work locally
   - No build process required

2. **Vercel Deployment**
   - Push changes to your repository
   - Vercel will automatically deploy
   - The `buildCommand` in `vercel.json` runs `node build-env.js`
   - Environment variables are injected into HTML files

3. **Cache Considerations**
   - HTML files are cached for 1 hour by default (see `vercel.json`)
   - Clear Vercel cache if changes don't appear immediately
   - Environment variable changes require redeployment

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all files are properly uploaded
3. Test in an incognito/private browsing window
4. Clear browser cache and localStorage

---

**Note**: This maintenance system works with your existing static HTML site. No framework migration required!
