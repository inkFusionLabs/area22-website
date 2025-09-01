# 🔧 Maintenance Mode Troubleshooting Guide

If your maintenance mode isn't working when you set `MAINTENANCE_MODE=true`, follow these steps:

## 🚨 Quick Fix Steps

### Step 1: Test the Maintenance System
Visit your site and check the browser console for maintenance system logs.

### Step 2: Check Vercel Environment Variables
Make sure the environment variable is set correctly:

```bash
# Check current environment variables
vercel env ls

# Add the environment variable if it doesn't exist
vercel env add MAINTENANCE_MODE true

# Deploy to production
vercel --prod
```

### Step 3: Verify API Function
Check if the API endpoint is working:
```
https://your-site.vercel.app/api/maintenance-status
```

You should see a JSON response like:
```json
{
  "maintenanceMode": true,
  "timestamp": "2025-01-27T...",
  "environment": "production",
  "message": "Site is currently in maintenance mode"
}
```

## 🔍 Common Issues & Solutions

### Issue 1: API Endpoint Returns 404
**Problem:** The `/api/maintenance-status` endpoint doesn't exist.

**Solution:** 
1. Make sure `api/maintenance-status.js` exists in your project
2. Verify `vercel.json` includes the API function configuration
3. Redeploy: `vercel --prod`

### Issue 2: Environment Variable Not Set
**Problem:** `MAINTENANCE_MODE` is not set in Vercel.

**Solution:**
```bash
# Set the environment variable
vercel env add MAINTENANCE_MODE true

# Verify it's set
vercel env ls

# Deploy to production
vercel --prod
```

### Issue 3: Environment Variable Set But Not Working
**Problem:** The variable is set but the site still shows as live.

**Solution:**
1. Clear browser cache
2. Check browser console for errors
3. Verify the API endpoint is accessible
4. Check if there are any JavaScript errors

### Issue 4: Maintenance Page Not Loading
**Problem:** Maintenance mode is enabled but the page doesn't load.

**Solution:**
1. Verify `maintenance.html` exists
2. Check if the route is configured in `vercel.json`
3. Test the maintenance page directly: `/maintenance`

## 🧪 Testing Steps

### 1. Local Testing
```bash
# Enable maintenance mode locally
node toggle-maintenance.js on

# Test locally
# Visit your site - should redirect to maintenance page

# Disable maintenance mode
node toggle-maintenance.js off
```

### 2. Production Testing
```bash
# Enable maintenance mode in Vercel
vercel env add MAINTENANCE_MODE true
vercel --prod

# Test production site
# Should redirect to maintenance page

# Disable maintenance mode
vercel env add MAINTENANCE_MODE false
vercel --prod
```

### 3. API Testing
```bash
# Test the API endpoint
curl https://your-site.vercel.app/api/maintenance-status

# Should return JSON with maintenance status
```

## 📊 Debug Information

### Console Logs
Open your browser's developer console and look for:
- 🔍 Checking Vercel maintenance mode...
- 📡 Trying API endpoint: /api/maintenance-status
- 📡 API Response status: 200
- 📡 API Response data: {...}

### Status Files
Check these files for current status:
- `/maintenance-status.txt` - Should contain "true" or "false"
- `/maintenance-status.json` - Should contain JSON status

### Network Tab
In browser dev tools, check the Network tab for:
- API calls to `/api/maintenance-status`
- Status file requests
- Any failed requests or errors

## 🚀 Emergency Maintenance Mode

If you need to enable maintenance mode immediately:

### Option 1: Update Status Files
```bash
# Enable maintenance mode
node toggle-maintenance.js on

# Deploy immediately
vercel --prod
```

### Option 2: Direct File Update
1. Edit `maintenance-status.txt` - change to "true"
2. Edit `maintenance-status.json` - change `maintenanceMode` to `true`
3. Deploy: `vercel --prod`

### Option 3: Force Redirect
Add this to your HTML files temporarily:
```html
<script>
if (window.location.pathname !== '/maintenance') {
    window.location.href = '/maintenance';
}
</script>
```

## 📞 Getting Help

If none of these solutions work:

1. **Check Vercel Logs:**
   ```bash
   vercel logs
   ```

2. **Test API Function Locally:**
   ```bash
   vercel dev
   # Then visit /api/maintenance-status
   ```

3. **Verify File Structure:**
   ```
   your-project/
   ├── api/
   │   └── maintenance-status.js
   ├── maintenance-status.txt
   ├── maintenance-status.json
   ├── maintenance-toggle.js
   └── vercel.json
   ```

4. **Check for JavaScript Errors:**
   - Open browser console
   - Look for red error messages
   - Check if `maintenance-toggle.js` loads correctly

## ✅ Success Checklist

- [ ] `MAINTENANCE_MODE=true` is set in Vercel
- [ ] API endpoint `/api/maintenance-status` returns correct JSON
- [ ] Status files are updated correctly
- [ ] No JavaScript errors in console
- [ ] Maintenance page loads correctly
- [ ] Site redirects to maintenance page when enabled

---

**Need More Help?** Check the main `MAINTENANCE_SYSTEM_README.md` for complete documentation.
