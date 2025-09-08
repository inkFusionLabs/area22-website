// Accessibility Features for Area22 Website
// Handles progress bars, dark mode, and font size controls

class AccessibilityManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.isDarkMode = false;
        this.currentFontSize = 'medium';
        this.init();
    }

    init() {
        console.log('Initializing accessibility features...');
        this.setupProgressBar();
        this.setupAccessibilityControls();
        this.loadUserPreferences();
    }

    // Progress Bar Management
    setupProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const steps = document.querySelectorAll('.step');
        
        if (progressFill && steps.length > 0) {
            this.updateProgress();
            
            // Monitor form completion
            this.monitorFormProgress();
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const steps = document.querySelectorAll('.step');
        
        if (progressFill) {
            const progress = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Update step indicators
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    monitorFormProgress() {
        const form = document.getElementById('bookingForm');
        if (!form) return;

        const formFields = form.querySelectorAll('input, select, textarea');
        
        formFields.forEach(field => {
            field.addEventListener('change', () => {
                this.checkFormCompletion();
            });
            
            field.addEventListener('input', () => {
                this.checkFormCompletion();
            });
        });
    }

    checkFormCompletion() {
        const form = document.getElementById('bookingForm');
        if (!form) return;

        const requiredFields = form.querySelectorAll('[required]');
        let completedFields = 0;
        let totalRequired = requiredFields.length;

        requiredFields.forEach(field => {
            if (field.value.trim() !== '') {
                completedFields++;
            }
        });

        // Calculate progress based on form completion
        const completionPercentage = totalRequired > 0 ? (completedFields / totalRequired) * 100 : 0;
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${completionPercentage}%`;
        }

        // Update step based on completion
        if (completionPercentage >= 100) {
            this.currentStep = 4; // Confirmation step
        } else if (completionPercentage >= 75) {
            this.currentStep = 3; // Package selection
        } else if (completionPercentage >= 50) {
            this.currentStep = 2; // Contact info
        } else {
            this.currentStep = 1; // Event details
        }

        this.updateProgress();
    }

    // Accessibility Controls
    setupAccessibilityControls() {
        const toggle = document.getElementById('accessibilityToggle');
        const controls = document.getElementById('fontSizeControls');
        const darkModeToggle = document.getElementById('darkModeToggle');
        const fontButtons = document.querySelectorAll('.font-size-btn[data-size]');

        if (toggle && controls) {
            toggle.addEventListener('click', () => {
                controls.style.display = controls.style.display === 'none' ? 'flex' : 'none';
                toggle.classList.toggle('active');
            });
        }

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        fontButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.dataset.size;
                this.changeFontSize(size);
                
                // Update active button
                fontButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Close controls when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !controls.contains(e.target)) {
                controls.style.display = 'none';
                toggle.classList.remove('active');
            }
        });
    }

    // Dark Mode Toggle
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.textContent = this.isDarkMode ? 'Light Mode' : 'Dark Mode';
        }

        // Save preference
        localStorage.setItem('area22_dark_mode', this.isDarkMode);
        
        // Show feedback
        this.showToast(this.isDarkMode ? 'Dark mode enabled' : 'Light mode enabled', 'success');
    }

    // Font Size Controls
    changeFontSize(size) {
        // Remove existing font size classes
        document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
        
        // Add new font size class
        if (size !== 'medium') {
            document.body.classList.add(`font-size-${size}`);
        }
        
        this.currentFontSize = size;
        localStorage.setItem('area22_font_size', size);
        
        // Show feedback
        this.showToast(`Font size changed to ${size}`, 'info');
    }

    // Load User Preferences
    loadUserPreferences() {
        // Load dark mode preference
        const savedDarkMode = localStorage.getItem('area22_dark_mode');
        if (savedDarkMode === 'true') {
            this.isDarkMode = true;
            document.body.classList.add('dark-mode');
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.textContent = 'Light Mode';
            }
        }

        // Load font size preference
        const savedFontSize = localStorage.getItem('area22_font_size');
        if (savedFontSize && savedFontSize !== 'medium') {
            this.changeFontSize(savedFontSize);
            
            // Update active button
            const fontButtons = document.querySelectorAll('.font-size-btn[data-size]');
            fontButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.size === savedFontSize) {
                    btn.classList.add('active');
                }
            });
        }
    }

    // Toast Notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        // ARIA live region and role based on type
        const isAssertive = type === 'error' || type === 'warning';
        toast.setAttribute('role', isAssertive ? 'alert' : 'status');
        toast.setAttribute('aria-live', isAssertive ? 'assertive' : 'polite');
        toast.setAttribute('aria-atomic', 'true');
        toast.setAttribute('tabindex', '-1');

        // Respect reduced motion
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00ff00;
            color: #000;
            padding: 1rem;
            border-radius: 5px;
            z-index: 10000;
            ${prefersReducedMotion ? '' : 'animation: slideInRight 0.3s ease;'}
        `;

        document.body.appendChild(toast);

        // Ensure screen readers announce immediately
        // Move focus momentarily without scrolling
        if (typeof toast.focus === 'function') {
            toast.focus({ preventScroll: true });
        }

        // Auto-dismiss after 3s
        const removeTimer = setTimeout(() => toast.remove(), 3000);

        // Allow dismiss with Escape
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                clearTimeout(removeTimer);
                toast.remove();
                document.removeEventListener('keydown', onKeyDown);
            }
        };
        document.addEventListener('keydown', onKeyDown);
    }

    // Get current progress
    getProgress() {
        return {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps,
            percentage: (this.currentStep / this.totalSteps) * 100
        };
    }

    // Reset progress
    resetProgress() {
        this.currentStep = 1;
        this.updateProgress();
    }
}

// Initialize accessibility manager
const accessibilityManager = new AccessibilityManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
} else {
    window.AccessibilityManager = AccessibilityManager;
    window.accessibilityManager = accessibilityManager;
}

console.log('Accessibility features initialized'); 