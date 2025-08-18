# 🚀 Supabase Setup Guide for Area22 Music Request System

This guide will walk you through setting up Supabase to replace the local server with a cloud-based, real-time database.

## 🌟 **Why Supabase?**

- ✅ **No server management** - fully managed backend
- ✅ **Real-time updates** - guests see requests instantly
- ✅ **Automatic scaling** - handles any number of requests
- ✅ **Built-in security** - row-level security policies
- ✅ **Free tier** - generous free plan for starting out
- ✅ **Easy deployment** - works with Vercel, Netlify, etc.

## 🛠️ **Step 1: Create Supabase Account**

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Create a new organization (or use existing)

## 🏗️ **Step 2: Create New Project**

1. Click "New Project"
2. **Organization**: Select your organization
3. **Name**: `area22-music-requests`
4. **Database Password**: Create a strong password (save this!)
5. **Region**: Choose closest to your events (e.g., London for UK)
6. Click "Create new project"
7. Wait 2-3 minutes for setup

## 🗄️ **Step 3: Create Database Table**

### **Option A: Using SQL Editor (Recommended)**

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL and click **Run**:

```sql
-- Create the song_requests table
CREATE TABLE song_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    song_title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    guest_name TEXT DEFAULT 'Anonymous',
    note TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'playing', 'completed', 'skipped')),
    event_code TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_song_requests_created_at ON song_requests(created_at DESC);
CREATE INDEX idx_song_requests_status ON song_requests(status);
CREATE INDEX idx_song_requests_priority ON song_requests(priority);
CREATE INDEX idx_song_requests_event_code ON song_requests(event_code);

-- Enable Row Level Security (RLS)
ALTER TABLE song_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert song requests
CREATE POLICY "Enable insert for all users" ON song_requests
    FOR INSERT WITH CHECK (true);

-- Policy: Anyone can view song requests
CREATE POLICY "Enable select for all users" ON song_requests
    FOR SELECT USING (true);

-- Policy: Only authenticated users can update/delete (for DJ dashboard)
CREATE POLICY "Enable update/delete for authenticated users" ON song_requests
    FOR ALL USING (auth.role() = 'authenticated');
```

### **Option B: Using Table Editor**

1. Go to **Table Editor** in Supabase dashboard
2. Click **New Table**
3. **Name**: `song_requests`
4. **Columns**:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `song_title` (text, not null)
   - `artist_name` (text, not null)
   - `guest_name` (text, default: 'Anonymous')
   - `note` (text)
   - `priority` (text, default: 'normal')
   - `status` (text, default: 'pending')
   - `event_code` (text, default: 'default')
   - `created_at` (timestamp, default: now())

## 🔑 **Step 4: Get API Keys**

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 📝 **Step 5: Update Configuration**

1. Open `supabase-config.js` in your project
2. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

**Example:**
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 🧪 **Step 6: Test the System**

1. **Start your local server** (for testing):
   ```bash
   npm start
   ```

2. **Open music request page**:
   - http://localhost:3001/music-request.html

3. **Submit a test request**:
   - Fill out the form
   - Submit a song request
   - Check Supabase dashboard → Table Editor → song_requests

4. **Check DJ dashboard**:
   - http://localhost:3001/dj-dashboard
   - Should show your test request

## 🚀 **Step 7: Deploy to Production**

### **Option A: Deploy with Vercel**
1. Push your updated code to GitHub
2. Vercel will automatically redeploy
3. Your custom domain will now use Supabase

### **Option B: Deploy to Netlify**
1. Push code to GitHub
2. Connect Netlify to your repository
3. Deploy automatically

## 🔒 **Security Features**

Your Supabase setup includes:
- **Row Level Security (RLS)** enabled
- **Public read/write** for song requests (anyone can submit/view)
- **Authenticated users only** for updates/deletes (DJ dashboard)
- **Input validation** on priority and status fields
- **Automatic timestamps** for all requests

## 📊 **Real-Time Features**

Once set up, you get:
- **Instant updates** when guests submit requests
- **Live DJ dashboard** that updates automatically
- **No page refreshes** needed
- **Multiple users** can see requests simultaneously

## 🎯 **Usage at Events**

1. **No server needed** - everything runs in the cloud
2. **Works from anywhere** - no local network setup
3. **Handles any number** of requests and users
4. **Automatic backups** - never lose data
5. **Professional reliability** - 99.9% uptime

## 🚨 **Troubleshooting**

### **"Supabase is not defined" Error**
- Make sure you included the Supabase script before your config
- Check that supabase-config.js is loaded

### **"Table doesn't exist" Error**
- Verify you created the table in Supabase
- Check table name spelling (should be `song_requests`)

### **"Permission denied" Error**
- Check RLS policies are set correctly
- Verify API keys are correct

### **Requests not showing up**
- Check browser console for errors
- Verify Supabase connection in dashboard
- Test with a simple insert in SQL editor

## 💰 **Pricing**

- **Free Tier**: 50,000 monthly active users, 500MB database
- **Pro Plan**: $25/month for 100,000 users, 8GB database
- **Perfect for events**: Most DJ events stay within free tier

## 🎵 **Next Steps**

1. **Set up Supabase** following this guide
2. **Test locally** to ensure everything works
3. **Deploy to production** with your website
4. **Share QR codes** at your events
5. **Enjoy real-time music requests!**

---

**🎵 Your music request system will now work from anywhere in the world with real-time updates! 🎵**
