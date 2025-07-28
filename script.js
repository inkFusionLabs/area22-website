// Mobile Navigation
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    console.log('Hamburger element:', hamburger);
    console.log('Nav menu element:', navMenu);

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            console.log('Hamburger clicked!');
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    } else {
        console.log('Mobile navigation elements not found');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gallery Category Filtering
function initGalleryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Add fadeIn animation for gallery items
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Calendar Functionality
class BookingCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.bookedDates = this.generateBookedDates();
        this.init();
    }

    init() {
        this.renderCalendar();
        this.attachEventListeners();
    }

    generateBookedDates() {
        // Generate some random booked dates for demonstration
        const bookedDates = [];
        const currentYear = this.currentDate.getFullYear();
        const currentMonth = this.currentDate.getMonth();
        
        // Add some random booked dates in the next 3 months
        for (let i = 0; i < 15; i++) {
            const randomDate = new Date(currentYear, currentMonth + Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1);
            bookedDates.push(randomDate.toISOString().split('T')[0]);
        }
        
        return bookedDates;
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get last day of previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        const calendarDates = document.getElementById('calendarDates');
        calendarDates.innerHTML = '';
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dateElement = this.createDateElement(day, 'other-month');
            calendarDates.appendChild(dateElement);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isBooked = this.bookedDates.includes(dateString);
            const isToday = this.isToday(year, month, day);
            
            let className = 'calendar-date';
            if (isBooked) {
                className += ' booked';
            } else if (isToday) {
                className += ' available today';
            } else {
                className += ' available';
            }
            
            const dateElement = this.createDateElement(day, className);
            if (!isBooked) {
                dateElement.addEventListener('click', () => this.selectDate(dateString, dateElement));
            }
            calendarDates.appendChild(dateElement);
        }
        
        // Next month days to fill the grid
        const totalCells = 42; // 6 rows * 7 days
        const remainingCells = totalCells - (firstDay + daysInMonth);
        
        for (let day = 1; day <= remainingCells; day++) {
            const dateElement = this.createDateElement(day, 'other-month');
            calendarDates.appendChild(dateElement);
        }
    }

    createDateElement(day, className) {
        const element = document.createElement('div');
        element.className = className;
        element.textContent = day;
        return element;
    }

    isToday(year, month, day) {
        const today = new Date();
        return today.getFullYear() === year && 
               today.getMonth() === month && 
               today.getDate() === day;
    }

    selectDate(dateString, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-date.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selection to clicked date
        element.classList.add('selected');
        this.selectedDate = dateString;
        
        // Update the form date input
        document.getElementById('eventDate').value = dateString;
    }

    attachEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }
}

// Initialize Calendar
const calendar = new BookingCalendar();

// Form Handling
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const bookingData = Object.fromEntries(formData);
    
    // Basic validation
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.eventDate) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(bookingData.phone.replace(/\D/g, ''))) {
        alert('Please enter a valid phone number.');
        return;
    }
    
    // Simulate form submission
    showBookingConfirmation(bookingData);
    
    // Reset form
    this.reset();
    document.querySelectorAll('.calendar-date.selected').forEach(el => {
        el.classList.remove('selected');
    });
    calendar.selectedDate = null;
});

