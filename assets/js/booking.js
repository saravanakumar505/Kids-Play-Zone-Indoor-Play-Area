/**
 * WonderPlay - Multi-Child Interactive Booking Engine
 */

class BookingEngine {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.bookingData = {
      date: new Date().toISOString().split('T')[0],
      timeSlot: '10:00 AM - 12:00 PM',
      tier: 'Standard 2-Hour Pass',
      pricePerChild: 18.00,
      children: [
        { id: 1, name: 'Leo Miller', age: 4, zone: 'Soft Play Wonderland' }
      ],
      addons: {
        gripSocks: 2, // count
        gripSocksPrice: 3.50,
        snackPack: 1,
        snackPackPrice: 6.00,
        parentLounge: false,
        parentLoungePrice: 5.00
      },
      parentName: 'Sarah Miller',
      parentEmail: 'sarah.miller@example.com',
      parentPhone: '+1 (555) 234-5678',
      bookingId: 'WP-' + Math.floor(100000 + Math.random() * 900000)
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderChildrenList();
    this.updateSummary();
  }

  bindEvents() {
    // Next / Prev step buttons
    document.querySelectorAll('.wizard-next-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.validateStep(this.currentStep)) {
          this.goToStep(this.currentStep + 1);
        }
      });
    });

    document.querySelectorAll('.wizard-prev-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToStep(this.currentStep - 1);
      });
    });

    // Date selection
    const dateInput = document.getElementById('booking-date-input');
    if (dateInput) {
      dateInput.value = this.bookingData.date;
      dateInput.addEventListener('change', (e) => {
        this.bookingData.date = e.target.value;
        this.updateSummary();
      });
    }

    // Time slot buttons
    document.querySelectorAll('.slot-select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.slot-select-btn').forEach(b => {
          b.classList.remove('bg-primary', 'text-white', 'border-primary');
          b.classList.add('bg-white', 'text-text-main', 'border-border', 'dark:bg-surface');
        });
        btn.classList.add('bg-primary', 'text-white', 'border-primary');
        btn.classList.remove('bg-white', 'text-text-main', 'border-border', 'dark:bg-surface');
        this.bookingData.timeSlot = btn.getAttribute('data-slot');
        this.updateSummary();
      });
    });

    // Pass Tier buttons
    document.querySelectorAll('.pass-tier-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.pass-tier-btn').forEach(b => {
          b.classList.remove('border-primary', 'ring-2', 'ring-primary');
        });
        btn.classList.add('border-primary', 'ring-2', 'ring-primary');
        this.bookingData.tier = btn.getAttribute('data-tier-name');
        this.bookingData.pricePerChild = parseFloat(btn.getAttribute('data-tier-price')) || 18.00;
        this.updateSummary();
      });
    });

    // Add Child button
    const addChildBtn = document.getElementById('add-child-btn');
    if (addChildBtn) {
      addChildBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextId = this.bookingData.children.length + 1;
        this.bookingData.children.push({
          id: nextId,
          name: `Child ${nextId}`,
          age: 5,
          zone: 'Adventure Arena'
        });
        this.renderChildrenList();
        this.updateSummary();
        if (window.showToast) {
          window.showToast(`Child ${nextId} added to session.`, 'info');
        }
      });
    }

    // Addon counters
    document.querySelectorAll('[data-addon-qty]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.getAttribute('data-addon-qty');
        const action = btn.getAttribute('data-action');
        if (action === 'inc') {
          this.bookingData.addons[type] = (this.bookingData.addons[type] || 0) + 1;
        } else if (action === 'dec') {
          this.bookingData.addons[type] = Math.max(0, (this.bookingData.addons[type] || 0) - 1);
        }
        const display = document.getElementById(`addon-${type}-display`);
        if (display) display.textContent = this.bookingData.addons[type];
        this.updateSummary();
      });
    });

    // Confirm & Save
    const confirmBookingBtn = document.getElementById('confirm-booking-btn');
    if (confirmBookingBtn) {
      confirmBookingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.saveBooking();
        this.goToStep(6);
      });
    }
  }

  validateStep(step) {
    if (step === 1) {
      if (!this.bookingData.date) {
        if (window.showToast) window.showToast('Please select a visit date.', 'error');
        return false;
      }
    } else if (step === 2) {
      if (!this.bookingData.timeSlot) {
        if (window.showToast) window.showToast('Please pick a time slot.', 'error');
        return false;
      }
    } else if (step === 3) {
      if (!this.bookingData.children.length) {
        if (window.showToast) window.showToast('Please add at least one child.', 'error');
        return false;
      }
    }
    return true;
  }

  goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    this.currentStep = step;

    // Update wizard step indicators
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepEl = document.getElementById(`wizard-step-indicator-${i}`);
      if (stepEl) {
        stepEl.classList.remove('active', 'completed');
        if (i === this.currentStep) {
          stepEl.classList.add('active');
        } else if (i < this.currentStep) {
          stepEl.classList.add('completed');
        }
      }

      // Toggle step panels
      const panel = document.getElementById(`booking-step-panel-${i}`);
      if (panel) {
        if (i === this.currentStep) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
    }

    if (this.currentStep === 5 || this.currentStep === 6) {
      this.updateSummary();
    }

    // Scroll to wizard top
    const wizardRoot = document.getElementById('booking-wizard-root');
    if (wizardRoot) {
      wizardRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderChildrenList() {
    const container = document.getElementById('children-selection-list');
    if (!container) return;

    container.innerHTML = '';
    this.bookingData.children.forEach((child, index) => {
      const card = document.createElement('div');
      card.className = 'p-5 rounded-2xl bg-surface border-2 border-border card-playful flex flex-col md:flex-row md:items-center justify-between gap-4';
      card.innerHTML = `
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold text-lg font-heading">
            C${index + 1}
          </div>
          <div>
            <div class="font-heading font-bold text-base text-text-main">${child.name}</div>
            <div class="text-xs text-text-muted">Age: ${child.age} yrs &bull; Zone: <span class="text-primary font-semibold">${child.zone}</span></div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <input type="text" value="${child.name}" class="form-input-playful text-sm py-1.5 px-3 max-w-[140px]" placeholder="Child Name" onchange="window.bookingEngine.updateChild(${index}, 'name', this.value)" />
          <select class="form-input-playful text-sm py-1.5 px-3 max-w-[100px]" onchange="window.bookingEngine.updateChild(${index}, 'age', parseInt(this.value))">
            ${[1,2,3,4,5,6,7,8,9,10,11,12].map(a => `<option value="${a}" ${child.age === a ? 'selected' : ''}>${a} yrs</option>`).join('')}
          </select>
          <select class="form-input-playful text-sm py-1.5 px-3 max-w-[160px]" onchange="window.bookingEngine.updateChild(${index}, 'zone', this.value)">
            <option value="Toddler Cove" ${child.zone === 'Toddler Cove' ? 'selected' : ''}>Toddler Cove</option>
            <option value="Soft Play Wonderland" ${child.zone === 'Soft Play Wonderland' ? 'selected' : ''}>Soft Play</option>
            <option value="Adventure Arena" ${child.zone === 'Adventure Arena' ? 'selected' : ''}>Adventure Arena</option>
            <option value="Ninja Warrior Course" ${child.zone === 'Ninja Warrior Course' ? 'selected' : ''}>Ninja Course</option>
          </select>
          ${this.bookingData.children.length > 1 ? `
            <button type="button" class="p-2 text-coral hover:bg-coral-light rounded-xl transition" onclick="window.bookingEngine.removeChild(${index})">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          ` : ''}
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons({ root: container });
    }
  }

  updateChild(index, key, value) {
    if (this.bookingData.children[index]) {
      this.bookingData.children[index][key] = value;
      this.updateSummary();
    }
  }

  removeChild(index) {
    this.bookingData.children.splice(index, 1);
    this.renderChildrenList();
    this.updateSummary();
  }

  calculateTotal() {
    const childCount = this.bookingData.children.length;
    const baseSubtotal = childCount * this.bookingData.pricePerChild;
    const socksTotal = (this.bookingData.addons.gripSocks || 0) * this.bookingData.addons.gripSocksPrice;
    const snackTotal = (this.bookingData.addons.snackPack || 0) * this.bookingData.addons.snackPackPrice;
    const loungeTotal = this.bookingData.addons.parentLounge ? this.bookingData.addons.parentLoungePrice : 0;
    const subtotal = baseSubtotal + socksTotal + snackTotal + loungeTotal;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return {
      childCount,
      baseSubtotal,
      socksTotal,
      snackTotal,
      loungeTotal,
      subtotal,
      tax,
      total
    };
  }

  updateSummary() {
    const calc = this.calculateTotal();

    // Review & Confirmation bindings
    const bindMap = {
      'summary-date': this.bookingData.date,
      'summary-slot': this.bookingData.timeSlot,
      'summary-tier': this.bookingData.tier,
      'summary-child-count': `${calc.childCount} Child${calc.childCount > 1 ? 'ren' : ''}`,
      'summary-subtotal': `$${calc.subtotal.toFixed(2)}`,
      'summary-tax': `$${calc.tax.toFixed(2)}`,
      'summary-total': `$${calc.total.toFixed(2)}`,
      'confirm-booking-id': this.bookingData.bookingId,
      'confirm-date': this.bookingData.date,
      'confirm-slot': this.bookingData.timeSlot,
      'confirm-total': `$${calc.total.toFixed(2)}`
    };

    Object.keys(bindMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = bindMap[id];
    });

    const childNamesEl = document.getElementById('summary-children-names');
    if (childNamesEl) {
      childNamesEl.textContent = this.bookingData.children.map(c => `${c.name} (${c.age}y)`).join(', ');
    }
  }

  saveBooking() {
    const calc = this.calculateTotal();
    const existing = JSON.parse(localStorage.getItem('wonderplay_bookings') || '[]');
    const newBooking = {
      id: this.bookingData.bookingId,
      date: this.bookingData.date,
      time: this.bookingData.timeSlot,
      children: this.bookingData.children,
      total: calc.total.toFixed(2),
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    existing.unshift(newBooking);
    localStorage.setItem('wonderplay_bookings', JSON.stringify(existing));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('booking-wizard-root')) {
    window.bookingEngine = new BookingEngine();
  }
});
