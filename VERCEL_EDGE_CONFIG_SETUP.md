# 🚀 Vercel Edge Config Maintenance Setup Guide

This guide shows you how to set up maintenance mode using Vercel's official **Edge Config** method, which is the recommended approach for maintenance pages on Vercel.

## 🎯 **Why Edge Config?**

Based on [Vercel's official maintenance page template](https://vercel.com/templates/next.js/maintenance-page), Edge Config provides:

- ✅ **Lightning fast** - Runs at the edge globally
- ✅ **Real-time updates** - Instant maintenance mode changes
- ✅ **No API delays** - Direct configuration access
- ✅ **Official Vercel method** - Best practice approach
- ✅ **Reliable** - No serverless function cold starts

## 🔧 **Setup Steps**

### **Step 1: Create Edge Config in Vercel**

1. **Go to your Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your Area22 project

2. **Navigate to Storage**
   - Click on **Storage** in the left sidebar
   - Click **Create Database**

3. **Create Edge Config**
   - Select **Edge Config**
   - Give it a name like `area22-maintenance`
   - Choose your region (closest to your users)
   - Click **Create**

### **Step 2: Configure Edge Config**

1. **Add Configuration Data**
   - Click on your new Edge Config
   - Go to **Data** tab
   - Add this JSON content:

```json
{
  "isInMaintenanceMode": false,
  "maintenanceMessage": "Site is currently live",
  "expectedDuration": "N/A",
  "lastUpdated": "2025-01-27T00:00:00.000Z"
}
```

2. **Save the Configuration**
   - Click **Save** to store the configuration

### **Step 3: Get Your Edge Config URL**

1. **Copy the Connection String**
   - In your Edge Config, go to **Settings** tab
   - Copy the **Connection String** (looks like: `https://...vercel-storage.com/...`)

2. **Add to Your HTML**
   - Add this meta tag to your HTML files:

```html
<meta name="edge-config-url" content="YOUR_EDGE_CONFIG_CONNECTION_STRING">
```

### **Step 4: Update Your HTML Files**

Add the Edge Config meta tag to your HTML files. For example, in `index.html`:

```html
<head>
    <!-- ... existing meta tags ... -->
    <meta name="edge-config-url" content="https://your-edge-config.vercel-storage.com/...">
    <title>Area22 - Professional DJ Services</title>
</head>
```

### **Step 5: Load the Edge Maintenance System**

Make sure you have the Edge maintenance system loaded:

```html
<script src="vercel-edge-maintenance.js"></script>
```

## 🎮 **Using Maintenance Mode**

### **Enable Maintenance Mode:**

1. **Via Vercel Dashboard:**
   - Go to your Edge Config
   - Change `isInMaintenanceMode` to `true`
   - Save the configuration

2. **Via Vercel CLI:**
   ```bash
   # Install Vercel CLI if you haven't
   npm install -g vercel
   
   # Update Edge Config
   vercel env pull .env.local
   # Edit the Edge Config value
   vercel env push
   ```

### **Disable Maintenance Mode:**

1. **Via Vercel Dashboard:**
   - Change `isInMaintenanceMode` to `false`
   - Save the configuration

2. **Via Vercel CLI:**
   - Same process as above

## 🔍 **Testing Your Setup**

### **Local Testing:**
1. **Set up Edge Config URL:**
   ```javascript
   // In browser console
   window.vercelEdgeMaintenance.setEdgeConfigUrl('YOUR_EDGE_CONFIG_URL');
   ```

2. **Test maintenance mode:**
   ```javascript
   // Check current status
   window.vercelEdgeMaintenance.getStatus();
   
   // Manual check
   window.vercelEdgeMaintenance.manualCheck();
   ```

### **Production Testing:**
1. **Deploy your changes:**
   ```bash
   vercel --prod
   ```

2. **Test the live site:**
   - Visit your live site
   - Enable maintenance mode in Edge Config
   - Verify redirect to maintenance page

## 📊 **Edge Config Schema**

Your Edge Config should contain:

```json
{
  "isInMaintenanceMode": false,
  "maintenanceMessage": "Site is currently live",
  "expectedDuration": "N/A",
  "lastUpdated": "2025-01-27T00:00:00.000Z",
  "adminContact": "area-22@mail.co.uk",
  "emergencyInfo": "For urgent matters, call 07934 284 930"
}
```

## 🚨 **Emergency Maintenance Mode**

### **Quick Enable:**
1. Go to Vercel Dashboard
2. Open your Edge Config
3. Change `isInMaintenanceMode` to `true`
4. Save immediately
5. Site goes into maintenance mode instantly

### **Quick Disable:**
1. Change `isInMaintenanceMode` to `false`
2. Save immediately
3. Site goes live instantly

## 🔒 **Security Considerations**

- **Edge Config is public** - Don't store sensitive information
- **Use environment variables** for any private data
- **Monitor access** through Vercel dashboard
- **Regular backups** of your configuration

## 📱 **Monitoring & Alerts**

### **Vercel Dashboard:**
- Monitor Edge Config usage
- Check response times
- View error rates

### **Custom Monitoring:**
```javascript
// Check maintenance status every minute
setInterval(() => {
    const status = window.vercelEdgeMaintenance.getStatus();
    console.log('Maintenance Status:', status);
}, 60000);
```

## 🎵 **Benefits for Area22:**

1. **Professional Service** - No downtime during maintenance
2. **Instant Control** - Enable/disable maintenance in seconds
3. **Global Performance** - Edge Config runs worldwide
4. **Reliability** - Official Vercel method
5. **Integration** - Works with your existing admin system

## 🔄 **Migration from Old System:**

1. **Keep your existing system** - No breaking changes
2. **Add Edge Config** - New capability
3. **Test both systems** - Ensure compatibility
4. **Gradual transition** - Use Edge Config for new features

---

**Need Help?** Check the [Vercel Edge Config documentation](https://vercel.com/docs/storage/edge-config) or refer to the [maintenance page template](https://vercel.com/templates/next.js/maintenance-page).

**Last Updated:** January 2025  
**Based on:** Vercel's official maintenance page template
