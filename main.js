'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Copyright Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Real-time Workshop Operating Status Indicator (Mon-Sat 10 AM - 7 PM IST)
  function updateWorkshopStatus() {
    const statusPulse = document.getElementById('statusPulse');
    const statusText = document.getElementById('statusText');
    if (!statusPulse || !statusText) return;

    const now = new Date();
    // Convert to IST offset (+5.5 hours)
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istDate = new Date(utcTime + (3600000 * 5.5));
    
    const day = istDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hour = istDate.getHours();

    const isOpen = (day >= 1 && day <= 6) && (hour >= 10 && hour < 19);

    if (isOpen) {
      statusPulse.className = 'pulse-indicator';
      statusText.className = 'text-green';
      statusText.textContent = 'Open Today • 10 AM - 7 PM';
    } else {
      statusPulse.className = 'pulse-indicator closed';
      statusText.className = 'text-red';
      statusText.textContent = 'Closed Now • Opens 10 AM';
    }
  }
  updateWorkshopStatus();
  setInterval(updateWorkshopStatus, 60000); // Re-check every minute

  // 3. Service Card "Book & Generate Estimate" Trigger Buttons
  const serviceBookBtns = document.querySelectorAll('.btn-book-trigger');
  serviceBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      const serviceSelect = document.getElementById('service');

      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === serviceName || serviceSelect.options[i].text.includes(serviceName)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Scroll smoothly to contact / booking section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Focus on customer name field
      const nameInput = document.getElementById('name');
      if (nameInput) {
        setTimeout(() => {
          nameInput.focus();
        }, 300);
      }
    });
  });

  // 4. Digital Service Bill & Estimate Receipt Generator
  const contactForm = document.getElementById('contactForm');
  const receiptContainer = document.getElementById('bookingReceiptContainer');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value || '';
      const phone = document.getElementById('phone')?.value || '';
      const car = document.getElementById('car')?.value || '';
      const serviceSelect = document.getElementById('service');
      const selectedOption = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex] : null;
      const serviceName = selectedOption ? selectedOption.value : '';
      const priceEstimate = selectedOption ? selectedOption.getAttribute('data-price') || '1499' : '1499';
      const notes = document.getElementById('notes')?.value || 'Standard Inspection & Maintenance';

      // Generate Unique Receipt Number & Timestamp
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const receiptNo = `#SAW-2026-${randomId}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      // Update Bill Fields
      document.getElementById('billReceiptNo').textContent = receiptNo;
      document.getElementById('billDate').textContent = formattedDate;
      document.getElementById('billName').textContent = name;
      document.getElementById('billPhone').textContent = phone;
      document.getElementById('billCar').textContent = car;
      document.getElementById('billService').textContent = serviceName;
      document.getElementById('billAmount').textContent = `₹${parseInt(priceEstimate).toLocaleString('en-IN')}`;
      document.getElementById('billTotal').textContent = `₹${parseInt(priceEstimate).toLocaleString('en-IN')}`;
      document.getElementById('billNotes').textContent = notes;

      // Generate WhatsApp Share Link
      const waMessage = `*SENTHOOR AUTO WORKS - SERVICE BOOKING ESTIMATE*%0A` +
        `*Receipt No:* ${receiptNo}%0A` +
        `*Date:* ${formattedDate}%0A` +
        `*Customer Name:* ${name}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Vehicle:* ${car}%0A` +
        `*Service Requested:* ${serviceName}%0A` +
        `*Est. Amount:* ₹${parseInt(priceEstimate).toLocaleString('en-IN')}%0A` +
        `*Notes:* ${notes}%0A%0A` +
        `Please confirm my appointment at Odakkattupudur, Athur, Karur.`;

      const waShareBtn = document.getElementById('btnShareWhatsApp');
      if (waShareBtn) {
        waShareBtn.href = `https://wa.me/919787561810?text=${waMessage}`;
      }

      // Show Receipt Container & Scroll
      if (receiptContainer) {
        receiptContainer.classList.remove('d-none');
        receiptContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // 5. Print Receipt Button
  const btnPrintReceipt = document.getElementById('btnPrintReceipt');
  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  // 6. Lightbox Gallery Modal Handler
  const lightboxModal = document.getElementById('lightboxModal');
  if (lightboxModal) {
    lightboxModal.addEventListener('show.bs.modal', (e) => {
      const trigger = e.relatedTarget;
      if (!trigger) return;

      const imgSrc = trigger.getAttribute('data-img-src');
      const imgTitle = trigger.getAttribute('data-img-title');

      const modalImg = document.getElementById('lightboxImg');
      const modalTitle = document.getElementById('lightboxTitle');

      if (modalImg && imgSrc) modalImg.src = imgSrc;
      if (modalTitle && imgTitle) modalTitle.textContent = imgTitle;
    });
  }

  // 7. Navigation Active Link & Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-custom, .mobile-nav-btn');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);
});
