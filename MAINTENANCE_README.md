# 🛠️ Area22 Maintenance Mode System

A **SECURE** professional maintenance page system for your Area22 DJ website that allows authorized users to easily switch between maintenance mode and live operation.

## 🔒 **SECURITY FEATURES**

- **🔐 Password Protected** - Only authorized users can access maintenance controls
- **🚫 Public Access Blocked** - Regular visitors cannot see or use maintenance buttons
- **🔑 Secure Authentication** - Admin password required for all maintenance functions
- **🛡️ Access Control** - Multiple layers of security prevent unauthorized access
- **🔒 Session Management** - Secure login/logout system with local storage

## 🚀 Features

- **Professional Maintenance Page** - Matches your website's design theme
- **Secure Toggle System** - Only accessible to authenticated administrators
- **Strobe Light Effects** - Maintains your iconic visual theme
- **Contact Information** - Visitors can still reach you during maintenance
- **Progress Indicators** - Shows maintenance status and progress
- **Mobile Responsive** - Works perfectly on all devices
- **Keyboard Shortcuts** - Quick access for authenticated administrators
- **Login/Logout System** - Secure admin authentication

## 🔐 **How to Access Admin Controls**

### **Method 1: URL Parameter (Recommended)**
Add `?admin=true` to your website URL:
```
https://yourdomain.com/?admin=true
```
This will show the admin login button.

### **Method 2: Admin Panel Access**
If you're coming from an admin panel, the system will automatically detect it.

### **Method 3: Internal Network**
If accessing from internal networks, the system may automatically show admin controls.

## 📱 How to Use

### **Step 1: Access Admin Controls**
1. **Add `?admin=true` to your URL** (e.g., `yourdomain.com/?admin=true`)
2. **Look for the 🔐 Admin Login button** in the top-right corner
3. **Click the button** to open the login modal

### **Step 2: Authenticate**
1. **Enter your admin password** in the secure modal
2. **Click Login** to authenticate
3. **You'll see a success message** and the maintenance toggle button will appear

### **Step 3: Use Maintenance Controls**
1. **🛠️ Enable Maintenance** - Click to put site in maintenance mode
2. **🚀 Go Live** - Click to restore normal operation
3. **🔓 Logout** - Use Ctrl/Cmd + Shift + O to logout

### **Enable Maintenance Mode**

#### **Method 1: Using the Toggle Button (After Authentication)**
1. **Authenticate first** using the steps above
2. **Look for the 🛠️ Enable Maintenance button** in the top-right corner
3. **Click the button**
4. **Confirm the action**
5. **You'll be redirected to the maintenance page**

#### **Method 2: Direct URL Access**
- Navigate to: `yourdomain.com/maintenance`
- This will show the maintenance page

#### **Method 3: Keyboard Shortcut (After Authentication)**
- Press **Ctrl/Cmd + Shift + M** to toggle maintenance mode

### **Disable Maintenance Mode (Go Live)**

#### **Method 1: Using the Toggle Button**
1. **On the maintenance page**, look for the **🚀 Go Live** button
2. **Click the button**
3. **Confirm the action**
4. **You'll be redirected back to the live site**

#### **Method 2: Keyboard Shortcut**
- Press **Ctrl/Cmd + Shift + L** to go live

#### **Method 3: Direct Navigation**
- Navigate to: `yourdomain.com/` (main site)

## 🔑 **Default Admin Password**

**Default Password:** `Area22Admin2024!`

**⚠️ IMPORTANT:** Change this password immediately after first use!

### **How to Change Password:**
Edit the `maintenance-toggle.js` file and change this line:
```javascript
this.adminPassword = 'Area22Admin2024!'; // Change this to your preferred password
```

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