function showBookingConfirmation(bookingData) {
    // Send email notification to area-22@mail.com
    sendBookingEmail(bookingData);
    
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Booking Request Submitted!</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Thank you for your booking request, <strong>${bookingData.name}</strong>!</p>
                <p>We've received your request for <strong>${bookingData.eventType}</strong> on <strong>${bookingData.eventDate}</strong>.</p>
                <p>We'll contact you at <strong>${bookingData.email}</strong> or <strong>${bookingData.phone}</strong> within 24 hours to confirm your booking.</p>
                <p><strong>Email notification sent to: area-22@mail.co.uk</strong></p>
                <div class="booking-details">
                    <h4>Booking Details:</h4>
                    <ul>
                        <li><strong>Event Type:</strong> ${bookingData.eventType}</li>
                        <li><strong>Date:</strong> ${bookingData.eventDate}</li>
                        <li><strong>Venue:</strong> ${bookingData.venue}</li>
                        <li><strong>Duration:</strong> ${bookingData.duration} hours</li>
                        <li><strong>Package:</strong> ${bookingData.package}</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-close-btn">Close</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .booking-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #333;
        }
        
        .modal-header h3 {
            color: #00ff00;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: #00ff00;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-body {
            margin-bottom: 1.5rem;
        }
        
        .modal-body p {
            color: #cccccc;
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .booking-details {
            background: rgba(0, 255, 0, 0.1);
            border-radius: 10px;
            padding: 1rem;
            margin-top: 1rem;
        }
        
        .booking-details h4 {
            color: #00ff00;
            margin-bottom: 1rem;
        }
        
        .booking-details ul {
            list-style: none;
            margin: 0;
        }
        
        .booking-details li {
            color: #cccccc;
            margin-bottom: 0.5rem;
            padding-left: 1rem;
            position: relative;
        }
        
        .booking-details li::before {
            content: '▶';
            color: #00ff00;
            position: absolute;
            left: 0;
        }
        
        .modal-footer {
            text-align: center;
        }
        
        .modal-close-btn {
            background: #00ff00;
            color: #000000;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
        }
    `;
    
    document.head.appendChild(modalStyle);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        document.body.removeChild(modal);
        document.head.removeChild(modalStyle);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize gallery filtering
    initGalleryFilter();
    
    // Add parallax effect to disco lights
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const lights = document.querySelectorAll('.light');
        
        lights.forEach((light, index) => {
            const speed = 0.5 + (index * 0.1);
            light.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add service card animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', () => {
            // Scroll to booking section when pricing card is clicked
            document.getElementById('booking').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});

// Add today indicator to calendar
function highlightToday() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    document.querySelectorAll('.calendar-date').forEach(dateElement => {
        if (dateElement.classList.contains('today')) {
            dateElement.style.border = '2px solid #00ff00';
            dateElement.style.fontWeight = 'bold';
        }
    });
}

    // Call highlight today when calendar is rendered
    setTimeout(highlightToday, 100);
}

// Email functionality for booking confirmations
function sendBookingEmail(bookingData) {
    // Create email content
    const emailSubject = `New Booking Request - ${bookingData.eventType}`;
    const emailBody = `
New booking request received:

Customer Details:
- Name: ${bookingData.name}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}

Event Details:
- Event Type: ${bookingData.eventType}
- Date: ${bookingData.eventDate}
- Time: ${bookingData.eventTime}
- Duration: ${bookingData.duration} hours
- Number of Guests: ${bookingData.guests}
- Venue: ${bookingData.venue}

Additional Services: ${bookingData.addons || 'None selected'}

Special Requests: ${bookingData.message || 'None'}

This booking request was submitted on ${new Date().toLocaleString()}.

Please respond to the customer within 24 hours to confirm availability and pricing.
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:area-22@mail.co.uk?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    // Also log the booking data for server-side processing
    console.log('Booking data for email:', bookingData);
    
    // Optional: Send to server endpoint if available
    // sendToServer(bookingData);
}

// Function to send booking data to server (for future implementation)
function sendToServer(bookingData) {
    // This would be implemented when you have a server endpoint
    // For now, we'll just log the data
    console.log('Booking data to send to server:', bookingData);
    
    // Example server endpoint implementation:
    /*
    fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...bookingData,
            notificationEmail: 'area-22@mail.co.uk'
        })
    })
    .then(response => response.json())
    .then(data => console.log('Booking sent to server:', data))
    .catch(error => console.error('Error sending booking:', error));
    */
}

// Wedding Add-ons Functionality
function initWeddingAddons() {
    const eventTypeSelect = document.getElementById('eventType');
    const weddingAddons = document.getElementById('weddingAddons');
    
    if (eventTypeSelect && weddingAddons) {
        eventTypeSelect.addEventListener('change', function() {
            if (this.value === 'wedding') {
                weddingAddons.style.display = 'block';
                weddingAddons.style.animation = 'fadeIn 0.5s ease-in';
            } else {
                weddingAddons.style.display = 'none';
            }
        });
    }
}

// Initialize wedding add-ons when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initWeddingAddons();
});

// Calendar Integration Functions
function syncWithPersonalCalendar() {
    // Check if user has a personal calendar connected
    if (navigator.calendar) {
        navigator.calendar.requestAccess().then(granted => {
            if (granted) {
                // Sync availability with personal calendar
                syncAvailability();
            } else {
                alert('Calendar access denied. Please enable calendar access in your browser settings.');
            }
        });
    } else {
        // Fallback for browsers without calendar API
        exportAvailability();
    }
}

function syncAvailability() {
    // Get current availability from the website calendar
    const availableDates = getAvailableDates();
    
    // Create calendar events for available dates
    availableDates.forEach(date => {
        createCalendarEvent(date, 'Available - Area22 DJ Services');
    });
    
    alert('Availability synced with your personal calendar!');
}

