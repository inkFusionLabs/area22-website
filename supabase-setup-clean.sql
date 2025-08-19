-- Area22 Music Request System - Supabase Database Setup (CLEAN VERSION)
-- Run these scripts in your Supabase SQL Editor

-- ============================================================================
-- DROP EXISTING TABLES (if any)
-- ============================================================================

DROP TABLE IF EXISTS event_analytics CASCADE;
DROP TABLE IF EXISTS guest_sessions CASCADE;
DROP TABLE IF EXISTS event_settings CASCADE;
DROP TABLE IF EXISTS song_requests CASCADE;
DROP TABLE IF EXISTS dj_profiles CASCADE;
DROP TABLE IF EXISTS events CASCADE;

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- 1. Events table (Main event management)
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    event_name TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_location TEXT,
    dj_name TEXT,
    event_type TEXT DEFAULT 'general',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    max_requests INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 2. Song requests table (Song request management)
CREATE TABLE song_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES events(session_id) ON DELETE CASCADE,
    song_title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    guest_name TEXT DEFAULT 'Anonymous',
    guest_email TEXT,
    note TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'playing', 'completed', 'skipped')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    played_at TIMESTAMP WITH TIME ZONE,
    dj_notes TEXT
);

-- 3. Event settings table (Event configuration)
CREATE TABLE event_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES events(session_id) ON DELETE CASCADE,
    allow_anonymous BOOLEAN DEFAULT TRUE,
    require_approval BOOLEAN DEFAULT FALSE,
    max_requests_per_guest INTEGER DEFAULT 5,
    auto_approve_priority TEXT DEFAULT 'normal',
    custom_message TEXT,
    theme_color TEXT DEFAULT '#00ff00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Guest sessions table (Guest tracking)
CREATE TABLE guest_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES events(session_id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    device_id TEXT,
    ip_address INET,
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_requests INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE
);

-- 5. DJ profiles table (DJ management)
CREATE TABLE dj_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dj_name TEXT NOT NULL,
    bio TEXT,
    profile_image TEXT,
    contact_email TEXT,
    phone TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Event analytics table (Event statistics)
CREATE TABLE event_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES events(session_id) ON DELETE CASCADE,
    total_requests INTEGER DEFAULT 0,
    pending_requests INTEGER DEFAULT 0,
    completed_requests INTEGER DEFAULT 0,
    skipped_requests INTEGER DEFAULT 0,
    unique_guests INTEGER DEFAULT 0,
    peak_hour INTEGER,
    most_requested_genre TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Events table indexes
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dj_name ON events(dj_name);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Song requests table indexes
CREATE INDEX idx_song_requests_session_id ON song_requests(session_id);
CREATE INDEX idx_song_requests_status ON song_requests(status);
CREATE INDEX idx_song_requests_priority ON song_requests(priority);
CREATE INDEX idx_song_requests_guest_name ON song_requests(guest_name);
CREATE INDEX idx_song_requests_created_at ON song_requests(created_at);

-- Event settings table indexes
CREATE INDEX idx_event_settings_session_id ON event_settings(session_id);

-- Guest sessions table indexes
CREATE INDEX idx_guest_sessions_session_id ON guest_sessions(session_id);
CREATE INDEX idx_guest_sessions_guest_name ON guest_sessions(guest_name);
CREATE INDEX idx_guest_sessions_device_id ON guest_sessions(device_id);

-- DJ profiles table indexes
CREATE INDEX idx_dj_profiles_user_id ON dj_profiles(user_id);
CREATE INDEX idx_dj_profiles_dj_name ON dj_profiles(dj_name);

-- Event analytics table indexes
CREATE INDEX idx_event_analytics_session_id ON event_analytics(session_id);

