'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Auto copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

      // Format WhatsApp message cleanly
      let message = `Hello Senthoor Auto Works! I would like to book a workshop slot:\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🚗 *Car Model:* ${car}\n` +
        `🛠️ *Service Needed:* ${service}`;

      if (notes.trim() !== '') {
        message += `\n📝 *Notes:* ${notes}`;
      }

      // Create WhatsApp URL for 9787561810
      const whatsappUrl = `https://wa.me/919787561810?text=${encodeURIComponent(message)}`;

      // Show alert & Open WhatsApp
      if (alertBox) {
        alertBox.classList.remove('d-none');
        setTimeout(() => alertBox.classList.add('d-none'), 5000);
      }

      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');

      form.reset();
    });
  }

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
