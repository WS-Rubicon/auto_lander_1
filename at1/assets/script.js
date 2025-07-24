// Auto Insurance Landing Page JavaScript
// Progressive form functionality with validation and analytics

class InsuranceForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.startTime = Date.now();
        
        this.init();
        this.bindEvents();
        this.trackPageView();
    }

    init() {
        // Initialize form state
        this.updateProgressBar();
        this.setupValidation();
        this.prefillData();
        
        // Add loading animations
        setTimeout(() => {
            document.querySelectorAll('.fade-in-up').forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    el.style.transition = 'all 0.6s ease-out';
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 100);
            });
        }, 300);
    }

    bindEvents() {
        // Next step buttons
        document.querySelectorAll('.next-step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const nextStep = parseInt(btn.dataset.next);
                if (this.validateCurrentStep()) {
                    this.goToStep(nextStep);
                }
            });
        });

        // Previous step buttons
        document.querySelectorAll('.prev-step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const prevStep = parseInt(btn.dataset.prev);
                this.goToStep(prevStep);
            });
        });

        // Form submission
        document.getElementById('insurance-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Radio button styling
        document.querySelectorAll('.insurance-option, .gender-option').forEach(option => {
            option.addEventListener('click', () => {
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                this.updateRadioStyles(radio.name);
            });
        });

        // Input validation on blur
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });

        // ZIP code formatting
        document.getElementById('zip-code').addEventListener('input', (e) => {
            this.formatZipCode(e.target);
        });

        // Phone number formatting
        document.getElementById('phone').addEventListener('input', (e) => {
            this.formatPhoneNumber(e.target);
        });

        // Analytics tracking
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('change', () => {
                this.trackFieldCompletion(input.name || input.id);
            });
        });
    }

    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;

        // Hide current step
        const currentStepEl = document.getElementById(`step-${this.currentStep}`);
        const nextStepEl = document.getElementById(`step-${stepNumber}`);

        if (stepNumber > this.currentStep) {
            currentStepEl.style.transform = 'translateX(-50px)';
            currentStepEl.style.opacity = '0';
        } else {
            currentStepEl.style.transform = 'translateX(50px)';
            currentStepEl.style.opacity = '0';
        }

        setTimeout(() => {
            currentStepEl.classList.add('hidden');
            
            // Show next step
            nextStepEl.classList.remove('hidden');
            nextStepEl.style.transform = stepNumber > this.currentStep ? 'translateX(50px)' : 'translateX(-50px)';
            nextStepEl.style.opacity = '0';
            
            setTimeout(() => {
                nextStepEl.style.transform = 'translateX(0)';
                nextStepEl.style.opacity = '1';
            }, 50);
        }, 150);

        this.currentStep = stepNumber;
        this.updateProgressBar();
        this.trackStepProgress();
        
        // Focus on first input of the new step
        setTimeout(() => {
            const firstInput = nextStepEl.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 200);
    }

    updateProgressBar() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('current-step').textContent = this.currentStep;
        document.getElementById('progress-percent').textContent = Math.round(progress);
    }

    validateCurrentStep() {
        const currentStepEl = document.getElementById(`step-${this.currentStep}`);
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearErrors(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Specific field validations
        switch (field.id) {
            case 'zip-code':
                if (value && !/^\d{5}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 5-digit ZIP code';
                }
                break;

            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;

            case 'birth-date':
                if (value) {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    
                    if (age < 16 || age > 100) {
                        isValid = false;
                        errorMessage = 'Please enter a valid birth date';
                    }
                }
                break;

            case 'first-name':
            case 'last-name':
                if (value && !/^[a-zA-Z\s'-]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid name';
                }
                break;
        }

        // Radio button validation
        if (field.type === 'radio') {
            const radioGroup = document.querySelectorAll(`input[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
                errorMessage = 'Please select an option';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.showSuccess(field);
        }

        return isValid;
    }

    showError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    showSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
        this.clearErrors(field);
    }

    clearErrors(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    updateRadioStyles(groupName) {
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
            const label = radio.closest('label');
            if (radio.checked) {
                label.style.backgroundColor = '#2563eb';
                label.style.borderColor = '#2563eb';
                label.style.color = 'white';
            } else {
                label.style.backgroundColor = '';
                label.style.borderColor = '';
                label.style.color = '';
            }
        });
    }

    formatZipCode(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5);
        }
        input.value = value;
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
        }
        input.value = value;
    }

    collectFormData() {
        const formData = new FormData(document.getElementById('insurance-form'));
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add timestamp and source
        data.timestamp = new Date().toISOString();
        data.source = 'auto_insurance_landing';
        data.timeSpent = Math.round((Date.now() - this.startTime) / 1000);
        data.userAgent = navigator.userAgent;
        data.screenResolution = `${screen.width}x${screen.height}`;
        
        return data;
    }

    async submitForm() {
        if (!this.validateCurrentStep()) {
            return;
        }

        // Show loading state
        document.getElementById('insurance-form').style.display = 'none';
        document.getElementById('loading-state').classList.remove('hidden');

        // Simulate API call with progress
        await this.simulateQuoteGeneration();

        // Collect final form data
        this.formData = this.collectFormData();
        
        // Track conversion
        this.trackConversion();

        // Show success state
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('success-state').classList.remove('hidden');

        // In a real implementation, you would send data to your backend
        console.log('Form Data:', this.formData);
        
        // Store data in localStorage for testing
        localStorage.setItem('insurance_quote_data', JSON.stringify(this.formData));
    }

    async simulateQuoteGeneration() {
        const loadingProgress = document.querySelector('.loading-progress');
        const steps = [
            'Analyzing your profile...',
            'Contacting insurance providers...',
            'Comparing rates...',
            'Generating your quotes...'
        ];
        
        for (let i = 0; i < steps.length; i++) {
            const progress = ((i + 1) / steps.length) * 100;
            loadingProgress.style.width = `${progress}%`;
            
            // Update loading text if available
            const loadingText = document.querySelector('#loading-state p');
            if (loadingText) {
                loadingText.textContent = steps[i];
            }
            
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    prefillData() {
        // Pre-fill form with test data in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Development mode - prefill for testing
            const testData = {
                'zip-code': '12345',
                'vehicle-year': '2020',
                'vehicle-make': 'Toyota',
                'first-name': 'John',
                'last-name': 'Doe',
                'birth-date': '1990-01-01',
                'email': 'john@example.com',
                'phone': '(555) 123-4567'
            };

            Object.keys(testData).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = testData[key];
                }
            });
        }
    }

    setupValidation() {
        // Real-time validation setup
        const form = document.getElementById('insurance-form');
        
        // Prevent form submission with Enter key except on last step
        form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.currentStep < this.totalSteps) {
                e.preventDefault();
                const nextBtn = document.querySelector(`#step-${this.currentStep} .next-step-btn`);
                if (nextBtn) {
                    nextBtn.click();
                }
            }
        });
    }

    // Analytics and Tracking Functions
    trackPageView() {
        this.sendAnalytics('page_view', {
            page: 'auto_insurance_landing',
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            userAgent: navigator.userAgent
        });
    }

    trackStepProgress() {
        this.sendAnalytics('step_progress', {
            step: this.currentStep,
            totalSteps: this.totalSteps,
            timeSpent: Date.now() - this.startTime,
            timestamp: new Date().toISOString()
        });
    }

    trackFieldCompletion(fieldName) {
        this.sendAnalytics('field_completion', {
            field: fieldName,
            step: this.currentStep,
            timestamp: new Date().toISOString()
        });
    }

    trackConversion() {
        this.sendAnalytics('form_conversion', {
            totalTimeSpent: Date.now() - this.startTime,
            stepsCompleted: this.totalSteps,
            timestamp: new Date().toISOString(),
            formData: this.formData
        });
    }

    trackError(error, context) {
        this.sendAnalytics('error', {
            error: error.message,
            context: context,
            step: this.currentStep,
            timestamp: new Date().toISOString()
        });
    }

    sendAnalytics(event, data) {
        // In a real implementation, you would send this to your analytics service
        console.log(`Analytics Event: ${event}`, data);
        
        // Example: Send to Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
        
        // Example: Send to custom analytics endpoint
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ event, data })
        // });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Mobile Optimization
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Adjust form padding for mobile
        const formContainer = document.querySelector('.bg-white.rounded-3xl');
        if (formContainer) {
            formContainer.classList.add('mx-2', 'px-4', 'py-6');
        }
        
        // Adjust button sizes
        document.querySelectorAll('button').forEach(btn => {
            btn.style.minHeight = '48px'; // Better touch targets
        });
        
        // Adjust input sizes
        document.querySelectorAll('input, select').forEach(input => {
            input.style.fontSize = '16px'; // Prevent zoom on iOS
            input.style.minHeight = '48px';
        });
    }
}

