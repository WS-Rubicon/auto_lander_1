// Auto Insurance Landing Page - Interactive Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('insurance-form');
    const steps = document.querySelectorAll('.form-step');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentStepSpan = document.getElementById('current-step');
    const progressPercent = document.getElementById('progress-percent');
    const loadingState = document.getElementById('loading-state');
    const successState = document.getElementById('success-state');
    
    let currentStep = 1;
    const totalSteps = 4;
    
    // Form validation rules
    const validationRules = {
        zipcode: {
            required: true,
            pattern: /^\d{5}$/,
            message: 'Please enter a valid 5-digit ZIP code'
        },
        currently_insured: {
            required: true,
            message: 'Please select if you are currently insured'
        },
        vehicle_year: {
            required: true,
            message: 'Please select your vehicle year'
        },
        vehicle_make: {
            required: true,
            message: 'Please select your vehicle make'
        },
        dob: {
            required: true,
            custom: validateAge,
            message: 'You must be at least 18 years old'
        },
        gender: {
            required: true,
            message: 'Please select your gender'
        },
        marital_status: {
            required: true,
            message: 'Please select your marital status'
        },
        full_name: {
            required: true,
            pattern: /^[a-zA-Z\s]{2,50}$/,
            message: 'Please enter a valid full name (2-50 characters, letters only)'
        },
        phone: {
            required: true,
            pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            message: 'Please enter a valid phone number'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        }
    };
    
    // Initialize form
    function initializeForm() {
        showStep(1);
        updateProgress();
        setupEventListeners();
        formatPhoneInput();
        preloadNextStep();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        nextBtn.addEventListener('click', handleNext);
        prevBtn.addEventListener('click', handlePrevious);
        form.addEventListener('submit', handleSubmit);
        
        // Real-time validation
        form.addEventListener('input', handleRealTimeValidation);
        form.addEventListener('change', handleRealTimeValidation);
        
        // Enter key handling
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (currentStep < totalSteps) {
                    handleNext();
                } else {
                    handleSubmit(e);
                }
            }
        });
        
        // Analytics tracking
        trackFormStart();
    }
    
    // Show specific step
    function showStep(step) {
        steps.forEach((stepEl, index) => {
            stepEl.classList.toggle('hidden', index + 1 !== step);
        });
        
        prevBtn.classList.toggle('hidden', step === 1);
        nextBtn.classList.toggle('hidden', step === totalSteps);
        submitBtn.classList.toggle('hidden', step !== totalSteps);
        
        currentStep = step;
        updateProgress();
        
        // Focus first input in step
        setTimeout(() => {
            const currentStepEl = document.getElementById(`step-${step}`);
            const firstInput = currentStepEl.querySelector('input, select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        // Track step view
        trackStepView(step);
    }
    
    // Update progress indicator
    function updateProgress() {
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        currentStepSpan.textContent = currentStep;
        progressPercent.textContent = Math.round(progress);
        
        // Add animation class
        progressBar.classList.add('transition-all', 'duration-500', 'ease-in-out');
    }
    
    // Handle next button click
    function handleNext() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                showStep(currentStep + 1);
                trackStepCompletion(currentStep - 1);
            }
        }
    }
    
    // Handle previous button click
    function handlePrevious() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }
    
    // Validate current step
    function validateCurrentStep() {
        const currentStepEl = document.getElementById(`step-${currentStep}`);
        const inputs = currentStepEl.querySelectorAll('input, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Validate individual field
    function validateField(field) {
        const fieldName = field.name;
        const rules = validationRules[fieldName];
        
        if (!rules) return true;
        
        const value = field.type === 'radio' ? 
            document.querySelector(`input[name="${fieldName}"]:checked`)?.value : 
            field.value.trim();
        
        // Clear previous error state
        clearFieldError(field);
        
        // Required validation
        if (rules.required && !value) {
            showFieldError(field, rules.message);
            return false;
        }
        
        // Pattern validation
        if (value && rules.pattern && !rules.pattern.test(value)) {
            showFieldError(field, rules.message);
            return false;
        }
        
        // Custom validation
        if (value && rules.custom && !rules.custom(value)) {
            showFieldError(field, rules.message);
            return false;
        }
        
        // Show success state
        showFieldSuccess(field);
        return true;
    }
    
    // Show field error
    function showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        const errorId = `${field.name || field.id}-error`;
        let errorEl = document.getElementById(errorId);
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
        
        // Shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }
    
    // Show field success
    function showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
        clearFieldError(field);
    }
    
    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('error');
        
        const errorId = `${field.name || field.id}-error`;
        const errorEl = document.getElementById(errorId);
        
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }
    
    // Real-time validation
    function handleRealTimeValidation(e) {
        const field = e.target;
        
        // Debounce validation for text inputs
        if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
            clearTimeout(field.validationTimeout);
            field.validationTimeout = setTimeout(() => {
                validateField(field);
            }, 500);
        } else {
            validateField(field);
        }
    }
    
    // Age validation
    function validateAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 18;
    }
    
    // Format phone input
    function formatPhoneInput() {
        const phoneInput = document.getElementById('phone');
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\\D/g, '');
            
            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    }
    
    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        // Show loading state
        form.classList.add('hidden');
        loadingState.classList.remove('hidden');
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            submitForm(data);
        }, 2000);
        
        // Track conversion
        trackFormSubmission(data);
    }
    
    // Submit form to backend
    function submitForm(data) {
        // Here you would typically send data to your backend
        console.log('Form submitted with data:', data);
        
        // Show success state
        loadingState.classList.add('hidden');
        successState.classList.remove('hidden');
        
        // Track successful submission
        trackConversion(data);
        
        // Optional: Redirect after delay
        setTimeout(() => {
            // window.location.href = '/thank-you';
        }, 3000);
    }
    
    // Preload next step for better UX
    function preloadNextStep() {
        // This could preload images or data for the next step
        if (currentStep < totalSteps) {
            const nextStepEl = document.getElementById(`step-${currentStep + 1}`);
            // Preload logic here
        }
    }
    
    // Analytics tracking functions
    function trackFormStart() {
        // Track when user starts the form
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_start', {
                event_category: 'Insurance Form',
                event_label: 'Auto Insurance Quote'
            });
        }
        
        console.log('Analytics: Form started');
    }
    
    function trackStepView(step) {
        // Track step views
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_step_view', {
                event_category: 'Insurance Form',
                event_label: `Step ${step}`,
                step_number: step
            });
        }
        
        console.log(`Analytics: Step ${step} viewed`);
    }
    
    function trackStepCompletion(step) {
        // Track completed steps
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_step_complete', {
                event_category: 'Insurance Form',
                event_label: `Step ${step}`,
                step_number: step
            });
        }
        
        console.log(`Analytics: Step ${step} completed`);
    }
    
    function trackFormSubmission(data) {
        // Track form submission attempt
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Insurance Form',
                event_label: 'Auto Insurance Quote',
                vehicle_year: data.vehicle_year,
                vehicle_make: data.vehicle_make,
                currently_insured: data.currently_insured
            });
        }
        
        console.log('Analytics: Form submitted', data);
    }
    
    function trackConversion(data) {
        // Track successful conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
                event_category: 'Insurance Form',
                event_label: 'Lead Generated'
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_category: 'Auto Insurance',
                value: 0.00,
                currency: 'USD'
            });
        }
        
        console.log('Analytics: Conversion tracked', data);
    }
    
    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // Track errors
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: e.error.message,
                fatal: false
            });
        }
    });
    
    // Add shake animation CSS
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 20%, 50%, 80%, 100% { transform: translateX(0); }
            10%, 30%, 70%, 90% { transform: translateX(-5px); }
            40%, 60% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);
    
    // Initialize the form when DOM is ready
    initializeForm();
    
    // Export functions for testing
    window.InsuranceForm = {
        validateField,
        showStep,
        handleSubmit,
        trackConversion
    };
});