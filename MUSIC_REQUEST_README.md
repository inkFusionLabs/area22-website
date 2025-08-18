# 🎵 Area22 Music Request System

A complete music request system for DJ events where guests can scan QR codes and request songs in real-time.

## 🚀 **How It Works**

### **For Event Guests:**
1. **Scan QR Code** at your event
2. **Fill out song request form** (song title, artist, name, notes, priority)
3. **Submit request** - it's instantly sent to the DJ
4. **Get confirmation** that request was received

### **For DJs:**
1. **View all requests** in real-time on DJ Dashboard
2. **Manage request status** (pending, playing, completed, skipped)
3. **See priority levels** and guest information
4. **Export requests** for record keeping

## 🛠️ **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Start the Server**
```bash
npm start
```

### **3. Access the System**
- **Music Request Page**: http://localhost:3001/music-request.html
- **DJ Dashboard**: http://localhost:3001/dj-dashboard
- **API Endpoint**: http://localhost:3001/api/requests

## 📱 **Usage**

### **At Events:**
1. **Share QR codes** with your guests
2. **Guests scan and request songs**
3. **Monitor requests** on your DJ dashboard
4. **Update status** as you play songs

### **DJ Dashboard Features:**
- **Real-time updates** every 10 seconds
- **Priority management** (urgent, high, normal)
- **Status tracking** (pending, playing, completed, skipped)
- **Statistics** (total, pending, urgent, completed)
- **Export functionality** for record keeping

## 🔧 **API Endpoints**

### **GET /api/requests**
- Get all song requests
- Used by DJ dashboard

### **POST /api/requests**
- Submit new song request
- Used by music request form

### **PUT /api/requests/:id**
- Update request status
- Used by DJ dashboard

### **DELETE /api/requests/:id**
- Delete specific request
- Used by DJ dashboard

### **DELETE /api/requests**
- Clear all requests
- Useful for new events

## 📊 **Data Storage**

- **File-based storage** using `song-requests.json`
- **Automatic backup** on each request
- **JSON format** for easy export and analysis

## 🌐 **Deployment Options**

### **Option 1: Local Server (Current)**
- Run on your laptop at events
- Connect via local network
- Perfect for small to medium events

### **Option 2: Cloud Hosting**
- Deploy to Vercel, Heroku, or AWS
- Access from anywhere with internet
- Better for large events or multiple DJs

### **Option 3: VPS/Dedicated Server**
- Full control over hosting
- Custom domain and SSL
- Professional setup for business use

## 🔒 **Security Features**

- **CORS enabled** for cross-origin requests
- **Input validation** on all requests
- **Error handling** with fallback options
- **Rate limiting** (can be added)

## 📱 **Mobile Optimization**

- **Responsive design** works on all devices
- **Touch-friendly** buttons and forms
- **Fast loading** for quick requests
- **Offline fallback** if server unavailable

## 🎯 **Event Management**

### **Before Event:**
1. Start the server
2. Clear any old requests
3. Test QR code scanning
4. Prepare DJ dashboard

### **During Event:**
1. Monitor incoming requests
2. Update status as you play songs
3. Manage priority levels
4. Keep guests engaged

### **After Event:**
1. Export request data
2. Clear requests for next event
3. Review popular songs
4. Plan future playlists

## 🚨 **Troubleshooting**

### **Server Won't Start:**
- Check if port 3001 is available
- Ensure Node.js is installed (version 16+)
- Verify all dependencies are installed

### **Requests Not Saving:**
- Check server console for errors
- Verify file permissions for `song-requests.json`
- Ensure server is running

### **Dashboard Not Updating:**
- Check browser console for errors
- Verify API endpoints are accessible
- Refresh the page manually

## 🔮 **Future Enhancements**

- **WebSocket support** for real-time updates
- **User authentication** for DJ access
- **Multiple event support** with event codes
- **Push notifications** for urgent requests
- **Analytics dashboard** with song popularity
- **Integration** with music streaming services

## 📞 **Support**

For technical support or feature requests, contact:
- **Email**: area-22@mail.co.uk
- **Phone**: 07934 284 930

## 📄 **License**

MIT License - Feel free to modify and use for your own events!

---

**🎵 Keep the music flowing and your guests happy with Area22 Music Request System! 🎵**
