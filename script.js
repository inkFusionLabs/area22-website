// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
            });
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

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Laser light effects
document.addEventListener('DOMContentLoaded', function() {
    const laserLines = document.querySelectorAll('.laser-line');
    
    // Add mouse movement effect to laser lines
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        laserLines.forEach((laser, index) => {
            const rect = laser.getBoundingClientRect();
            const laserCenterX = rect.left + rect.width / 2;
            const laserCenterY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(e.clientX - laserCenterX, 2) + 
                Math.pow(e.clientY - laserCenterY, 2)
            );
            
            if (distance < 300) {
                const intensity = 1 + (300 - distance) / 300;
                laser.style.opacity = intensity;
                laser.style.boxShadow = `
                    0 0 ${10 * intensity}px var(--primary-green),
                    0 0 ${20 * intensity}px var(--primary-green),
                    0 0 ${30 * intensity}px rgba(0, 255, 0, 0.5)
                `;
            } else {
                laser.style.opacity = 0.8;
                laser.style.boxShadow = `
                    0 0 10px var(--primary-green),
                    0 0 20px var(--primary-green),
                    0 0 30px rgba(0, 255, 0, 0.5)
                `;
            }
        });
    });
    
    // Add click effect to laser lines
    laserLines.forEach(laser => {
        laser.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(2)';
            this.style.opacity = '1';
            
            setTimeout(() => {
                this.style.animation = 'laserMove 8s linear infinite';
                this.style.transform = 'scale(1)';
            }, 1000);
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



// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        opacity: 0;
        transition: opacity 0.5s ease;
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



