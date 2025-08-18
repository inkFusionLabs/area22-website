// Supabase Configuration for Area22 Music Request System
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table structure (you'll create this in Supabase dashboard)
/*
Table: song_requests
Columns:
- id (uuid, primary key)
- song_title (text, not null)
- artist_name (text, not null)
- guest_name (text, default: 'Anonymous')
- note (text)
- priority (text, default: 'normal')
- status (text, default: 'pending')
- created_at (timestamp, default: now())
- event_code (text, default: 'default')
*/

// Row Level Security (RLS) policies to set in Supabase dashboard:
/*
1. Enable RLS on song_requests table
2. Policy: "Anyone can insert song requests"
   - Name: "Enable insert for all users"
   - Operation: INSERT
   - Using: true

3. Policy: "Anyone can view song requests"
   - Name: "Enable select for all users"
   - Operation: SELECT
   - Using: true

4. Policy: "Only authenticated users can update/delete"
   - Name: "Enable update/delete for authenticated users"
   - Operation: UPDATE, DELETE
   - Using: auth.role() = 'authenticated'
*/

export { supabase };