// Performance Monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perf = performance.getEntriesByType('navigation')[0];
                const loadTime = perf.loadEventEnd - perf.fetchStart;
                
                console.log(`Page load time: ${loadTime}ms`);
                
                // Send to analytics
                if (window.insuranceForm) {
                    window.insuranceForm.sendAnalytics('performance', {
                        loadTime: loadTime,
                        domContentLoaded: perf.domContentLoadedEventEnd - perf.fetchStart,
                        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
                    });
                }
            }, 0);
        });
    }
}

// Error Handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    if (window.insuranceForm) {
        window.insuranceForm.trackError(event.error, 'global_error_handler');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    if (window.insuranceForm) {
        window.insuranceForm.trackError(event.reason, 'unhandled_promise_rejection');
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.insuranceForm = new InsuranceForm();
        optimizeForMobile();
        measurePerformance();
        
        // Handle window resize for responsive adjustments
        window.addEventListener('resize', debounce(optimizeForMobile, 250));
        
    } catch (error) {
        console.error('Failed to initialize insurance form:', error);
        
        // Fallback: Show a simple contact form or message
        const fallbackHTML = `
            <div class="text-center p-8">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Having trouble? Contact us directly!</h3>
                <p class="text-gray-600 mb-6">Call us at <a href="tel:1-800-INSURE-ME" class="text-blue-600 font-semibold">1-800-INSURE-ME</a></p>
                <p class="text-sm text-gray-500">We apologize for the technical difficulty and will help you get a quote over the phone.</p>
            </div>
        `;
        
        const formContainer = document.querySelector('#insurance-form');
        if (formContainer) {
            formContainer.innerHTML = fallbackHTML;
        }
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InsuranceForm, debounce, throttle };
}