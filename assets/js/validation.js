/**
 * WonderPlay - Form Validation Engine
 */

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.setAttribute('novalidate', 'true');
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time blur listeners
    this.form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('border-coral') || input.classList.contains('is-invalid')) {
          this.validateField(input);
        }
      });
    });
  }

  handleSubmit(e) {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      const firstInvalid = this.form.querySelector('.border-coral, .is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      if (window.showToast) {
        window.showToast('Please correct the highlighted errors before submitting.', 'error');
      }
    } else {
      // If it has a data-ajax handler, handle it nicely
      if (this.form.dataset.ajax === 'true') {
        e.preventDefault();
        const submitBtn = this.form.querySelector('[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Processing...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          if (window.showToast) {
            window.showToast(this.form.dataset.successMessage || 'Form submitted successfully!', 'success');
          }
          this.form.reset();
        }, 800);
      }
    }
  }

  validateField(input) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required') || input.dataset.required === 'true';
    let errorMessage = '';

    // Clear previous error
    this.clearError(input);

    if (isRequired && !value) {
      errorMessage = input.dataset.errorRequired || 'This field is required.';
    } else if (value) {
      if (input.type === 'email' || input.dataset.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage = 'Please enter a valid email address.';
        }
      } else if (input.type === 'tel' || input.dataset.type === 'phone') {
        const phoneRegex = /^[\d\s+\-()]{7,20}$/;
        if (!phoneRegex.test(value)) {
          errorMessage = 'Please enter a valid phone number.';
        }
      } else if (input.type === 'password' && input.dataset.minlength) {
        const min = parseInt(input.dataset.minlength, 10);
        if (value.length < min) {
          errorMessage = `Password must be at least ${min} characters.`;
        }
      } else if (input.dataset.match) {
        const targetInput = document.querySelector(input.dataset.match);
        if (targetInput && value !== targetInput.value.trim()) {
          errorMessage = 'Passwords do not match.';
        }
      } else if (input.dataset.type === 'age') {
        const age = parseInt(value, 10);
        if (isNaN(age) || age < 0 || age > 15) {
          errorMessage = 'Please enter an age between 0 and 15.';
        }
      } else if (input.dataset.type === 'guests') {
        const guests = parseInt(value, 10);
        if (isNaN(guests) || guests < 1) {
          errorMessage = 'Please enter at least 1 guest.';
        }
      }
    }

    if (errorMessage) {
      this.showError(input, errorMessage);
      return false;
    }

    return true;
  }

  showError(input, message) {
    input.classList.add('border-coral', 'is-invalid');
    input.classList.remove('border-border');
    
    let errorEl = input.parentNode.querySelector('.form-error-msg');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error-msg text-xs text-red-500 mt-1 font-medium';
      input.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  clearError(input) {
    input.classList.remove('border-coral', 'is-invalid');
    input.classList.add('border-border');
    const errorEl = input.parentNode.querySelector('.form-error-msg');
    if (errorEl) {
      errorEl.remove();
    }
  }
}

// Auto-initialize forms with class .needs-validation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form.needs-validation, form[data-validate="true"]').forEach(form => {
    new FormValidator(form);
  });
});
