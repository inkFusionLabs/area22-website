// Area22 Music Request System - Supabase Backend Configuration
// This file contains all the backend configuration, database schema, and security policies

// Supabase Configuration
const SUPABASE_URL = 'https://vwiiwxbncaojngpdtrql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3aWl3eGJuY2Fvam5ncGR0cnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTMyMzksImV4cCI6MjA3MTE4OTIzOX0.oGer_s1Uft2wZTpCgc6L6XcKrjdEiSoPK8vTPU-9110';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// DATABASE SCHEMA
// ============================================================================

/*
DATABASE TABLES TO CREATE IN SUPABASE:

1. events (Main event management)
   - id: uuid (primary key)
   - session_id: text (unique, not null)
   - event_name: text (not null)
   - event_date: date (not null)
   - event_location: text
   - dj_name: text
   - event_type: text (wedding, birthday, corporate, etc.)
   - status: text (active, completed, cancelled)
   - max_requests: integer (default: 100)
   - created_at: timestamp (default: now())
   - updated_at: timestamp (default: now())
   - created_by: uuid (references auth.users)

2. song_requests (Song request management)
   - id: uuid (primary key)
   - session_id: text (not null, references events.session_id)
   - song_title: text (not null)
   - artist_name: text (not null)
   - guest_name: text (default: 'Anonymous')
   - guest_email: text
   - note: text
   - priority: text (default: 'normal', check: 'low', 'normal', 'high', 'urgent')
   - status: text (default: 'pending', check: 'pending', 'playing', 'completed', 'skipped')
   - created_at: timestamp (default: now())
   - updated_at: timestamp (default: now())
   - played_at: timestamp
   - dj_notes: text

3. event_settings (Event configuration)
   - id: uuid (primary key)
   - session_id: text (not null, references events.session_id)
   - allow_anonymous: boolean (default: true)
   - require_approval: boolean (default: false)
   - max_requests_per_guest: integer (default: 5)
   - auto_approve_priority: text (default: 'normal')
   - custom_message: text
   - theme_color: text (default: '#00ff00')
   - created_at: timestamp (default: now())

4. guest_sessions (Guest tracking)
   - id: uuid (primary key)
   - session_id: text (not null, references events.session_id)
   - guest_name: text (not null)
   - guest_email: text
   - device_id: text
   - ip_address: inet
   - first_visit: timestamp (default: now())
   - last_visit: timestamp (default: now())
   - total_requests: integer (default: 0)
   - is_blocked: boolean (default: false)

5. dj_profiles (DJ management)
   - id: uuid (primary key)
   - user_id: uuid (references auth.users)
   - dj_name: text (not null)
   - bio: text
   - profile_image: text
   - contact_email: text
   - phone: text
   - is_verified: boolean (default: false)
   - created_at: timestamp (default: now())
   - updated_at: timestamp (default: now())

6. event_analytics (Event statistics)
   - id: uuid (primary key)
   - session_id: text (not null, references events.session_id)
   - total_requests: integer (default: 0)
   - pending_requests: integer (default: 0)
   - completed_requests: integer (default: 0)
   - skipped_requests: integer (default: 0)
   - unique_guests: integer (default: 0)
   - peak_hour: integer
   - most_requested_genre: text
   - created_at: timestamp (default: now())
   - updated_at: timestamp (default: now())
*/

// ============================================================================
// DATABASE FUNCTIONS
// ============================================================================

