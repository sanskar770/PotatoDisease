// ===================================
// File Upload Handler
// ===================================
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, or WEBP)');
        event.target.value = '';
        return;
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        event.target.value = '';
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImage = document.getElementById('previewImage');
        const uploadCard = document.getElementById('uploadCard');
        
        previewImage.src = e.target.result;
        uploadCard.classList.add('has-image');
        
        // Smooth scroll to preview
        setTimeout(() => {
            previewImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };
    reader.readAsDataURL(file);
}

// ===================================
// Remove Image Function
// ===================================
function removeImage() {
    const imageInput = document.getElementById('imageInput');
    const uploadCard = document.getElementById('uploadCard');
    const previewImage = document.getElementById('previewImage');
    
    imageInput.value = '';
    uploadCard.classList.remove('has-image');
    previewImage.src = '';
    
    // Smooth scroll back to upload area
    document.getElementById('uploadArea').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===================================
// Form Submission Handler
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            const fileInput = document.getElementById('imageInput');
            
            if (!fileInput.files || !fileInput.files[0]) {
                e.preventDefault();
                alert('Please select an image first');
                return;
            }
            
            // Show loading state
            if (analyzeBtn) {
                analyzeBtn.classList.add('loading');
                analyzeBtn.disabled = true;
            }
            
            // Note: Form will submit normally, loading state persists until page reload
        });
    }
    
    // Animate results card on load if present
    const resultsCard = document.getElementById('resultsCard');
    if (resultsCard) {
        // Scroll to results smoothly
        setTimeout(() => {
            resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
});

// ===================================
// Drag and Drop Functionality
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadLabel = uploadArea ? uploadArea.querySelector('.upload-label') : null;
    
    if (!uploadLabel) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    uploadLabel.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        uploadLabel.style.borderColor = 'var(--primary)';
        uploadLabel.style.background = 'rgba(74, 124, 44, 0.05)';
        uploadLabel.style.transform = 'scale(1.02)';
    }
    
    function unhighlight(e) {
        uploadLabel.style.borderColor = '';
        uploadLabel.style.background = '';
        uploadLabel.style.transform = '';
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            const fileInput = document.getElementById('imageInput');
            fileInput.files = files;
            
            // Trigger the change event
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            // Manual call to handleFileSelect since the event might not trigger properly
            handleFileSelect({ target: fileInput });
        }
    }
});

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
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

// ===================================
// Add Intersection Observer for Animations
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.info-card-small').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// ===================================
// Keyboard Accessibility
// ===================================
document.addEventListener('keydown', function(e) {
    // Press 'U' to focus on upload input
    if (e.key === 'u' || e.key === 'U') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            const uploadInput = document.getElementById('imageInput');
            if (uploadInput) {
                uploadInput.click();
            }
        }
    }
});

// ===================================
// Loading Progress Indicator (Optional Enhancement)
// ===================================
window.addEventListener('load', function() {
    // Page loaded successfully
    document.body.classList.add('loaded');
});