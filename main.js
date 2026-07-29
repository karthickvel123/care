'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Mobile App Tab Switcher Logic
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

    // Update Active Tab Buttons
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
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

  // 3. Navbar link handler (Desktop & Mobile)
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http')) return;
      
      if (href === '#why-us' || href === '#about' || href === '#home') {
        switchTab('pane-home');
      } else if (href === '#services') {
        switchTab('pane-services');
      } else if (href === '#gallery') {
        switchTab('pane-gallery');
      } else if (href === '#contact') {
        switchTab('pane-contact');
      }

      // Close mobile navbar collapse if open
      const navCollapse = document.getElementById('navContent');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // 4. Service Card "Book & Generate Bill" Buttons
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

  // 5. Digital Bill / Receipt Generator Form
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

      // WhatsApp URL string
      const message = `Hello Senthoor Auto Works! I have generated a Service Booking Voucher:\n\n` +
        `🧾 *Receipt No:* ${receiptNo}\n` +
        `👤 *Customer Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🚗 *Car Model:* ${car}\n` +
        `🛠️ *Service Needed:* ${service}\n` +
        `📝 *Notes:* ${notes}\n\n` +
        `Please confirm my appointment slot!`;

      currentWhatsAppUrl = `https://wa.me/919787561810?text=${encodeURIComponent(message)}`;

      // Show Bill Container
      if (receiptContainer) {
        receiptContainer.classList.remove('d-none');
        receiptContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      form.reset();
    });
  }

  // 6. Send to WhatsApp Button
  const btnSendWhatsApp = document.getElementById('btnSendBillWhatsApp');
  if (btnSendWhatsApp) {
    btnSendWhatsApp.addEventListener('click', () => {
      if (currentWhatsAppUrl) {
        window.open(currentWhatsAppUrl, '_blank');
      } else {
        window.open('https://wa.me/919787561810', '_blank');
      }
    });
  }

  // 7. Print / Save PDF Button
  const btnPrintBill = document.getElementById('btnPrintBill');
  if (btnPrintBill) {
    btnPrintBill.addEventListener('click', () => {
      const receiptNo = document.getElementById('billReceiptNo')?.textContent || '#SAW-2026-1001';
      const date = document.getElementById('billDate')?.textContent || '';
      const custName = document.getElementById('billName')?.textContent || '';
      const custPhone = document.getElementById('billPhone')?.textContent || '';
      const custCar = document.getElementById('billCar')?.textContent || '';
      const custService = document.getElementById('billService')?.textContent || '';
      const custNotes = document.getElementById('billNotes')?.textContent || '';

      const printWin = window.open('', '_blank');
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Senthoor Auto Works - Receipt ${receiptNo}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; margin: 0; color: #1e293b; background: #fff; }
            .card { border: 2px dashed #c41e3a; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #c41e3a; padding-bottom: 12px; margin-bottom: 20px; }
            .header h2 { margin: 4px 0; color: #c41e3a; font-size: 24px; letter-spacing: 1px; }
            .header p { margin: 0; font-size: 13px; color: #64748b; }
            .badge { display: inline-block; background: #22c55e; color: #fff; padding: 4px 12px; font-size: 11px; font-weight: bold; border-radius: 12px; margin-top: 8px; }
            .info { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 14px; text-align: left; }
            th { background: #f1f5f9; width: 35%; }
            .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>SENTHOOR AUTO WORKS</h2>
              <p>Karur Main Road, Karur - 639001 | Phone: +91 97875 61810</p>
              <span class="badge">OFFICIAL SERVICE BOOKING VOUCHER</span>
            </div>
            <div class="info">
              <div><strong>Receipt No:</strong> <span style="color:#c41e3a;">${receiptNo}</span></div>
              <div><strong>Date:</strong> ${date}</div>
            </div>
            <table>
              <tr><th>Customer Name</th><td>${custName}</td></tr>
              <tr><th>Phone Number</th><td>${custPhone}</td></tr>
              <tr><th>Vehicle Model</th><td>${custCar}</td></tr>
              <tr><th>Requested Service</th><td style="font-weight:bold; color:#c41e3a;">${custService}</td></tr>
              <tr><th>Symptoms / Notes</th><td>${custNotes}</td></tr>
              <tr><th>Booking Status</th><td>Pending Workshop Confirmation</td></tr>
            </table>
            <div class="footer">
              <p>Thank you for choosing Senthoor Auto Works! Please show this voucher at our workshop.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWin.document.close();
    });
  }
});
