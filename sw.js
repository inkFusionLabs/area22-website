// Service Worker for Area22 PWA
const CACHE_NAME = 'area22-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/booking.html',
    '/gallery.html',
    '/pricing.html',
    '/contact.html',
    '/admin.html',
    '/styles.css',
    '/script.js',
    '/favicon.ico',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6xpmVX3w.woff2',
    'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then(response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Get stored form data
        const formData = await getStoredFormData();
        
        if (formData.length > 0) {
            // Process stored form submissions
            for (const data of formData) {
                await submitFormData(data);
            }
            
            // Clear stored data after successful submission
            await clearStoredFormData();
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Store form data when offline
async function storeFormData(formData) {
    try {
        const storedData = await getStoredFormData();
        storedData.push(formData);
        localStorage.setItem('area22-offline-forms', JSON.stringify(storedData));
    } catch (error) {
        console.error('Failed to store form data:', error);
    }
}

// Get stored form data
async function getStoredFormData() {
    try {
        const data = localStorage.getItem('area22-offline-forms');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get stored form data:', error);
        return [];
    }
}

// Clear stored form data
async function clearStoredFormData() {
    try {
        localStorage.removeItem('area22-offline-forms');
    } catch (error) {
        console.error('Failed to clear stored form data:', error);
    }
}

// Submit form data to server
async function submitFormData(formData) {
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
    } catch (error) {
        console.error('Failed to submit form data:', error);
        throw error;
    }
}

// Push notifications (for future use)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New booking request received!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Booking',
                icon: '/favicon.ico'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/favicon.ico'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Area22 Booking', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/admin.html')
        );
    }
});

// Handle client messages
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'STORE_FORM_DATA') {
        storeFormData(event.data.formData);
    }
}); 