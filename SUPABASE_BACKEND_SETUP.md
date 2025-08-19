# 🎵 Area22 Music Request System - Supabase Backend Setup Guide

This guide will walk you through setting up a complete backend system for the Area22 music request system using Supabase.

## 🚀 **Quick Start**

### **1. Access Your Supabase Dashboard**
- Go to [https://supabase.com](https://supabase.com)
- Sign in to your account
- Select your project: `area22-website`

### **2. Open SQL Editor**
- In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
- Click **"New Query"** to create a new SQL script

### **3. Run the Setup Script**
- Copy the entire contents of `supabase-setup.sql`
- Paste it into the SQL Editor
- Click **"Run"** to execute all the setup commands

## 📊 **Database Schema Overview**

### **Core Tables**

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **`events`** | Main event management | Session IDs, event details, status tracking |
| **`song_requests`** | Song request management | Guest submissions, priority, status |
| **`event_settings`** | Event configuration | Customization, limits, approval settings |
| **`guest_sessions`** | Guest tracking | Device tracking, request limits |
| **`dj_profiles`** | DJ management | User profiles, verification |
| **`event_analytics`** | Event statistics | Real-time metrics, performance data |

### **Key Relationships**
```
events (1) ←→ (many) song_requests
events (1) ←→ (1) event_settings
events (1) ←→ (1) event_analytics
events (1) ←→ (many) guest_sessions
```

## 🔐 **Security Features**

### **Row Level Security (RLS)**
- **Public Access**: Guests can submit requests for active events
- **Authenticated Access**: DJs can manage events and requests
- **Data Isolation**: Events are isolated by session ID
- **Guest Limits**: Configurable request limits per guest

### **Security Policies**
- ✅ Anyone can view active events
- ✅ Anyone can submit requests for active events
- ✅ Only authenticated users can manage events
- ✅ Event creators can update their own events
- ✅ System can update analytics automatically

## ⚡ **Performance Features**

### **Database Indexes**
- **Session ID Indexes**: Fast lookups by session
- **Status Indexes**: Quick filtering by request status
- **Date Indexes**: Efficient date-based queries
- **Guest Indexes**: Fast guest tracking

### **Automatic Triggers**
- **Timestamp Updates**: `updated_at` fields updated automatically
- **Analytics Sync**: Real-time analytics updates
- **Related Records**: Event settings and analytics created automatically

## 🎯 **Backend Services**

### **EventService**
```javascript
// Create new events
await EventService.createEvent({
    session_id: 'WED-20240615-X7K',
    event_name: 'Sarah & John Wedding',
    event_date: '2024-06-15',
    event_location: 'Basingstoke Community Hall',
    dj_name: 'Area22'
});

// Get event details
const event = await EventService.getEventBySessionId('WED-20240615-X7K');
```

### **RequestService**
```javascript
// Submit song request
await RequestService.submitRequest({
    session_id: 'WED-20240615-X7K',
    song_title: 'Perfect',
    artist_name: 'Ed Sheeran',
    guest_name: 'Sarah',
    priority: 'high'
});

// Update request status
await RequestService.updateRequestStatus(requestId, 'playing', 'Great choice!');
```

### **AnalyticsService**
```javascript
// Get comprehensive analytics
const analytics = await AnalyticsService.getEventAnalytics('WED-20240615-X7K');
console.log('Total requests:', analytics.total_requests);
console.log('Unique guests:', analytics.unique_guests);
```

### **RealtimeService**
```javascript
// Subscribe to real-time updates
RealtimeService.subscribeToRequests(sessionId, (payload) => {
    console.log('New request:', payload.new);
    // Update UI in real-time
});
```

## 🛠️ **Implementation Steps**

### **Step 1: Database Setup**
1. Run the SQL setup script in Supabase
2. Verify all tables, indexes, and functions are created
3. Check that RLS is enabled on all tables
4. Verify security policies are in place

### **Step 2: Update Frontend**
1. Replace `supabase-config.js` with `supabase-backend.js`
2. Update event creation to use `EventService.createEvent()`
3. Update request submission to use `RequestService.submitRequest()`
4. Add real-time subscriptions for live updates

### **Step 3: Test the System**
1. Create a test event
2. Submit test song requests
3. Verify analytics are updating in real-time
4. Test guest request limits
5. Verify security policies work correctly

## 📱 **Frontend Integration**

### **Update DJ Dashboard**
```javascript
// Import the new backend services
import { EventService, RequestService, AnalyticsService } from './supabase-backend.js';

// Create events using the service
async function createNewEvent() {
    const result = await EventService.createEvent({
        session_id: generateSessionId(),
        event_name: document.getElementById('event-name').value,
        event_date: document.getElementById('event-date').value,
        event_location: document.getElementById('event-location').value,
        dj_name: document.getElementById('dj-name').value
    });
    
    if (result.success) {
        console.log('Event created:', result.data);
        // Refresh dashboard
    }
}
```

### **Update Music Request Page**
```javascript
// Submit requests using the service
async function submitRequest() {
    const result = await RequestService.submitRequest({
        session_id: currentEvent.session_id,
        song_title: document.getElementById('song-title').value,
        artist_name: document.getElementById('artist-name').value,
        guest_name: document.getElementById('guest-name').value,
        note: document.getElementById('note').value,
        priority: document.getElementById('priority').value
    });
    
    if (result.success) {
        console.log('Request submitted:', result.data);
        // Show success message
    } else {
        console.error('Error:', result.error);
        // Show error message
    }
}
```

## 🔍 **Monitoring & Debugging**

### **Supabase Dashboard Tools**
- **Table Editor**: View and edit data directly
- **Logs**: Monitor API requests and errors
- **API Docs**: Auto-generated API documentation
- **Database**: View table structure and relationships

### **Common Issues & Solutions**

#### **Issue: RLS Policy Errors**
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'events';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'events';
```

#### **Issue: Function Not Found**
```sql
-- Check if functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public';
```

#### **Issue: Trigger Not Working**
```sql
-- Check triggers
SELECT trigger_name, event_object_table, event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## 📈 **Advanced Features**

### **Custom Event Settings**
```javascript
// Create event with custom settings
await EventService.createEvent({
    session_id: 'WED-20240615-X7K',
    event_name: 'Wedding',
    // ... other fields
    settings: {
        allow_anonymous: false,
        require_approval: true,
        max_requests_per_guest: 3,
        custom_message: 'Welcome to our special day!',
        theme_color: '#ff69b4'
    }
});
```

### **Guest Request Limits**
```javascript
// Check guest limits before submission
const limitCheck = await RequestService.checkGuestRequestLimit(
    sessionId, 
    guestName
);

if (!limitCheck.allowed) {
    alert(limitCheck.message);
    return;
}
```

### **Real-time Analytics**
```javascript
// Subscribe to analytics updates
RealtimeService.subscribeToAnalytics(sessionId, (payload) => {
    if (payload.eventType === 'UPDATE') {
        updateDashboardStats(payload.new);
    }
});
```

## 🚀 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Database tables created and indexed
- [ ] RLS policies configured
- [ ] Functions and triggers working
- [ ] Sample data inserted for testing

### **Frontend Updates**
- [ ] `supabase-backend.js` integrated
- [ ] Event creation using `EventService`
- [ ] Request submission using `RequestService`
- [ ] Real-time subscriptions added
- [ ] Error handling implemented

### **Testing**
- [ ] Event creation works
- [ ] Song requests can be submitted
- [ ] Real-time updates work
- [ ] Guest limits enforced
- [ ] Security policies working

### **Production**
- [ ] Remove sample data
- [ ] Configure production environment
- [ ] Monitor performance metrics
- [ ] Set up error logging

## 🎉 **Benefits of This Backend**

### **Scalability**
- **Database Indexes**: Fast queries even with thousands of requests
- **Real-time Updates**: Live synchronization across all clients
- **Efficient Storage**: Optimized data structure and relationships

### **Security**
- **Row Level Security**: Data isolation and access control
- **Guest Limits**: Prevent abuse and spam
- **Audit Trail**: Track all changes and requests

### **Professional Features**
- **Analytics**: Comprehensive event statistics
- **Customization**: Event-specific settings and themes
- **Guest Tracking**: Monitor engagement and behavior
- **Multi-Event Support**: Manage multiple events simultaneously

### **Developer Experience**
- **Clean API**: Simple, consistent service methods
- **Error Handling**: Comprehensive error messages
- **Type Safety**: Well-defined data structures
- **Documentation**: Clear examples and usage

## 🆘 **Support & Troubleshooting**

### **Common Questions**

**Q: How do I add more event types?**
A: The `event_type` field in the `events` table accepts any text value. You can add validation in your frontend or create an enum if needed.

**Q: Can I customize the guest request limits?**
A: Yes! The `max_requests_per_guest` field in `event_settings` is configurable per event.

**Q: How do I track which songs are most popular?**
A: Use the `AnalyticsService.getRequestStats()` method to get genre breakdowns and popular artists.

**Q: Can I export event data?**
A: Yes! Use the Supabase dashboard or create custom export functions using the services.

### **Getting Help**
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Community**: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [https://discord.supabase.com](https://discord.supabase.com)

## 🎯 **Next Steps**

1. **Run the SQL setup script** in your Supabase dashboard
2. **Update your frontend** to use the new backend services
3. **Test the system** with sample events and requests
4. **Customize settings** for your specific needs
5. **Deploy to production** and start managing real events!

---

**🎵 Ready to revolutionize your DJ events with a professional backend system? Let's get started! 🚀**
