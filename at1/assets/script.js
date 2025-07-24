// Auto Insurance Landing Page JavaScript

// Global variables
let currentStep = 1;
let formData = {};
let processingInterval;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    attachEventListeners();
    initializeFormValidation();
});

// Initialize page functionality
function initializePage() {
    // Show first step
    showStep(1);
    
    // Initialize progress bar
    updateProgress(1);
    
    // Add floating CTA after scroll
    window.addEventListener('scroll', handleScroll);
    
    // Auto-format phone input
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    // Auto-format zip code
    const zipInput = document.getElementById('zipcode');
    if (zipInput) {
        zipInput.addEventListener('input', formatZipCode);
    }
}

// Attach event listeners
function attachEventListeners() {
    // Enter key handling for inputs
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEnterKey();
        }
    });
    
    // Form validation on input
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
}

// Handle enter key based on current step
function handleEnterKey() {
    if (currentStep < 4) {
        nextStep(currentStep + 1);
    } else if (currentStep === 4) {
        submitForm();
    }
}

// Move to next step
function nextStep(stepNumber) {
    if (!validateCurrentStep()) {
        return;
    }
    
    // Hide current step
    const currentStepEl = document.getElementById(`step-${currentStep}`);
    if (currentStepEl) {
        currentStepEl.classList.add('hidden');
    }
    
    // Update current step
    currentStep = stepNumber;
    
    // Show next step with animation
    setTimeout(() => {
        showStep(stepNumber);
        updateProgress(stepNumber);
        
        // Add fade-in animation
        const nextStepEl = document.getElementById(`step-${stepNumber}`);
        if (nextStepEl) {
            nextStepEl.classList.add('animate-fade-in-up');
        }
    }, 300);
    
    // Track progress
    trackStepProgress(stepNumber);
}

// Show specific step
function showStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => {
        step.classList.add('hidden');
    });
    
    // Show target step
    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
    }
}

// Update progress bar
function updateProgress(stepNumber) {
    const progress = (stepNumber / 4) * 100;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    if (progressText) {
        progressText.textContent = `Step ${stepNumber} of 4`;
    }
}

// Validate current step
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateZipCode();
        case 2:
            return true; // Insurance selection is handled by buttons
        case 3:
            return validateVehicleInfo();
        case 4:
            return validatePersonalInfo();
        default:
            return true;
    }
}

// Validate zip code
function validateZipCode() {
    const zipcode = document.getElementById('zipcode').value.trim();
    
    if (!zipcode) {
        showError('zipcode', 'Please enter your zip code');
        return false;
    }
    
    if (!/^\d{5}$/.test(zipcode)) {
        showError('zipcode', 'Please enter a valid 5-digit zip code');
        return false;
    }
    
    formData.zipcode = zipcode;
    return true;
}

// Validate vehicle information
function validateVehicleInfo() {
    const year = document.getElementById('vehicle-year').value;
    const make = document.getElementById('vehicle-make').value;
    
    let isValid = true;
    
    if (!year) {
        showError('vehicle-year', 'Please select your vehicle year');
        isValid = false;
    }
    
    if (!make) {
        showError('vehicle-make', 'Please select your vehicle make');
        isValid = false;
    }
    
    if (isValid) {
        formData.vehicleYear = year;
        formData.vehicleMake = make;
    }
    
    return isValid;
}