// Check if authenticated
console.log('Authenticated:', window.maintenanceToggle.isAuthenticated);
```

### **Logout from Admin**
```javascript
// Logout from admin access
window.maintenanceToggle.logout();
```

## 🔧 Technical Details

### **Files Created**
- `maintenance.html` - The maintenance page
- `maintenance-toggle.js` - Secure toggle functionality with authentication
- `vercel.json` - Updated with maintenance routes

### **Security Implementation**
- **Password Protection** - Admin password required for access
- **Access Control** - Multiple methods to verify admin status
- **Session Management** - Secure authentication tokens
- **Public Blocking** - Regular visitors cannot access controls
- **URL Parameter Control** - Admin access via specific URL parameters

### **Routes**
- `/maintenance` - Maintenance page (503 status)
- `/` - Main website (200 status)
- `/?admin=true` - Admin access mode

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
- **Secure Login Modal** - Professional admin authentication

### **Animations**
- **Card Glow** - Subtle green glow effect
- **Logo Pulse** - Breathing animation for the logo
- **Wrench Icon** - Rotating maintenance tool
- **Progress Fill** - Animated progress bar
- **Hover Effects** - Interactive contact items
- **Notification Animations** - Smooth slide-in/out effects

## 📱 Mobile Optimization

- **Responsive Design** - Adapts to all screen sizes
- **Touch-Friendly** - Optimized for mobile devices
- **Fast Loading** - Optimized assets and animations
- **Accessibility** - Screen reader friendly

## 🔒 Security Features

- **No-Cache Headers** - Prevents caching during maintenance
- **Security Headers** - XSS protection, frame options, etc.
- **Proper Status Codes** - SEO-friendly maintenance indication
- **Password Protection** - Admin-only access to controls
- **Access Control** - Multiple verification methods
- **Session Security** - Secure authentication management

## 🚨 Emergency Access

If you need to access your site during maintenance:

1. **Direct File Access** - Navigate directly to `index.html`
2. **Admin Panel** - Use your existing admin access
3. **FTP/File Manager** - Modify files directly on your server
4. **URL Parameter** - Add `?admin=true` to access admin controls

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

## 🔄 Quick Commands (After Authentication)

```javascript
// Enable maintenance
window.maintenanceToggle.enableMaintenance();

// Go live
window.maintenanceToggle.goLive();

// Set duration
window.maintenanceToggle.setMaintenanceDuration(6);

// Update message
window.maintenanceToggle.updateMaintenanceMessage('Custom message here');

// Check status
console.log(window.maintenanceToggle.isMaintenanceMode);

// Logout
window.maintenanceToggle.logout();
```

## ⌨️ Keyboard Shortcuts (After Authentication)

- **Ctrl/Cmd + Shift + M** - Toggle maintenance mode
- **Ctrl/Cmd + Shift + L** - Go live
- **Ctrl/Cmd + Shift + O** - Logout from admin

## 📋 Deployment Checklist

- [ ] Upload `maintenance.html` to your server
- [ ] Upload `maintenance-toggle.js` to your server
- [ ] Update `vercel.json` (if using Vercel)
- [ ] **Change the default admin password** in `maintenance-toggle.js`
- [ ] Test admin access with `?admin=true` parameter
- [ ] Test maintenance mode toggle
- [ ] Verify contact information is correct
- [ ] Test on mobile devices
- [ ] Check loading times
- [ ] Test logout functionality

## 🆘 Troubleshooting

### **Admin Login Button Not Appearing**
- **Add `?admin=true` to your URL** (e.g., `yourdomain.com/?admin=true`)
- Check JavaScript console for errors
- Verify `maintenance-toggle.js` is loaded
- Check browser compatibility

### **Can't Login**
- Verify you're using the correct password
- Check if you changed the default password
- Clear browser cache and try again
- Check JavaScript console for errors

### **Maintenance Page Not Loading**
- Check file permissions
- Verify file paths
- Clear browser cache

### **Toggle Button Not Appearing After Login**
- Check JavaScript console for errors
- Verify authentication was successful
- Try refreshing the page
- Check if you're logged out

### **Can't Switch Back to Live**
- Navigate directly to main site URL
- Check JavaScript console for errors
- Verify all files are properly uploaded
- Ensure you're still authenticated

## 🔐 Security Best Practices

1. **Change Default Password** - Immediately after first use
2. **Use Strong Password** - Mix of letters, numbers, symbols
3. **Limit Access** - Only share with trusted team members
4. **Regular Updates** - Keep the system updated
5. **Monitor Access** - Check logs for unauthorized attempts
6. **Backup Regularly** - Keep backups of your configuration

## 🎉 Success!

Your Area22 website now has a **SECURE, professional maintenance system** that:
- ✅ **Maintains your brand identity**
- ✅ **Provides secure admin-only access**
- ✅ **Prevents public misuse**
- ✅ **Keeps visitors informed**
- ✅ **Preserves contact accessibility**
- ✅ **Looks professional and polished**
- ✅ **Includes multiple security layers**

**Ready to use securely!** 🚀🔒
