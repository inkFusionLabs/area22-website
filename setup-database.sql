-- ==============================================
-- AREA22 MUSIC REQUEST SYSTEM - DATABASE SETUP
-- ==============================================
-- Run this file in your Supabase SQL Editor
-- Project URL: https://supabase.com/dashboard/project/wcxwadutvxvwuxgxhlhr/sql

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

-- Create policies for public access
CREATE POLICY "Enable insert for all users" ON song_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all users" ON song_requests
    FOR SELECT USING (true);

CREATE POLICY "Enable update/delete for authenticated users" ON song_requests
    FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================
-- SETUP COMPLETE!
-- ==============================================
-- Your music request system is now ready.
-- Test it at: http://localhost:8000/test-supabase.html