// Validate personal information
function validatePersonalInfo() {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    let isValid = true;
    
    if (!firstName) {
        showError('first-name', 'Please enter your first name');
        isValid = false;
    }
    
    if (!lastName) {
        showError('last-name', 'Please enter your last name');
        isValid = false;
    }
    
    if (!email) {
        showError('email', 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone) {
        showError('phone', 'Please enter your phone number');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (isValid) {
        formData.firstName = firstName;
        formData.lastName = lastName;
        formData.email = email;
        formData.phone = phone;
    }
    
    return isValid;
}

// Select insurance option
function selectInsurance(hasInsurance) {
    formData.hasInsurance = hasInsurance;
    
    // Visual feedback
    const options = document.querySelectorAll('.insurance-option');
    options.forEach(option => {
        option.classList.remove('border-green-500', 'bg-green-50');
        option.classList.add('border-gray-300');
    });
    
    // Highlight selected option
    event.target.classList.remove('border-gray-300');
    event.target.classList.add('border-green-500', 'bg-green-50');
}

// Submit form
function submitForm() {
    if (!validatePersonalInfo()) {
        return;
    }
    
    // Hide form and show processing
    document.getElementById('step-4').classList.add('hidden');
    document.getElementById('processing').classList.remove('hidden');
    
    // Start processing animation
    startProcessingAnimation();
    
    // Simulate processing time
    setTimeout(() => {
        completeProcessing();
    }, 4000);
}

// Start processing animation
function startProcessingAnimation() {
    const steps = [
        { icon: 'fas fa-search', text: 'Comparing rates from top providers...' },
        { icon: 'fas fa-calculator', text: 'Calculating your personalized rates...' },
        { icon: 'fas fa-shield-alt', text: 'Securing your quotes...' },
        { icon: 'fas fa-check-circle', text: 'Finalizing your results...' }
    ];
    
    let stepIndex = 0;
    
    processingInterval = setInterval(() => {
        const processingSteps = document.getElementById('processing-steps');
        
        if (stepIndex < steps.length) {
            const step = steps[stepIndex];
            const stepElement = document.createElement('div');
            stepElement.className = 'processing-step active flex items-center justify-center';
            stepElement.innerHTML = `
                <i class="${step.icon} text-blue-600 mr-3"></i>
                <span>${step.text}</span>
            `;
            
            processingSteps.appendChild(stepElement);
            stepIndex++;
        }
    }, 800);
}

// Complete processing and redirect
function completeProcessing() {
    clearInterval(processingInterval);
    
    // In a real implementation, this would redirect to a results page
    // For now, we'll simulate by showing a success message
    const processingDiv = document.getElementById('processing');
    processingDiv.innerHTML = `
        <div class="bg-green-50 p-8 rounded-xl text-center">
            <div class="mb-6">
                <i class="fas fa-check-circle text-6xl text-green-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Success! We Found Your Quotes</h3>
            <p class="text-lg text-gray-600 mb-6">You could save up to $500 per year!</p>
            <button onclick="redirectToQuotes()" class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all">
                View My Quotes <i class="fas fa-arrow-right ml-2"></i>
            </button>
        </div>
    `;
}

// Redirect to quotes (placeholder)
function redirectToQuotes() {
    // In a real implementation, this would redirect to the actual quotes page
    alert('In a real implementation, this would redirect to your personalized quotes page.');
    
    // For demo purposes, reload the page
    window.location.reload();
}

// Utility functions
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add error styling
    field.classList.add('input-error');
    field.classList.remove('input-success');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    
    // Focus the field
    field.focus();
}

function clearErrors(event) {
    const field = event.target;
    field.classList.remove('input-error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validateField(event) {
    const field = event.target;
    
    if (field.value.trim()) {
        field.classList.remove('input-error');
        field.classList.add('input-success');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    event.target.value = value;
}

function formatZipCode(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.slice(0, 5);
    }
    event.target.value = value;
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const floatingCta = document.querySelector('.floating-cta');
    
    if (scrollTop > 500 && currentStep === 1) {
        if (floatingCta) {
            floatingCta.classList.add('show');
        }
    } else {
        if (floatingCta) {
            floatingCta.classList.remove('show');
        }
    }
}

function trackStepProgress(step) {
    // Analytics tracking would go here
    console.log(`User reached step ${step}`);
    
    // Example: Google Analytics or other tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_progress', {
            'step_number': step,
            'step_name': `step_${step}`
        });
    }
}

// Initialize form validation
function initializeFormValidation() {
    // Real-time validation for better UX
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.classList.remove('input-error');
            }
        });
    });
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape' && currentStep > 1) {
        // Go to previous step
        nextStep(currentStep - 1);
    }
});

// Mobile-specific optimizations
if (window.innerWidth < 768) {
    // Add mobile-specific behaviors
    document.body.classList.add('mobile-view');
    
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.fontSize = '16px';
        });
    });
}