-- ============================================================================
-- CREATE FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to automatically create event settings and analytics
CREATE OR REPLACE FUNCTION create_event_related_records()
RETURNS TRIGGER AS $$
BEGIN
    -- Create event settings
    INSERT INTO event_settings (session_id) VALUES (NEW.session_id);
    
    -- Create event analytics
    INSERT INTO event_analytics (session_id) VALUES (NEW.session_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update analytics when requests change
CREATE OR REPLACE FUNCTION update_analytics_on_request_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment total and pending requests
        UPDATE event_analytics 
        SET 
            total_requests = total_requests + 1,
            pending_requests = pending_requests + 1,
            updated_at = NOW()
        WHERE session_id = NEW.session_id;
        
        -- Update unique guests count
        UPDATE event_analytics 
        SET unique_guests = (
            SELECT COUNT(DISTINCT guest_name) 
            FROM song_requests 
            WHERE session_id = NEW.session_id
        )
        WHERE session_id = NEW.session_id;
        
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            -- Decrement old status count
            IF OLD.status = 'pending' THEN
                UPDATE event_analytics 
                SET pending_requests = GREATEST(pending_requests - 1, 0)
                WHERE session_id = NEW.session_id;
            ELSIF OLD.status = 'completed' THEN
                UPDATE event_analytics 
                SET completed_requests = GREATEST(completed_requests - 1, 0)
                WHERE session_id = NEW.session_id;
            ELSIF OLD.status = 'skipped' THEN
                UPDATE event_analytics 
                SET skipped_requests = GREATEST(skipped_requests - 1, 0)
                WHERE session_id = NEW.session_id;
            END IF;
            
            -- Increment new status count
            IF NEW.status = 'completed' THEN
                UPDATE event_analytics 
                SET completed_requests = completed_requests + 1
                WHERE session_id = NEW.session_id;
            ELSIF NEW.status = 'skipped' THEN
                UPDATE event_analytics 
                SET skipped_requests = skipped_requests + 1
                WHERE session_id = NEW.session_id;
            END IF;
            
            -- Update timestamp
            UPDATE event_analytics 
            SET updated_at = NOW()
            WHERE session_id = NEW.session_id;
        END IF;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement total requests
        UPDATE event_analytics 
        SET 
            total_requests = GREATEST(total_requests - 1, 0),
            updated_at = NOW()
        WHERE session_id = OLD.session_id;
        
        -- Decrement status-specific count
        IF OLD.status = 'pending' THEN
            UPDATE event_analytics 
            SET pending_requests = GREATEST(pending_requests - 1, 0)
            WHERE session_id = OLD.session_id;
        ELSIF OLD.status = 'completed' THEN
            UPDATE event_analytics 
            SET completed_requests = GREATEST(completed_requests - 1, 0)
            WHERE session_id = OLD.session_id;
        ELSIF OLD.status = 'skipped' THEN
            UPDATE event_analytics 
            SET skipped_requests = GREATEST(skipped_requests - 1, 0)
            WHERE session_id = OLD.session_id;
        END IF;
        
        -- Update unique guests count
        UPDATE event_analytics 
        SET unique_guests = (
            SELECT COUNT(DISTINCT guest_name) 
            FROM song_requests 
            WHERE session_id = OLD.session_id
        )
        WHERE session_id = OLD.session_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CREATE TRIGGERS
-- ============================================================================

-- Trigger to update updated_at column
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_song_requests_updated_at 
    BEFORE UPDATE ON song_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dj_profiles_updated_at 
    BEFORE UPDATE ON dj_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_analytics_updated_at 
    BEFORE UPDATE ON event_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create related records when event is created
CREATE TRIGGER create_event_related_records_trigger
    AFTER INSERT ON events
    FOR EACH ROW EXECUTE FUNCTION create_event_related_records();

-- Trigger to update analytics when requests change
CREATE TRIGGER update_analytics_on_request_change_trigger
    AFTER INSERT OR UPDATE OR DELETE ON song_requests
    FOR EACH ROW EXECUTE FUNCTION update_analytics_on_request_change();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dj_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES
-- ============================================================================

-- Events table policies
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create events" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update events" ON events
    FOR UPDATE USING (true);

-- Song requests table policies
CREATE POLICY "Anyone can insert requests" ON song_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view requests" ON song_requests
    FOR SELECT USING (true);

CREATE POLICY "Anyone can update requests" ON song_requests
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete requests" ON song_requests
    FOR DELETE USING (true);

-- Event settings table policies
CREATE POLICY "Anyone can view settings" ON event_settings
    FOR SELECT USING (true);

CREATE POLICY "Anyone can manage settings" ON event_settings
    FOR ALL USING (true);

-- Guest sessions table policies
CREATE POLICY "Anyone can insert guest sessions" ON guest_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view guest sessions" ON guest_sessions
    FOR SELECT USING (true);

-- DJ profiles table policies
CREATE POLICY "Anyone can view profiles" ON dj_profiles
    FOR SELECT USING (true);

CREATE POLICY "Anyone can manage profiles" ON dj_profiles
    FOR ALL USING (true);

-- Event analytics table policies
CREATE POLICY "Anyone can view analytics" ON event_analytics
    FOR SELECT USING (true);

CREATE POLICY "Anyone can update analytics" ON event_analytics
    FOR UPDATE USING (true);

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- Insert a sample event for testing
INSERT INTO events (session_id, event_name, event_date, event_location, dj_name, event_type) 
VALUES ('DEMO-20240615-ABC', 'Demo Event', '2024-06-15', 'Demo Location', 'Area22', 'demo');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('events', 'song_requests', 'event_settings', 'guest_sessions', 'dj_profiles', 'event_analytics')
ORDER BY table_name;

-- Check if indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('events', 'song_requests', 'event_settings', 'guest_sessions', 'dj_profiles', 'event_analytics')
ORDER BY tablename, indexname;

-- Check if functions were created
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('update_updated_at_column', 'create_event_related_records', 'update_analytics_on_request_change')
ORDER BY routine_name;

-- Check if triggers were created
SELECT trigger_name, event_object_table, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('events', 'song_requests', 'event_settings', 'guest_sessions', 'dj_profiles', 'event_analytics')
ORDER BY tablename;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
