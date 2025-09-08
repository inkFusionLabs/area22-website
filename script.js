// Mobile Navigation with ARIA
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        // Ensure the menu has an id for aria-controls
        if (!navMenu.id) {
            navMenu.id = 'primary-navigation';
        }

        // Enhance hamburger as an accessible control
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-controls', navMenu.id);
        hamburger.setAttribute('aria-expanded', 'false');
        if (!hamburger.getAttribute('aria-label')) {
            hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        }

        const toggleMenu = (open) => {
            const shouldOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('active');
            hamburger.classList.toggle('active', shouldOpen);
            navMenu.classList.toggle('active', shouldOpen);
            hamburger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        };

        hamburger.addEventListener('click', function() {
            toggleMenu();
        });

        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        // Close menu on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
                hamburger.focus();
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close when clicking outside the menu on mobile
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active')) {
                const clickInside = navMenu.contains(e.target) || hamburger.contains(e.target);
                if (!clickInside) toggleMenu(false);
            }
        });
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links only (internal page navigation)
document.addEventListener('DOMContentLoaded', function() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = Math.max(0, target.offsetTop - navbarHeight - 20);
                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                    // Move focus to target for screen readers and keyboard users
                    if (typeof target.focus === 'function') {
                        target.setAttribute('tabindex', '-1');
                        target.focus({ preventScroll: true });
                    }
                }
            }
        });
    });
});



// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Observe other sections
    document.querySelectorAll('.service-card, .feature-item, .testimonial-card').forEach(card => {
        observer.observe(card);
    });
});

// Add hover effects to service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add hover effects to feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});



// Add loading animation (respect reduced motion)
const prefersReducedMotionGlobal = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        opacity: ${prefersReducedMotionGlobal ? '1' : '0'};
        ${prefersReducedMotionGlobal ? '' : 'transition: opacity 0.5s ease;'}
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(loadingStyle);



