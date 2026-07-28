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

  // Handle header nav clicks on mobile to switch to correct tab
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

  // Service Card Booking Click Handler (Fills form & collects info first!)
  const serviceBookBtns = document.querySelectorAll('.btn-book-service');
  serviceBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      
      // Switch to Contact Tab (which has the booking form)
      switchTab('pane-contact');

      // Pre-select service in form
      const serviceSelect = document.getElementById('service');
      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Scroll to form and focus name input
      const nameInput = document.getElementById('name');
      if (nameInput) {
        setTimeout(() => {
          nameInput.focus();
          nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    });
  });

  // WhatsApp Booking Form Handler
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value || '';
      const phone = document.getElementById('phone')?.value || '';
      const car = document.getElementById('car')?.value || '';
      const serviceSelect = document.getElementById('service');
      const service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex]?.text : '';
      const notes = document.getElementById('notes')?.value || '';

      let message = `Hello Senthoor Auto Works! I would like to book a workshop slot:\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🚗 *Car Model:* ${car}\n` +
        `🛠️ *Service Needed:* ${service}`;

      if (notes.trim() !== '') {
        message += `\n📝 *Notes:* ${notes}`;
      }

      const whatsappUrl = `https://wa.me/919787561810?text=${encodeURIComponent(message)}`;

      if (alertBox) {
        alertBox.classList.remove('d-none');
        setTimeout(() => alertBox.classList.add('d-none'), 5000);
      }

      window.open(whatsappUrl, '_blank');
      form.reset();
    });
  }
});
