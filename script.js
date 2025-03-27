// Initialize stars
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = ''; // Clear existing stars
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 5 + 3}s`;
        
        starsContainer.appendChild(star);
    }
}

// Camera handling
let mediaStream = null;
let recordingTime = 0;
let timeInterval;

async function startCamera() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('camera-feed');
        videoElement.srcObject = mediaStream;
        document.getElementById('camera-error').style.display = 'none';
        
        // Start recording timer
        recordingTime = 0;
        updateRecordingTime();
        clearInterval(timeInterval);
        timeInterval = setInterval(updateRecordingTime, 1000);
    } catch (error) {
        console.error("Error accessing camera:", error);
        document.getElementById('camera-error').style.display = 'block';
    }
}

function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
        clearInterval(timeInterval);
    }
}

function updateRecordingTime() {
    recordingTime++;
    const hours = Math.floor(recordingTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((recordingTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = (recordingTime % 60).toString().padStart(2, '0');
    
    document.querySelector('.camera-time').textContent = `REC ${hours}:${minutes}:${seconds}`;
}

// Show and hide pages
function showDashboard() {
    document.getElementById('front-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'block';
    
    // Activate panels with delay
    setTimeout(() => {
        document.getElementById('map-panel').classList.add('active');
    }, 100);
    
    setTimeout(() => {
        document.getElementById('camera-panel').classList.add('active');
    }, 300);
    
    // Start camera
    startCamera();
}

function showFrontPage() {
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('front-page').style.display = 'flex';
    
    // Reset panels
    document.getElementById('map-panel').classList.remove('active');
    document.getElementById('camera-panel').classList.remove('active');
    
    // Close dropdown if open
    document.getElementById('settings-dropdown').classList.remove('show');
    
    // Stop camera
    stopCamera();
}

// Toast notifications
function showToast(title, message) {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-description">${message}</div>
        </div>
        <button class="toast-close">×</button>
    `;
    
    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slide-out 0.3s ease-in-out forwards';
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    });
    
    // Auto-remove toast after 5 seconds
    toastContainer.appendChild(toast);
    setTimeout(() => {
        if (toastContainer.contains(toast)) {
            toast.style.animation = 'slide-out 0.3s ease-in-out forwards';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// Toggle dropdowns
function toggleDropdown() {
    const dropdown = document.getElementById('settings-dropdown');
    dropdown.classList.toggle('show');
}

// Window click event to close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.settings-button') && 
        !event.target.closest('#settings-dropdown') && 
        !event.target.closest('svg')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    
    // Scan button
    document.getElementById('scan-button').addEventListener('click', function() {
        this.classList.add('scanning');
        
        showToast('Scan Initiated', 'Scanning for unauthorized drone activity...');
        
        // Simulate scanning process
        setTimeout(() => {
            this.classList.remove('scanning');
            showDashboard();
        }, 2000);
    });
    
    // Back button
    document.getElementById('back-button').addEventListener('click', showFrontPage);
    
    // Settings button
    document.getElementById('settings-button').addEventListener('click', toggleDropdown);
    
    // Alert settings
    document.getElementById('toggle-all-alerts').addEventListener('change', function() {
        const isEnabled = this.checked;
        document.getElementById('toggle-email').disabled = !isEnabled;
        document.getElementById('toggle-sms').disabled = !isEnabled;
        document.getElementById('toggle-sound').disabled = !isEnabled;
        
        showToast(
            isEnabled ? 'Alerts Enabled' : 'Alerts Disabled',
            isEnabled ? 'You will now receive drone detection alerts' : 'You will no longer receive alerts'
        );
    });
    
    // Test alert button
    document.getElementById('test-alert-btn').addEventListener('click', function() {
        if (!document.getElementById('toggle-all-alerts').checked) return;
        
        showToast('Test Alert Sent', 'A test alert has been triggered on all enabled channels');
    });
    
    // Dismiss alert
    document.getElementById('dismiss-alert').addEventListener('click', function() {
        document.getElementById('active-alert').classList.add('hidden');
        showToast('Alert Dismissed', 'The alert has been acknowledged and dismissed');
    });
    
    // Handle window resize
    window.addEventListener('resize', createStars);
});

// Clean up
window.addEventListener('beforeunload', stopCamera);
