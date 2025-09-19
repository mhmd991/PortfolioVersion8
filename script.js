// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CV Preview Modal Functions
function openCVPreview() {
    const modal = document.getElementById('cvModal');
    const iframe = document.getElementById('cvFrame');
    
    // Set the PDF source
    iframe.src = 'files/Mohammad Yanal Resume.pdf';
    modal.style.display = 'block';
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Track modal open event
    trackCVAction('preview_opened');
}

function closeCVPreview() {
    const modal = document.getElementById('cvModal');
    const iframe = document.getElementById('cvFrame');
    
    modal.style.display = 'none';
    iframe.src = ''; // Clear iframe source
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Track modal close event
    trackCVAction('preview_closed');
}

// Track CV download events
function trackDownload(format) {
    // Log download event (you can integrate with Google Analytics here)
    console.log(`CV downloaded in ${format} format`);
    
    // Show download notification
    showNotification(`CV download started (${format.toUpperCase()})`, 'success');
    
    // You can add analytics tracking here
    trackCVAction(`download_${format}`);
    
    // Update download counter (optional)
    updateDownloadCounter();
}

// Track CV-related actions
function trackCVAction(action) {
    // Basic tracking - you can integrate with Google Analytics
    console.log(`CV Action: ${action} at ${new Date().toISOString()}`);
    
    // Example: Send to analytics
    // gtag('event', 'cv_interaction', {
    //     'event_category': 'CV',
    //     'event_label': action
    // });
}

// Show notification messages
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-text">${message}</span>
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

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// Update download counter (optional feature)
function updateDownloadCounter() {
    const counter = localStorage.getItem('cvDownloadCount') || '0';
    const newCount = parseInt(counter) + 1;
    localStorage.setItem('cvDownloadCount', newCount.toString());
    
    // You can display this count somewhere if needed
    console.log(`Total CV downloads: ${newCount}`);
}

// Check if CV files exist
function checkCVFiles() {
    const files = ['files/Mohammad Yanal Resume.pdf', 'files/Mohammad Yanal Resume.pdf'];
    
    files.forEach(file => {
        fetch(file, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    console.warn(`CV file not found: ${file}`);
                }
            })
            .catch(error => {
                console.warn(`Could not check CV file: ${file}`);
            });
    });
}

// Initialize page features
document.addEventListener('DOMContentLoaded', function() {
    // Check if CV files exist
    checkCVFiles();
    
    // Set last updated date
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        // You can set this to the actual last modified date of your CV
        lastUpdatedElement.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    }
    
    // Add click handlers for modal
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('cvModal');
        if (event.target === modal) {
            closeCVPreview();
        }
    });
    
    // Add keyboard support for modal
    document.addEventListener('keydown', function(event) {
        const modal = document.getElementById('cvModal');
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeCVPreview();
        }
    });
    
    // Add loading states to download buttons
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            
            // Restore button after short delay
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    });
});

// Add smooth reveal animations for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Add CSS for notifications (injected via JavaScript)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 1001;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    }
    
    .notification-success {
        border-left: 4px solid #28a745;
    }
    
    .notification-error {
        border-left: 4px solid #dc3545;
    }
    
    .notification-warning {
        border-left: 4px solid #ffc107;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.6;
    }
    
    .notification-close:hover {
        opacity: 1;
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