// Event Management Functions
const EventService = {
    // Create a new event
    async createEvent(eventData) {
        try {
            const { data, error } = await supabase
                .from('events')
                .insert([{
                    session_id: eventData.session_id,
                    event_name: eventData.event_name,
                    event_date: eventData.event_date,
                    event_location: eventData.event_location,
                    dj_name: eventData.dj_name,
                    event_type: eventData.event_type || 'general',
                    status: 'active',
                    max_requests: eventData.max_requests || 100
                }])
                .select();

            if (error) throw error;

            // Create default event settings
            await this.createEventSettings(eventData.session_id, eventData.settings);

            // Create analytics record
            await this.createEventAnalytics(eventData.session_id);

            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating event:', error);
            return { success: false, error: error.message };
        }
    },

    // Get event by session ID
    async getEventBySessionId(sessionId) {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('session_id', sessionId)
                .eq('status', 'active')
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting event:', error);
            return { success: false, error: error.message };
        }
    },

    // Get all events for a DJ
    async getEventsByDJ(djName) {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('dj_name', djName)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting DJ events:', error);
            return { success: false, error: error.message };
        }
    },

    // Update event status
    async updateEventStatus(sessionId, status) {
        try {
            const { data, error } = await supabase
                .from('events')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('session_id', sessionId)
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating event status:', error);
            return { success: false, error: error.message };
        }
    },

    // Create event settings
    async createEventSettings(sessionId, settings = {}) {
        try {
            const { error } = await supabase
                .from('event_settings')
                .insert([{
                    session_id: sessionId,
                    allow_anonymous: settings.allow_anonymous !== false,
                    require_approval: settings.require_approval || false,
                    max_requests_per_guest: settings.max_requests_per_guest || 5,
                    auto_approve_priority: settings.auto_approve_priority || 'normal',
                    custom_message: settings.custom_message || '',
                    theme_color: settings.theme_color || '#00ff00'
                }]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error creating event settings:', error);
            return { success: false, error: error.message };
        }
    },

    // Create event analytics
    async createEventAnalytics(sessionId) {
        try {
            const { error } = await supabase
                .from('event_analytics')
                .insert([{
                    session_id: sessionId,
                    total_requests: 0,
                    pending_requests: 0,
                    completed_requests: 0,
                    skipped_requests: 0,
                    unique_guests: 0
                }]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error creating event analytics:', error);
            return { success: false, error: error.message };
        }
    }
};

// Song Request Management Functions
const RequestService = {
    // Submit a new song request
    async submitRequest(requestData) {
        try {
            // Validate event exists and is active
            const eventCheck = await EventService.getEventBySessionId(requestData.session_id);
            if (!eventCheck.success) {
                throw new Error('Invalid or inactive session');
            }

            // Check guest request limits
            const guestLimitCheck = await this.checkGuestRequestLimit(
                requestData.session_id, 
                requestData.guest_name || requestData.guest_email
            );
            if (!guestLimitCheck.allowed) {
                throw new Error(`Request limit reached: ${guestLimitCheck.message}`);
            }

            // Create the request
            const { data, error } = await supabase
                .from('song_requests')
                .insert([{
                    session_id: requestData.session_id,
                    song_title: requestData.song_title,
                    artist_name: requestData.artist_name,
                    guest_name: requestData.guest_name || 'Anonymous',
                    guest_email: requestData.guest_email,
                    note: requestData.note,
                    priority: requestData.priority || 'normal',
                    status: 'pending'
                }])
                .select();

            if (error) throw error;

            // Update analytics
            await this.updateAnalytics(requestData.session_id, 'add');

            // Track guest session
            await this.trackGuestSession(requestData.session_id, requestData.guest_name, requestData.guest_email);

            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error submitting request:', error);
            return { success: false, error: error.message };
        }
    },

    // Get requests for a session
    async getRequestsBySession(sessionId, filters = {}) {
        try {
            let query = supabase
                .from('song_requests')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters.status) query = query.eq('status', filters.status);
            if (filters.priority) query = query.eq('priority', filters.priority);
            if (filters.guest_name) query = query.ilike('guest_name', `%${filters.guest_name}%`);

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting requests:', error);
            return { success: false, error: error.message };
        }
    },

    // Update request status
    async updateRequestStatus(requestId, status, djNotes = '') {
        try {
            const updateData = { 
                status, 
                updated_at: new Date().toISOString() 
            };

            if (status === 'playing') {
                updateData.played_at = new Date().toISOString();
            }

            if (djNotes) {
                updateData.dj_notes = djNotes;
            }

            const { data, error } = await supabase
                .from('song_requests')
                .update(updateData)
                .eq('id', requestId)
                .select();

            if (error) throw error;

            // Update analytics
            const request = data[0];
            await this.updateAnalytics(request.session_id, 'status_change', status);

            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating request status:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete a request
    async deleteRequest(requestId) {
        try {
            // Get request details for analytics update
            const { data: request } = await supabase
                .from('song_requests')
                .select('session_id')
                .eq('id', requestId)
                .single();

            const { error } = await supabase
                .from('song_requests')
                .delete()
                .eq('id', requestId);

            if (error) throw error;

            // Update analytics
            if (request) {
                await this.updateAnalytics(request.session_id, 'remove');
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting request:', error);
            return { success: false, error: error.message };
        }
    },

    // Check guest request limit
    async checkGuestRequestLimit(sessionId, guestIdentifier) {
        try {
            const { data, error } = await supabase
                .from('song_requests')
                .select('id')
                .eq('session_id', sessionId)
                .or(`guest_name.eq.${guestIdentifier},guest_email.eq.${guestIdentifier}`);

            if (error) throw error;

            const requestCount = data.length;
            const maxRequests = 5; // Default limit, could be configurable per event

            return {
                allowed: requestCount < maxRequests,
                current: requestCount,
                limit: maxRequests,
                message: requestCount >= maxRequests ? 
                    `You've already submitted ${requestCount} requests. Maximum allowed: ${maxRequests}` : 
                    `You can submit ${maxRequests - requestCount} more requests`
            };
        } catch (error) {
            console.error('Error checking guest limit:', error);
            return { allowed: false, message: 'Error checking request limit' };
        }
    },

    // Track guest session
    async trackGuestSession(sessionId, guestName, guestEmail) {
        try {
            const deviceId = this.generateDeviceId();
            
            // Check if guest session already exists
            const { data: existing } = await supabase
                .from('guest_sessions')
                .select('id, total_requests')
                .eq('session_id', sessionId)
                .eq('guest_name', guestName)
                .single();

            if (existing) {
                // Update existing session
                await supabase
                    .from('guest_sessions')
                    .update({
                        last_visit: new Date().toISOString(),
                        total_requests: existing.total_requests + 1
                    })
                    .eq('id', existing.id);
            } else {
                // Create new guest session
                await supabase
                    .from('guest_sessions')
                    .insert([{
                        session_id: sessionId,
                        guest_name: guestName,
                        guest_email: guestEmail,
                        device_id: deviceId,
                        total_requests: 1
                    }]);
            }
        } catch (error) {
            console.error('Error tracking guest session:', error);
        }
    },

    // Generate device ID
    generateDeviceId() {
        return 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },

    // Update analytics
    async updateAnalytics(sessionId, action, status = null) {
        try {
            let updateData = { updated_at: new Date().toISOString() };

            if (action === 'add') {
                updateData.total_requests = supabase.rpc('increment', { row_id: sessionId, column_name: 'total_requests' });
                updateData.pending_requests = supabase.rpc('increment', { row_id: sessionId, column_name: 'pending_requests' });
            } else if (action === 'remove') {
                updateData.total_requests = supabase.rpc('decrement', { row_id: sessionId, column_name: 'total_requests' });
            } else if (action === 'status_change') {
                if (status === 'completed') {
                    updateData.completed_requests = supabase.rpc('increment', { row_id: sessionId, column_name: 'completed_requests' });
                    updateData.pending_requests = supabase.rpc('decrement', { row_id: sessionId, column_name: 'pending_requests' });
                } else if (status === 'skipped') {
                    updateData.skipped_requests = supabase.rpc('increment', { row_id: sessionId, column_name: 'skipped_requests' });
                    updateData.pending_requests = supabase.rpc('decrement', { row_id: sessionId, column_name: 'pending_requests' });
                }
            }

            const { error } = await supabase
                .from('event_analytics')
                .update(updateData)
                .eq('session_id', sessionId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    }
};

// Analytics and Reporting Functions
const AnalyticsService = {
    // Get comprehensive event analytics
    async getEventAnalytics(sessionId) {
        try {
            const { data, error } = await supabase
                .from('event_analytics')
                .select('*')
                .eq('session_id', sessionId)
                .single();

            if (error) throw error;

            // Get additional stats
            const requestStats = await this.getRequestStats(sessionId);
            const guestStats = await this.getGuestStats(sessionId);
            const timeStats = await this.getTimeStats(sessionId);

            return {
                success: true,
                data: {
                    ...data,
                    ...requestStats,
                    ...guestStats,
                    ...timeStats
                }
            };
        } catch (error) {
            console.error('Error getting event analytics:', error);
            return { success: false, error: error.message };
        }
    },

    // Get request statistics
    async getRequestStats(sessionId) {
        try {
            const { data, error } = await supabase
                .from('song_requests')
                .select('priority, status, created_at')
                .eq('session_id', sessionId);

            if (error) throw error;

            const stats = {
                priority_breakdown: { low: 0, normal: 0, high: 0, urgent: 0 },
                status_breakdown: { pending: 0, playing: 0, completed: 0, skipped: 0 },
                hourly_breakdown: new Array(24).fill(0)
            };

            data.forEach(request => {
                if (stats.priority_breakdown[request.priority] !== undefined) {
                    stats.priority_breakdown[request.priority]++;
                }
                if (stats.status_breakdown[request.status] !== undefined) {
                    stats.status_breakdown[request.status]++;
                }

                const hour = new Date(request.created_at).getHours();
                stats.hourly_breakdown[hour]++;
            });

            return stats;
        } catch (error) {
            console.error('Error getting request stats:', error);
            return {};
        }
    },

    // Get guest statistics
    async getGuestStats(sessionId) {
        try {
            const { data, error } = await supabase
                .from('guest_sessions')
                .select('*')
                .eq('session_id', sessionId);

            if (error) throw error;

            return {
                unique_guests: data.length,
                total_guest_requests: data.reduce((sum, guest) => sum + guest.total_requests, 0),
                average_requests_per_guest: data.length > 0 ? 
                    (data.reduce((sum, guest) => sum + guest.total_requests, 0) / data.length).toFixed(2) : 0
            };
        } catch (error) {
            console.error('Error getting guest stats:', error);
            return {};
        }
    },

    // Get time-based statistics
    async getTimeStats(sessionId) {
        try {
            const { data, error } = await supabase
                .from('song_requests')
                .select('created_at, status')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data.length === 0) return {};

            const firstRequest = new Date(data[0].created_at);
            const lastRequest = new Date(data[data.length - 1].created_at);
            const eventDuration = (lastRequest - firstRequest) / (1000 * 60 * 60); // hours

            return {
                event_start: firstRequest,
                event_end: lastRequest,
                event_duration_hours: eventDuration.toFixed(2),
                requests_per_hour: eventDuration > 0 ? (data.length / eventDuration).toFixed(2) : 0
            };
        } catch (error) {
            console.error('Error getting time stats:', error);
            return {};
        }
    }
};

// ============================================================================
// SECURITY POLICIES (TO SET IN SUPABASE DASHBOARD)
// ============================================================================

/*
ROW LEVEL SECURITY (RLS) POLICIES:

1. events table:
   - Enable RLS
   - Policy: "Anyone can view active events"
     - Operation: SELECT
     - Using: status = 'active'
   - Policy: "Authenticated users can create events"
     - Operation: INSERT
     - Using: auth.role() = 'authenticated'
   - Policy: "Event creators can update their events"
     - Operation: UPDATE
     - Using: created_by = auth.uid()

2. song_requests table:
   - Enable RLS
   - Policy: "Anyone can insert requests for active events"
     - Operation: INSERT
     - Using: EXISTS (SELECT 1 FROM events WHERE session_id = song_requests.session_id AND status = 'active')
   - Policy: "Anyone can view requests for active events"
     - Operation: SELECT
     - Using: EXISTS (SELECT 1 FROM events WHERE session_id = song_requests.session_id AND status = 'active')
   - Policy: "Authenticated users can update/delete requests"
     - Operation: UPDATE, DELETE
     - Using: auth.role() = 'authenticated'

3. event_settings table:
   - Enable RLS
   - Policy: "Anyone can view settings for active events"
     - Operation: SELECT
     - Using: EXISTS (SELECT 1 FROM events WHERE session_id = event_settings.session_id AND status = 'active')
   - Policy: "Authenticated users can manage settings"
     - Operation: INSERT, UPDATE, DELETE
     - Using: auth.role() = 'authenticated'

4. guest_sessions table:
   - Enable RLS
   - Policy: "Anyone can insert guest sessions"
     - Operation: INSERT
     - Using: true
   - Policy: "Authenticated users can view all guest sessions"
     - Operation: SELECT
     - Using: auth.role() = 'authenticated'

5. event_analytics table:
   - Enable RLS
   - Policy: "Anyone can view analytics for active events"
     - Operation: SELECT
     - Using: EXISTS (SELECT 1 FROM events WHERE session_id = event_analytics.session_id AND status = 'active')
   - Policy: "System can update analytics"
     - Operation: UPDATE
     - Using: true
*/

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

const RealtimeService = {
    // Subscribe to song request changes
    subscribeToRequests(sessionId, callback) {
        return supabase
            .channel(`requests_${sessionId}`)
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'song_requests',
                    filter: `session_id=eq.${sessionId}`
                }, 
                callback
            )
            .subscribe();
    },

    // Subscribe to event updates
    subscribeToEvent(sessionId, callback) {
        return supabase
            .channel(`event_${sessionId}`)
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'events',
                    filter: `session_id=eq.${sessionId}`
                }, 
                callback
            )
            .subscribe();
    },

    // Subscribe to analytics updates
    subscribeToAnalytics(sessionId, callback) {
        return supabase
            .channel(`analytics_${sessionId}`)
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'event_analytics',
                    filter: `session_id=eq.${sessionId}`
                }, 
                callback
            )
            .subscribe();
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const Utils = {
    // Generate unique session ID
    generateSessionId(eventName, date) {
        const dateStr = date.replace(/-/g, '');
        const eventCode = eventName.replace(/[^A-Z]/g, '').substring(0, 3) || 'EVT';
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${eventCode}-${dateStr}-${random}`;
    },

    // Validate session ID format
    validateSessionId(sessionId) {
        const pattern = /^[A-Z]{3}-\d{8}-[A-Z0-9]{3}$/;
        return pattern.test(sessionId);
    },

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return 'Date TBD';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            return dateString;
        }
    },

    // Generate QR code URL
    generateQRUrl(sessionId) {
        return `${window.location.origin}/music-request.html?session=${sessionId}`;
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
    supabase,
    EventService,
    RequestService,
    AnalyticsService,
    RealtimeService,
    Utils
};

// For non-module environments, attach to window
if (typeof window !== 'undefined') {
    window.Area22Backend = {
        supabase,
        EventService,
        RequestService,
        AnalyticsService,
        RealtimeService,
        Utils
    };
}
