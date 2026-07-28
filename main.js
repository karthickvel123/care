'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Dynamic copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile App Tab Switcher Logic
  const tabBtns = document.querySelectorAll('.app-tab-btn, .mobile-nav-item[data-tab]');
  const appPanes = document.querySelectorAll('.mobile-app-pane');

  function switchTab(tabId) {
    if (!tabId) return;
    
    // Update Panes
    appPanes.forEach(pane => {
      pane.classList.remove('active');
      if (pane.id === tabId) {
        pane.classList.add('active');
      }
    });

    // Update Active Buttons
    tabBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) {
        e.preventDefault();
        switchTab(tabId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Handle header nav clicks on mobile
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#why-us' || href === '#about' || href === '#home') {
        switchTab('pane-home');
      } else if (href === '#services') {
        switchTab('pane-services');
      } else if (href === '#gallery') {
        switchTab('pane-gallery');
      } else if (href === '#contact') {
        switchTab('pane-contact');
      }
    });
  });

  // Service Card Booking Click Handler
  const serviceBookBtns = document.querySelectorAll('.btn-book-service');
  serviceBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      
      switchTab('pane-contact');

      const serviceSelect = document.getElementById('service');
      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      const nameInput = document.getElementById('name');
      if (nameInput) {
        setTimeout(() => {
          nameInput.focus();
          nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    });
  });

  // ================= DIGITAL BILL / RECEIPT GENERATOR =================
  const form = document.getElementById('contactForm');
  const receiptContainer = document.getElementById('bookingReceiptContainer');
  let currentWhatsAppUrl = '';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value || '';
      const phone = document.getElementById('phone')?.value || '';
      const car = document.getElementById('car')?.value || '';
      const serviceSelect = document.getElementById('service');
      const service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex]?.text : '';
      const notes = document.getElementById('notes')?.value || 'Routine Checkup';

      // Generate Unique Receipt Number
      const receiptNo = `#SAW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      // Populate Bill Fields
      document.getElementById('billReceiptNo').textContent = receiptNo;
      document.getElementById('billDate').textContent = formattedDate;
      document.getElementById('billName').textContent = name;
      document.getElementById('billPhone').textContent = phone;
      document.getElementById('billCar').textContent = car;
      document.getElementById('billService').textContent = service;
      document.getElementById('billNotes').textContent = notes;

      // Create WhatsApp message string
      const message = `Hello Senthoor Auto Works! I have generated a Service Booking Voucher:\n\n` +
        `🧾 *Receipt No:* ${receiptNo}\n` +
        `👤 *Customer Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🚗 *Car Model:* ${car}\n` +
        `🛠️ *Service Needed:* ${service}\n` +
        `📝 *Notes:* ${notes}\n\n` +
        `Please confirm my appointment slot!`;

      currentWhatsAppUrl = `https://wa.me/919787561810?text=${encodeURIComponent(message)}`;

      // Show Bill Receipt Container
      if (receiptContainer) {
        receiptContainer.classList.remove('d-none');
        receiptContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      form.reset();
    });
  }

  // Bill Action Buttons
  const btnSendWhatsApp = document.getElementById('btnSendBillWhatsApp');
  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener('click', () => {
      if (currentWhatsAppUrl) {
        window.open(currentWhatsAppUrl, '_blank');
      }
    });
  }

  // Direct Page Print Handler
  const btnPrintBill = document.getElementById('btnPrintBill');
  if (btnPrintBill) {
    btnPrintBill.addEventListener('click', () => {
      window.print();
    });
  }
});
