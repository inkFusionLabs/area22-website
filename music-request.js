// Music Request System for Area22
class MusicRequestSystem {
    constructor() {
        this.currentEvent = null;
        this.requests = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeEvent();
        this.generateQRCode();
        this.loadSampleData();
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('song-request-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    }

    // Generate QR code for the music request page
    generateQRCode() {
        const qrContainer = document.getElementById('qr-code');
        if (!qrContainer) return;

        // Create QR code using a simple canvas-based approach
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        // Generate a simple QR-like pattern (for demo purposes)
        // In production, you'd use a proper QR library like qrcode.js
        this.generateSimpleQR(ctx, window.location.href);

        qrContainer.appendChild(canvas);
    }

    // Simple QR code generation (demo version)
    generateSimpleQR(ctx, url) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 200, 200);
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(20, 20, 160, 160);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(40, 40, 120, 120);
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(60, 60, 80, 80);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(80, 80, 40, 40);
        
        // Add some pattern elements
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(20 + i * 20, 20 + j * 20, 20, 20);
                }
            }
        }
    }

    // Initialize the system with default event info
    initializeEvent() {
        this.currentEvent = {
            code: 'EVENT',
            name: 'Area22 Event',
            dj: 'Area22',
            status: 'active'
        };
        
        // Update event info display
        const eventNameElement = document.getElementById('current-event-name');
        if (eventNameElement) {
            eventNameElement.textContent = this.currentEvent.name;
        }
    }

    // Handle song request form submission
    handleFormSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const request = {
            id: Date.now(),
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
        
        // Simulate sending to DJ (in production, this would be a real API call)
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

    // Simulate sending request to DJ
    sendToDJ(request) {
        console.log('Sending to DJ:', request);
        
        // In production, this would be:
        // - WebSocket connection for real-time updates
        // - API call to your backend
        // - Push notification to DJ's device
        
        // Simulate DJ response after a delay
        setTimeout(() => {
            request.status = 'received';
            this.updateRequestsList();
        }, 2000);
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
