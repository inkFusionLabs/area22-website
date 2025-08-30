# 🛠️ Area22 Maintenance Mode System

A professional maintenance page system for your Area22 DJ website that allows you to easily switch between maintenance mode and live operation.

## 🚀 Features

- **Professional Maintenance Page** - Matches your website's design theme
- **Easy Toggle System** - Switch between maintenance and live mode instantly
- **Strobe Light Effects** - Maintains your iconic visual theme
- **Contact Information** - Visitors can still reach you during maintenance
- **Progress Indicators** - Shows maintenance status and progress
- **Mobile Responsive** - Works perfectly on all devices
- **Keyboard Shortcuts** - Quick access for administrators

## 📱 How to Use

### **Enable Maintenance Mode**

#### **Method 1: Using the Toggle Button**
1. Visit your website
2. Look for the **🛠️ Enable Maintenance** button in the top-right corner
3. Click the button
4. Confirm the action
5. You'll be redirected to the maintenance page

#### **Method 2: Direct URL Access**
- Navigate to: `yourdomain.com/maintenance`
- This will show the maintenance page

#### **Method 3: Keyboard Shortcut**
- Press **Ctrl/Cmd + Shift + M** to toggle maintenance mode

### **Disable Maintenance Mode (Go Live)**

#### **Method 1: Using the Toggle Button**
1. On the maintenance page, look for the **🚀 Go Live** button
2. Click the button
3. Confirm the action
4. You'll be redirected back to the live site

#### **Method 2: Keyboard Shortcut**
- Press **Ctrl/Cmd + Shift + L** to go live

#### **Method 3: Direct Navigation**
- Navigate to: `yourdomain.com/` (main site)

## 🎯 Customization Options

### **Update Maintenance Duration**
```javascript
// Set maintenance duration to 12 hours
window.maintenanceToggle.setMaintenanceDuration(12);
```

### **Update Maintenance Message**
```javascript
// Customize the maintenance message
window.maintenanceToggle.updateMaintenanceMessage('We are currently updating our website with new features. Please check back soon!');
```

### **Check Current Status**
```javascript
// Check if currently in maintenance mode
console.log('Maintenance Mode:', window.maintenanceToggle.isMaintenanceMode);
```

## 🔧 Technical Details

### **Files Created**
- `maintenance.html` - The maintenance page
- `maintenance-toggle.js` - Toggle functionality
- `vercel.json` - Updated with maintenance routes

### **Routes**
- `/maintenance` - Maintenance page (503 status)
- `/` - Main website (200 status)

### **Status Codes**
- **503 Service Unavailable** - Maintenance mode
- **200 OK** - Normal operation

## 🎨 Design Features

### **Visual Elements**
- **Strobe Lights** - 8 animated green lights
- **Glowing Logo** - Animated Area22 branding
- **Progress Bar** - Animated maintenance progress
- **Status Cards** - Clear maintenance information
- **Contact Grid** - Easy access to your contact details

### **Animations**
- **Card Glow** - Subtle green glow effect
- **Logo Pulse** - Breathing animation for the logo
- **Wrench Icon** - Rotating maintenance tool
- **Progress Fill** - Animated progress bar
- **Hover Effects** - Interactive contact items

## 📱 Mobile Optimization

- **Responsive Design** - Adapts to all screen sizes
- **Touch-Friendly** - Optimized for mobile devices
- **Fast Loading** - Optimized assets and animations
- **Accessibility** - Screen reader friendly

## 🔒 Security Features

- **No-Cache Headers** - Prevents caching during maintenance
- **Security Headers** - XSS protection, frame options, etc.
- **Proper Status Codes** - SEO-friendly maintenance indication

## 🚨 Emergency Access

If you need to access your site during maintenance:

1. **Direct File Access** - Navigate directly to `index.html`
2. **Admin Panel** - Use your existing admin access
3. **FTP/File Manager** - Modify files directly on your server

## 📞 Contact During Maintenance

Your maintenance page includes:
- **Phone Number** - 07934 284 930
- **Email** - area-22@mail.co.uk
- **Location** - Basingstoke Area
- **Availability** - 24/7 for inquiries

## 🎵 Brand Consistency

The maintenance page maintains your Area22 brand:
- **Same Color Scheme** - Green strobe lights theme
- **Same Typography** - Orbitron and Roboto fonts
- **Same Logo** - Area22 branding
- **Same Contact Info** - Consistent with main site

## 🔄 Quick Commands

```javascript
// Enable maintenance mode
window.maintenanceToggle.enableMaintenance();

// Go live
window.maintenanceToggle.goLive();

// Set duration
window.maintenanceToggle.setMaintenanceDuration(6);

// Update message
window.maintenanceToggle.updateMaintenanceMessage('Custom message here');

// Check status
console.log(window.maintenanceToggle.isMaintenanceMode);
```

## 📋 Deployment Checklist

- [ ] Upload `maintenance.html` to your server
- [ ] Upload `maintenance-toggle.js` to your server
- [ ] Update `vercel.json` (if using Vercel)
- [ ] Test maintenance mode toggle
- [ ] Verify contact information is correct
- [ ] Test on mobile devices
- [ ] Check loading times

## 🆘 Troubleshooting

### **Maintenance Page Not Loading**
- Check file permissions
- Verify file paths
- Clear browser cache

### **Toggle Button Not Appearing**
- Check JavaScript console for errors
- Verify `maintenance-toggle.js` is loaded
- Check browser compatibility

### **Can't Switch Back to Live**
- Navigate directly to main site URL
- Check JavaScript console for errors
- Verify all files are properly uploaded

## 🎉 Success!

Your Area22 website now has a professional maintenance system that:
- ✅ Maintains your brand identity
- ✅ Provides easy switching between modes
- ✅ Keeps visitors informed
- ✅ Preserves contact accessibility
- ✅ Looks professional and polished

**Ready to use!** 🚀
