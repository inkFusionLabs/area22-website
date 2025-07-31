// Backup System for Area22 Website
// This script handles automated backups and data protection

class BackupSystem {
    constructor() {
        this.backupInterval = 24 * 60 * 60 * 1000; // 24 hours
        this.maxBackups = 30; // Keep 30 days of backups
        this.backupData = {
            bookings: [],
            contacts: [],
            settings: {},
            lastBackup: null
        };
    }

    // Initialize backup system
    init() {
        console.log('Initializing backup system...');
        this.loadBackupData();
        this.scheduleBackups();
        this.setupDataProtection();
    }

    // Load existing backup data
    loadBackupData() {
        try {
            const stored = localStorage.getItem('area22_backup_data');
            if (stored) {
                this.backupData = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading backup data:', error);
        }
    }

    // Save backup data
    saveBackupData() {
        try {
            localStorage.setItem('area22_backup_data', JSON.stringify(this.backupData));
        } catch (error) {
            console.error('Error saving backup data:', error);
        }
    }

    // Create backup
    async createBackup() {
        console.log('Creating backup...');
        
        const backup = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            data: {
                bookings: this.getBookingsData(),
                contacts: this.getContactsData(),
                settings: this.getSettingsData()
            },
            checksum: this.generateChecksum()
        };

        // Add to backup history
        this.backupData.backups = this.backupData.backups || [];
        this.backupData.backups.push(backup);

        // Clean old backups
        this.cleanOldBackups();

        // Save backup data
        this.saveBackupData();

        // Export backup file
        this.exportBackup(backup);

        console.log('Backup created successfully');
        return backup;
    }

    // Get bookings data
    getBookingsData() {
        try {
            return JSON.parse(localStorage.getItem('area22_bookings')) || [];
        } catch (error) {
            console.error('Error getting bookings data:', error);
            return [];
        }
    }

    // Get contacts data
    getContactsData() {
        try {
            return JSON.parse(localStorage.getItem('area22_contacts')) || [];
        } catch (error) {
            console.error('Error getting contacts data:', error);
            return [];
        }
    }

    // Get settings data
    getSettingsData() {
        return {
            theme: localStorage.getItem('area22_theme') || 'dark',
            notifications: localStorage.getItem('area22_notifications') || 'enabled',
            cookieConsent: localStorage.getItem('cookie-consent') || 'pending'
        };
    }

    // Generate checksum for data integrity
    generateChecksum() {
        const data = JSON.stringify(this.backupData);
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Clean old backups
    cleanOldBackups() {
        if (!this.backupData.backups) return;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.maxBackups);

        this.backupData.backups = this.backupData.backups.filter(backup => {
            return new Date(backup.timestamp) > cutoffDate;
        });
    }

    // Export backup to file
    exportBackup(backup) {
        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `area22-backup-${backup.timestamp.split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Restore from backup
    async restoreBackup(backupData) {
        console.log('Restoring from backup...');
        
        try {
            // Validate backup
            if (!this.validateBackup(backupData)) {
                throw new Error('Invalid backup data');
            }

            // Restore data
            if (backupData.data.bookings) {
                localStorage.setItem('area22_bookings', JSON.stringify(backupData.data.bookings));
            }

            if (backupData.data.contacts) {
                localStorage.setItem('area22_contacts', JSON.stringify(backupData.data.contacts));
            }

            if (backupData.data.settings) {
                Object.entries(backupData.data.settings).forEach(([key, value]) => {
                    localStorage.setItem(`area22_${key}`, value);
                });
            }

            console.log('Backup restored successfully');
            return true;
        } catch (error) {
            console.error('Error restoring backup:', error);
            return false;
        }
    }

    // Validate backup data
    validateBackup(backupData) {
        return backupData && 
               backupData.timestamp && 
               backupData.data && 
               backupData.checksum;
    }

    // Schedule automatic backups
    scheduleBackups() {
        setInterval(() => {
            this.createBackup();
        }, this.backupInterval);
    }

    // Setup data protection
    setupDataProtection() {
        // Encrypt sensitive data
        this.encryptSensitiveData();
        
        // Setup data retention policies
        this.setupRetentionPolicies();
        
        // Monitor data access
        this.monitorDataAccess();
    }

    // Encrypt sensitive data
    encryptSensitiveData() {
        // Simple encryption for demo purposes
        // In production, use proper encryption libraries
        const sensitiveFields = ['phone', 'email', 'address'];
        
        this.backupData.bookings.forEach(booking => {
            sensitiveFields.forEach(field => {
                if (booking[field]) {
                    booking[field] = this.simpleEncrypt(booking[field]);
                }
            });
        });
    }

    // Simple encryption (demo only)
    simpleEncrypt(text) {
        return btoa(text); // Base64 encoding for demo
    }

    // Setup retention policies
    setupRetentionPolicies() {
        // GDPR compliance: Delete data after retention period
        const retentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000; // 7 years
        
        setInterval(() => {
            this.cleanExpiredData(retentionPeriod);
        }, 24 * 60 * 60 * 1000); // Check daily
    }

    // Clean expired data
    cleanExpiredData(retentionPeriod) {
        const cutoffDate = new Date(Date.now() - retentionPeriod);
        
        // Clean bookings
        const bookings = this.getBookingsData();
        const filteredBookings = bookings.filter(booking => {
            return new Date(booking.date) > cutoffDate;
        });
        localStorage.setItem('area22_bookings', JSON.stringify(filteredBookings));

        // Clean contacts
        const contacts = this.getContactsData();
        const filteredContacts = contacts.filter(contact => {
            return new Date(contact.date) > cutoffDate;
        });
        localStorage.setItem('area22_contacts', JSON.stringify(filteredContacts));
    }

    // Monitor data access
    monitorDataAccess() {
        // Log data access for audit purposes
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = function(key) {
            if (key.startsWith('area22_')) {
                console.log(`Data access: ${key} accessed at ${new Date().toISOString()}`);
            }
            return originalGetItem.call(this, key);
        };
    }

    // Get backup status
    getBackupStatus() {
        return {
            lastBackup: this.backupData.lastBackup,
            totalBackups: this.backupData.backups?.length || 0,
            nextBackup: new Date(Date.now() + this.backupInterval),
            dataSize: this.calculateDataSize()
        };
    }

    // Calculate data size
    calculateDataSize() {
        const data = JSON.stringify(this.backupData);
        return new Blob([data]).size;
    }
}

// Initialize backup system
const backupSystem = new BackupSystem();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackupSystem;
} else {
    window.BackupSystem = BackupSystem;
    window.backupSystem = backupSystem;
}

console.log('Backup system initialized'); 