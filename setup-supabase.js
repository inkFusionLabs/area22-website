#!/usr/bin/env node

// Supabase Setup Script for Area22 Music Request System
// Run with: node setup-supabase.js

const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials (from supabase-config.js)
const SUPABASE_URL = 'https://wcxwadutvxvwuxgxhlhr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeHdhZHV0dnh2d3V4Z3hobGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTYxOTAsImV4cCI6MjA3MjczMjE5MH0.haEeMvPhX9mY2iY7qNrSK-abR4V4JDcXPgm-UriDmI0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupDatabase() {
    console.log('🚀 Setting up Area22 Music Request Database...\n');

    try {
        // Check if table exists
        console.log('📋 Checking if song_requests table exists...');
        const { data: existingData, error: checkError } = await supabase
            .from('song_requests')
            .select('*')
            .limit(1);

        if (checkError && !checkError.message.includes('relation "public.song_requests" does not exist')) {
            throw checkError;
        }

        if (!checkError) {
            console.log('✅ Table already exists!');
            console.log('🎯 Your database is ready to use!\n');
            console.log('📱 Test your system:');
            console.log('   Form: http://localhost:8000/music-request.html');
            console.log('   Dashboard: http://localhost:8000/dj-dashboard.html');
            console.log('   QR Code: http://localhost:8000/qr-code.html');
            return;
        }

        console.log('❌ Table does not exist. Please create it manually in Supabase Dashboard:\n');

        console.log('📋 Go to: https://supabase.com/dashboard/project/vwiiwxbncaojngpdtrql/sql');
        console.log('📋 Click "New Query" and paste this SQL:\n');

        const sql = `-- Create the song_requests table
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
    FOR ALL USING (auth.role() = 'authenticated');`;

        console.log('```sql');
        console.log(sql);
        console.log('```');
        console.log('\n📋 Then click "Run" to execute the SQL.');
        console.log('\n🎯 After running the SQL, your database will be ready!');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check your internet connection');
        console.log('2. Verify your Supabase credentials in supabase-config.js');
        console.log('3. Make sure your Supabase project is active');
    }
}

// Run the setup
setupDatabase();