function getAvailableDates() {
    const availableDates = [];
    const calendarDates = document.querySelectorAll('.calendar-date.available');
    
    calendarDates.forEach(dateElement => {
        const dateString = dateElement.getAttribute('data-date');
        if (dateString) {
            availableDates.push(dateString);
        }
    });
    
    return availableDates;
}

function createCalendarEvent(dateString, title) {
    const event = {
        title: title,
        start: dateString + 'T09:00:00',
        end: dateString + 'T17:00:00',
        description: 'Area22 Professional DJ Services - Available for booking',
        location: 'Basingstoke Area'
    };
    
    // Add to personal calendar
    if (navigator.calendar) {
        navigator.calendar.addEvent(event);
    }
}

function addToPersonalCalendar() {
    const selectedDate = document.getElementById('selectedDate').textContent;
    const eventTitle = 'Area22 DJ Services - Available';
    
    // Create calendar event data
    const eventData = {
        title: eventTitle,
        start: selectedDate + 'T09:00:00',
        end: selectedDate + 'T17:00:00',
        description: 'Area22 Professional DJ Services - Available for booking on this date',
        location: 'Basingstoke Area'
    };
    
    // Generate calendar links for different platforms
    const calendarLinks = generateCalendarLinks(eventData);
    
    // Show calendar options
    showCalendarOptions(calendarLinks);
}

function generateCalendarLinks(eventData) {
    const { title, start, end, description, location } = eventData;
    
    // Google Calendar
    const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start.replace(/[-:]/g, '')}/${end.replace(/[-:]/g, '')}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    // Outlook Calendar
    const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    // Apple Calendar
    const appleLink = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:${start.replace(/[-:]/g, '')}%0ADTEND:${end.replace(/[-:]/g, '')}%0ASUMMARY:${title}%0ADESCRIPTION:${description}%0ALOCATION:${location}%0AEND:VEVENT%0AEND:VCALENDAR`;
    
    return {
        google: googleLink,
        outlook: outlookLink,
        apple: appleLink
    };
}

function showCalendarOptions(calendarLinks) {
    const modal = document.createElement('div');
    modal.className = 'calendar-modal';
    modal.innerHTML = `
        <div class="calendar-modal-content">
            <h3>Add to Calendar</h3>
            <p>Choose your calendar application:</p>
            <div class="calendar-options">
                <a href="${calendarLinks.google}" target="_blank" class="btn btn-primary">
                    <i class="fab fa-google"></i> Google Calendar
                </a>
                <a href="${calendarLinks.outlook}" target="_blank" class="btn btn-secondary">
                    <i class="fab fa-microsoft"></i> Outlook
                </a>
                <a href="${calendarLinks.apple}" download="event.ics" class="btn btn-outline">
                    <i class="fab fa-apple"></i> Apple Calendar
                </a>
            </div>
            <button class="btn btn-outline" onclick="this.parentElement.parentElement.remove()">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function exportAvailability() {
    const availableDates = getAvailableDates();
    const csvContent = 'data:text/csv;charset=utf-8,Date,Status\n' + 
        availableDates.map(date => `${date},Available`).join('\n');
    
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'area22-availability.csv';
    link.click();
}

function shareEvent() {
    const selectedDate = document.getElementById('selectedDate').textContent;
    const shareText = `Check out Area22 DJ Services availability on ${selectedDate}!`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Area22 DJ Services',
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('Event details copied to clipboard!');
    }
}

// Enhanced calendar date selection
function selectDate(dateString, element) {
    // Remove previous selection
    document.querySelectorAll('.calendar-date.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked date
    element.classList.add('selected');
    
    // Show event details
    showEventDetails(dateString);
}

function showEventDetails(dateString) {
    const eventDetails = document.getElementById('calendarEventDetails');
    const selectedDateSpan = document.getElementById('selectedDate');
    const availabilityStatus = document.getElementById('availabilityStatus');
    const timeSlots = document.getElementById('timeSlots');
    
    // Format date
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    selectedDateSpan.textContent = formattedDate;
    
    // Check availability
    const isBooked = dateString in bookedDates;
    const isAvailable = !isBooked;
    
    if (isAvailable) {
        availabilityStatus.textContent = 'Available';
        availabilityStatus.style.color = '#00ff00';
        timeSlots.textContent = '9:00 AM - 5:00 PM (Flexible)';
    } else {
        availabilityStatus.textContent = 'Booked';
        availabilityStatus.style.color = '#ff0000';
        timeSlots.textContent = 'Not Available';
    }
    
    // Show the details section
    eventDetails.style.display = 'block';
    eventDetails.style.animation = 'fadeIn 0.5s ease-in';
} 