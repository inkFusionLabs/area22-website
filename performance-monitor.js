// Performance Monitor for Area22 Website
// Tracks Core Web Vitals and performance metrics

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fcp: null, // First Contentful Paint
            lcp: null, // Largest Contentful Paint
            fid: null, // First Input Delay
            cls: null, // Cumulative Layout Shift
            ttfb: null, // Time to First Byte
            fmp: null, // First Meaningful Paint
            tti: null, // Time to Interactive
            tbt: null  // Total Blocking Time
        };
        
        this.observers = [];
        this.init();
    }

    init() {
        console.log('Initializing performance monitor...');
        this.setupObservers();
        this.trackCoreWebVitals();
        this.trackCustomMetrics();
        this.setupReporting();
    }

    // Setup performance observers
    setupObservers() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                this.reportMetric('LCP', this.metrics.lcp);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    this.reportMetric('FID', this.metrics.fid);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cls = clsValue;
                this.reportMetric('CLS', this.metrics.cls);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            this.observers.push(lcpObserver, fidObserver, clsObserver);
        }
    }

    // Track Core Web Vitals
    trackCoreWebVitals() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const fcp = entries[0];
                this.metrics.fcp = fcp.startTime;
                this.reportMetric('FCP', this.metrics.fcp);
            });
            fcpObserver.observe({ entryTypes: ['paint'] });
            this.observers.push(fcpObserver);
        }

        // Time to First Byte
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
            this.reportMetric('TTFB', this.metrics.ttfb);
        }
    }

    // Track custom metrics
    trackCustomMetrics() {
        // Image loading performance
        this.trackImagePerformance();
        
        // JavaScript execution time
        this.trackJavaScriptPerformance();
        
        // CSS loading time
        this.trackCSSPerformance();
        
        // Resource loading
        this.trackResourceLoading();
    }

    // Track image loading performance
    trackImagePerformance() {
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        const totalImages = images.length;

        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    this.reportMetric('ImagesLoaded', (loadedImages / totalImages) * 100);
                });
            }
        });
    }

    // Track JavaScript performance
    trackJavaScriptPerformance() {
        const scriptLoadStart = performance.now();
        
        window.addEventListener('load', () => {
            const scriptLoadTime = performance.now() - scriptLoadStart;
            this.reportMetric('ScriptLoadTime', scriptLoadTime);
        });
    }

    // Track CSS performance
    trackCSSPerformance() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        let loadedCSS = 0;
        const totalCSS = stylesheets.length;

        stylesheets.forEach(link => {
            if (link.sheet) {
                loadedCSS++;
            } else {
                link.addEventListener('load', () => {
                    loadedCSS++;
                    this.reportMetric('CSSLoaded', (loadedCSS / totalCSS) * 100);
                });
            }
        });
    }

    // Track resource loading
    trackResourceLoading() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.initiatorType === 'img') {
                        this.reportMetric('ImageLoadTime', entry.duration);
                    } else if (entry.initiatorType === 'css') {
                        this.reportMetric('CSSLoadTime', entry.duration);
                    } else if (entry.initiatorType === 'script') {
                        this.reportMetric('ScriptLoadTime', entry.duration);
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.push(resourceObserver);
        }
    }

    // Report metric
    reportMetric(name, value) {
        console.log(`Performance Metric - ${name}: ${value}`);
        
        // Store in localStorage for analysis
        const metrics = JSON.parse(localStorage.getItem('area22_performance_metrics') || '{}');
        metrics[name] = {
            value: value,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        localStorage.setItem('area22_performance_metrics', JSON.stringify(metrics));

        // Send to analytics (if configured)
        this.sendToAnalytics(name, value);
    }

    // Send metrics to analytics
    sendToAnalytics(name, value) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                metric_name: name,
                metric_value: value,
                page_url: window.location.href
            });
        }

        // Custom analytics endpoint
        this.sendToCustomEndpoint(name, value);
    }

    // Send to custom analytics endpoint
    sendToCustomEndpoint(name, value) {
        const data = {
            metric: name,
            value: value,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };

        // Send via beacon API for better performance
        if ('sendBeacon' in navigator) {
            navigator.sendBeacon('/api/analytics', JSON.stringify(data));
        }
    }

    // Setup reporting
    setupReporting() {
        // Report metrics on page unload
        window.addEventListener('beforeunload', () => {
            this.reportFinalMetrics();
        });

        // Periodic reporting
        setInterval(() => {
            this.reportPeriodicMetrics();
        }, 30000); // Every 30 seconds
    }

    // Report final metrics
    reportFinalMetrics() {
        const sessionDuration = performance.now();
        this.reportMetric('SessionDuration', sessionDuration);
        
        // Report all collected metrics
        Object.entries(this.metrics).forEach(([name, value]) => {
            if (value !== null) {
                this.reportMetric(name, value);
            }
        });
    }

    // Report periodic metrics
    reportPeriodicMetrics() {
        const memory = performance.memory;
        if (memory) {
            this.reportMetric('MemoryUsage', memory.usedJSHeapSize);
            this.reportMetric('MemoryLimit', memory.jsHeapSizeLimit);
        }
    }

    // Get performance score
    getPerformanceScore() {
        let score = 100;
        
        // LCP scoring
        if (this.metrics.lcp) {
            if (this.metrics.lcp > 4000) score -= 30;
            else if (this.metrics.lcp > 2500) score -= 15;
        }
        
        // FID scoring
        if (this.metrics.fid) {
            if (this.metrics.fid > 300) score -= 30;
            else if (this.metrics.fid > 100) score -= 15;
        }
        
        // CLS scoring
        if (this.metrics.cls) {
            if (this.metrics.cls > 0.25) score -= 30;
            else if (this.metrics.cls > 0.1) score -= 15;
        }
        
        return Math.max(0, score);
    }

    // Get performance report
    getPerformanceReport() {
        return {
            metrics: this.metrics,
            score: this.getPerformanceScore(),
            recommendations: this.getRecommendations(),
            timestamp: new Date().toISOString()
        };
    }

    // Get performance recommendations
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.lcp && this.metrics.lcp > 2500) {
            recommendations.push('Optimize Largest Contentful Paint by compressing images and using WebP format');
        }
        
        if (this.metrics.fid && this.metrics.fid > 100) {
            recommendations.push('Reduce First Input Delay by minimizing JavaScript execution time');
        }
        
        if (this.metrics.cls && this.metrics.cls > 0.1) {
            recommendations.push('Fix Cumulative Layout Shift by setting explicit dimensions for images and ads');
        }
        
        if (this.metrics.ttfb && this.metrics.ttfb > 600) {
            recommendations.push('Improve Time to First Byte by optimizing server response time');
        }
        
        return recommendations;
    }

    // Cleanup observers
    cleanup() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
    }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
} else {
    window.PerformanceMonitor = PerformanceMonitor;
    window.performanceMonitor = performanceMonitor;
}

console.log('Performance monitor initialized'); 