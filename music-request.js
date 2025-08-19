// Music Request System for Area22
class MusicRequestSystem {
    constructor() {
        this.currentEvent = null;
        this.requests = [];
        this.sessions = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeDefaultEvent();
        this.generateQRCode();
        this.loadRequestsFromSupabase();
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('song-request-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Session ID input validation
        const sessionInput = document.getElementById('session-id');
        if (sessionInput) {
            sessionInput.addEventListener('input', (e) => this.onSessionIdInput(e));
            sessionInput.addEventListener('blur', (e) => this.validateSessionId(e));
        }
    }

    // Handle session ID input
    onSessionIdInput(event) {
        const sessionId = event.target.value.toUpperCase();
        event.target.value = sessionId; // Force uppercase
        
        // Update current event with session ID
        if (sessionId && sessionId.length >= 10) { // Minimum session ID length
            this.currentEvent = {
                session_id: sessionId,
                event_name: 'Event Session',
                event_date: new Date().toISOString().split('T')[0],
                event_location: 'Location TBD'
            };
            this.updateEventInfo();
        }
    }

    // Validate session ID format
    validateSessionId(event) {
        const sessionId = event.target.value;
        const sessionIdPattern = /^[A-Z]{3}-\d{8}-[A-Z0-9]{3}$/;
        
        if (sessionId && !sessionIdPattern.test(sessionId)) {
            event.target.style.borderColor = '#ff4444';
            event.target.title = 'Invalid session ID format. Expected: XXX-YYYYMMDD-XXX';
        } else {
            event.target.style.borderColor = 'rgba(0, 255, 0, 0.5)';
            event.target.title = '';
        }
    }

    // Generate QR code for the music request page
    generateQRCode() {
        const qrContainer = document.getElementById('qr-code');
        if (!qrContainer) return;

        // Use the QRCode library to generate a proper QR code
        const currentUrl = window.location.href;
        
        // Update the QR URL display
        const qrUrlElement = document.getElementById('qr-url');
        if (qrUrlElement) {
            qrUrlElement.textContent = currentUrl;
        }
        
        QRCode.toCanvas(qrContainer, currentUrl, {
            width: 200,
            height: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#00ff00'
            }
        }, function (error) {
            if (error) {
                console.error('Error generating QR code:', error);
                // Fallback to simple text display
                qrContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p style="color: #00ff00; font-size: 14px;">QR Code</p>
                        <p style="color: #fff; font-size: 12px; word-break: break-all;">${currentUrl}</p>
                    </div>
                `;
            }
        });
    }





    // Update event info display
    updateEventInfo() {
        if (!this.currentEvent) return;

        const eventNameElement = document.getElementById('current-event-name');
        if (eventNameElement) {
            eventNameElement.textContent = this.currentEvent.event_name;
        }

        // Update DJ name if available
        const djNameElement = document.getElementById('current-dj-name');
        if (djNameElement) {
            djNameElement.textContent = 'Area22';
        }
    }

    // Initialize default event if no sessions exist
    initializeDefaultEvent() {
        this.currentEvent = {
            session_id: 'DEFAULT-' + Date.now(),
            event_name: 'Area22 Event',
            event_date: new Date().toISOString().split('T')[0],
            event_location: 'Basingstoke Area'
        };
        this.updateEventInfo();
    }

    // Handle song request form submission
    handleFormSubmission(e) {
        e.preventDefault();
        
        // Check if session ID is entered
        const sessionInput = document.getElementById('session-id');
        if (!sessionInput.value) {
            alert('Please enter a Session ID first!');
            return;
        }

        // Validate session ID format
        const sessionIdPattern = /^[A-Z]{3}-\d{8}-[A-Z0-9]{3}$/;
        if (!sessionIdPattern.test(sessionInput.value)) {
            alert('Please enter a valid Session ID format: XXX-YYYYMMDD-XXX');
            sessionInput.focus();
            return;
        }

        const formData = new FormData(e.target);
        const request = {
            id: Date.now(),
            session_id: sessionInput.value,
            songTitle: formData.get('song-title'),
            artistName: formData.get('artist-name'),
            guestName: formData.get('guest-name') || 'Anonymous',
            note: formData.get('request-note') || '',
            priority: formData.get('priority-level'),
            timestamp: new Date().toLocaleTimeString(),
            status: 'pending'
        };

        // Add to requests list
        this.requests.unshift(request);
        
        // Update display
        this.updateRequestsList();
        
        // Show success modal
        this.showSuccessModal(request);
        
        // Reset form
        e.target.reset();
        
        // Send to DJ via Supabase
        this.sendToDJ(request);
    }

    // Update the requests list display
    updateRequestsList() {
        const requestsList = document.getElementById('requests-list');
        if (!requestsList) return;

        if (this.requests.length === 0) {
            requestsList.innerHTML = `
                <div class="no-requests">
                    <p>No requests yet. Be the first to request a song!</p>
                </div>
            `;
            return;
        }

        requestsList.innerHTML = this.requests.map(request => `
            <div class="request-item priority-${request.priority}">
                <div class="request-header">
                    <h4>${request.songTitle}</h4>
                    <span class="priority-badge ${request.priority}">${request.priority}</span>
                </div>
                <p class="artist">by ${request.artistName}</p>
                <p class="guest">Requested by: ${request.guestName}</p>
                ${request.note ? `<p class="note">Note: ${request.note}</p>` : ''}
                <div class="request-meta">
                    <span class="time">${request.timestamp}</span>
                    <span class="status">${request.status}</span>
                </div>
            </div>
        `).join('');
    }

    // Show success modal
    showSuccessModal(request) {
        const modal = document.getElementById('success-modal');
        const details = document.getElementById('request-details');
        
        if (modal && details) {
            details.innerHTML = `
                <div class="request-summary">
                    <p><strong>Song:</strong> ${request.songTitle}</p>
                    <p><strong>Artist:</strong> ${request.artistName}</p>
                    <p><strong>Priority:</strong> ${request.priority}</p>
                    ${request.note ? `<p><strong>Note:</strong> ${request.note}</p>` : ''}
                </div>
            `;
            
            modal.style.display = 'block';
        }
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Send request to DJ via Supabase
    async sendToDJ(request) {
        try {
            // Get current session info
            const currentSession = this.sessions.find(s => s.session_id === request.session_id);
            
            // Insert request into Supabase
            const { data, error } = await supabase
                .from('song_requests')
                .insert([
                    {
                        session_id: request.session_id,
                        event_name: currentSession ? currentSession.event_name : 'Unknown Event',
                        event_date: currentSession ? currentSession.event_date : new Date().toISOString().split('T')[0],
                        event_location: currentSession ? currentSession.event_location : 'Location TBD',
                        song_title: request.songTitle,
                        artist_name: request.artistName,
                        guest_name: request.guestName,
                        note: request.note,
                        priority: request.priority,
                        status: 'pending'
                    }
                ])
                .select();

            if (error) {
                throw error;
            }

            if (data && data.length > 0) {
                const savedRequest = data[0];
                request.id = savedRequest.id;
                request.status = savedRequest.status;
                this.updateRequestsList();
                this.showNotification('Request sent successfully! DJ will see it soon.', 'success');
                
                // Refresh the requests list to show the new request
                this.loadRequestsFromSupabase();
            }
        } catch (error) {
            console.error('Error sending request to Supabase:', error);
            this.showNotification('Failed to send request. Please try again.', 'error');
            // Fallback to local storage if Supabase fails
            request.status = 'pending';
            this.updateRequestsList();
        }
    }

    // Load requests from Supabase
    async loadRequestsFromSupabase() {
        try {
            // Only load requests if we have a valid session ID
            if (!this.currentEvent || !this.currentEvent.session_id) {
                this.requests = [];
                this.updateRequestsList();
                return;
            }

            const { data, error } = await supabase
                .from('song_requests')
                .select('*')
                .eq('session_id', this.currentEvent.session_id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (data) {
                // Transform Supabase data to match our format
                this.requests = data.map(item => ({
                    id: item.id,
                    songTitle: item.song_title,
                    artistName: item.artist_name,
                    guestName: item.guest_name,
                    note: item.note,
                    priority: item.priority,
                    timestamp: new Date(item.created_at).toLocaleTimeString(),
                    status: item.status
                }));
                
                this.updateRequestsList();
            }
        } catch (error) {
            console.error('Error loading requests from Supabase:', error);
            // Fallback to sample data if Supabase fails
            this.loadSampleData();
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Load sample data for demonstration
    loadSampleData() {
        // Add some sample requests for demo purposes
        this.requests = [
            {
                id: 1,
                songTitle: "Sweet Child O' Mine",
                artistName: "Guns N' Roses",
                guestName: "Mike",
                note: "For the bride and groom!",
                priority: "high",
                timestamp: "8:30 PM",
                status: "received"
            },
            {
                id: 2,
                songTitle: "Uptown Funk",
                artistName: "Mark Ronson ft. Bruno Mars",
                guestName: "Sarah",
                note: "",
                priority: "normal",
                timestamp: "8:15 PM",
                status: "pending"
            }
        ];
        
        // Update display if we're on the right page
        if (document.getElementById('requests-list')) {
            this.updateRequestsList();
        }
    }
}

// Initialize the music request system
document.addEventListener('DOMContentLoaded', () => {
    window.musicRequestSystem = new MusicRequestSystem();
});

// Global functions for HTML onclick handlers
function closeModal() {
    if (window.musicRequestSystem) {
        window.musicRequestSystem.closeModal();
    }
}

// Session management functions
function showCreateSessionModal() {
    const modal = document.getElementById('create-session-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeCreateSessionModal() {
    const modal = document.getElementById('create-session-modal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        document.getElementById('create-session-form').reset();
    }
}

async function createNewSession() {
    const form = document.getElementById('create-session-form');
    const formData = new FormData(form);
    
    const sessionData = {
        event_name: formData.get('event-name'),
        event_date: formData.get('event-date'),
        event_location: formData.get('event-location') || 'Location TBD',
        dj_name: formData.get('dj-name') || 'Area22'
    };

    if (!sessionData.event_name || !sessionData.event_date) {
        alert('Please fill in all required fields!');
        return;
    }

    try {
        // Generate unique session ID
        const sessionId = generateSessionId(sessionData.event_name, sessionData.event_date);
        
        // Create a sample request to establish the session
        const { data, error } = await supabase
            .from('song_requests')
            .insert([
                {
                    session_id: sessionId,
                    event_name: sessionData.event_name,
                    event_date: sessionData.event_date,
                    event_location: sessionData.event_location,
                    song_title: 'Session Created',
                    artist_name: 'System',
                    guest_name: 'DJ',
                    note: 'Session initialization',
                    priority: 'normal',
                    status: 'completed'
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        // Close modal and refresh sessions
        closeCreateSessionModal();
        if (window.musicRequestSystem) {
            window.musicRequestSystem.loadSessions();
        }
        
        alert('Event created successfully! You can now submit song requests.');
        
    } catch (error) {
        console.error('Error creating session:', error);
        alert('Failed to create event. Please try again.');
    }
}

// Generate unique session ID
function generateSessionId(eventName, date) {
    const dateStr = date.replace(/-/g, '');
    const eventCode = eventName.replace(/[^A-Z]/g, '').substring(0, 3) || 'EVT';
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${eventCode}-${dateStr}-${random}`;
}

// Add some CSS for notifications
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    }
    
    .notification.success {
        background: #00ff00;
        color: #000;
    }
    
    .notification.error {
        background: #ff0000;
    }
    
    .notification.info {
        background: #0088ff;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
