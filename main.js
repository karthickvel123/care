'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. DYNAMIC YEAR =================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ================= 2. DARK / LIGHT MODE THEME TOGGLE =================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlRoot = document.documentElement;

  // Load saved theme or system preference
  const savedTheme = localStorage.getItem('saw_theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('saw_theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun text-warning';
      } else {
        themeIcon.className = 'fas fa-moon text-white';
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // ================= 3. REAL-TIME WORKSHOP STATUS BADGE =================
  const statusBadge = document.getElementById('workshopStatusBadge');
  if (statusBadge) {
    const now = new Date();
    // India Standard Time (UTC + 5:30)
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (3600000 * 5.5));
    const day = istTime.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const hour = istTime.getHours();
    const min = istTime.getMinutes();
    const currentTimeMinutes = hour * 60 + min;

    // Open Mon - Sat: 10:00 AM (600 mins) to 7:00 PM (1140 mins)
    const isOpen = (day >= 1 && day <= 6) && (currentTimeMinutes >= 600 && currentTimeMinutes < 1140);

    if (isOpen) {
      statusBadge.className = 'badge bg-success-subtle text-success border border-success-subtle px-2 py-1';
      statusBadge.innerHTML = '<i class="fas fa-circle-dot me-1 text-success pulse-dot"></i> Open Now • Closes at 7:00 PM';
    } else {
      statusBadge.className = 'badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1';
      statusBadge.innerHTML = '<i class="fas fa-clock me-1 text-warning"></i> Opens at 10:00 AM (Mon - Sat)';
    }
  }

  // ================= 4. MOBILE APP TAB SWITCHER =================
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
        if (btn.hasAttribute('aria-selected')) {
          btn.setAttribute('aria-selected', 'true');
        }
      } else {
        btn.classList.remove('active');
        if (btn.hasAttribute('aria-selected')) {
          btn.setAttribute('aria-selected', 'false');
        }
      }
    });

    // Update Desktop Navbar Links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
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

  // Desktop Navbar link handler
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-brand[data-tab]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const tabAttr = link.getAttribute('data-tab');
      const href = link.getAttribute('href');

      if (tabAttr) {
        e.preventDefault();
        switchTab(tabAttr);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href && !href.startsWith('http')) {
        if (href === '#why-us' || href === '#about' || href === '#home') {
          switchTab('pane-home');
        } else if (href === '#services') {
          switchTab('pane-services');
        } else if (href === '#calculator') {
          switchTab('pane-calculator');
        } else if (href === '#tracker') {
          switchTab('pane-tracker');
        } else if (href === '#gallery') {
          switchTab('pane-gallery');
        } else if (href === '#contact') {
          switchTab('pane-contact');
        }
      }

      // Close mobile navbar collapse if open
      const navCollapse = document.getElementById('navContent');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // ================= 5. COST ESTIMATOR & PACKAGE SELECTOR =================
  let currentSegment = 'Hatchback';
  let currentMultiplier = 1.0;
  let currentBasePackageName = 'Standard Periodic Service';
  let currentBasePackagePrice = 2499;

  const vehicleCards = document.querySelectorAll('.vehicle-card');
  const packageRadios = document.querySelectorAll('input[name="calcPackage"]');
  const addonCheckboxes = document.querySelectorAll('.addon-input');
  const calculatedTotalDisplay = document.getElementById('calculatedTotalDisplay');
  const summarySegment = document.getElementById('summarySegment');
  const summaryPackageName = document.getElementById('summaryPackageName');
  const summaryPackagePrice = document.getElementById('summaryPackagePrice');
  const summaryAddonsList = document.getElementById('summaryAddonsList');

  function updateCostEstimator() {
    let basePrice = currentBasePackagePrice * currentMultiplier;
    let addonsTotal = 0;
    let addonsHtml = '';

    addonCheckboxes.forEach(chk => {
      if (chk.checked) {
        const addonVal = parseFloat(chk.value) || 0;
        const addonName = chk.getAttribute('data-name') || 'Add-on';
        addonsTotal += addonVal;
        addonsHtml += `
          <div class="d-flex justify-content-between text-muted fs-8">
            <span>+ ${addonName}</span>
            <span class="font-mono">+₹${addonVal}</span>
          </div>`;
      }
    });

    const grandTotal = Math.round(basePrice + addonsTotal);

    if (summarySegment) summarySegment.textContent = currentSegment;
    if (summaryPackageName) summaryPackageName.textContent = currentBasePackageName;
    if (summaryPackagePrice) summaryPackagePrice.textContent = `₹${Math.round(basePrice).toLocaleString('en-IN')}`;
    if (summaryAddonsList) summaryAddonsList.innerHTML = addonsHtml;
    if (calculatedTotalDisplay) calculatedTotalDisplay.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

    return { grandTotal, currentSegment, currentBasePackageName };
  }

  // Vehicle Segment Selection
  vehicleCards.forEach(card => {
    card.addEventListener('click', () => {
      vehicleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentMultiplier = parseFloat(card.getAttribute('data-multiplier')) || 1.0;
      currentSegment = card.querySelector('strong')?.textContent || 'Car';
      updateCostEstimator();
    });
  });

  // Package Tier Selection
  packageRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.package-option-card').forEach(c => c.classList.remove('active'));
      const parentCard = radio.closest('.package-option-card');
      if (parentCard) parentCard.classList.add('active');
      currentBasePackagePrice = parseFloat(radio.value) || 2499;
      currentBasePackageName = radio.getAttribute('data-name') || 'Service Package';
      updateCostEstimator();
    });
  });

  // Add-on Toggles
  addonCheckboxes.forEach(chk => {
    chk.addEventListener('change', updateCostEstimator);
  });

  // "Apply Estimate & Generate Voucher" Button
  const btnBookFromCalculator = document.getElementById('btnBookFromCalculator');
  if (btnBookFromCalculator) {
    btnBookFromCalculator.addEventListener('click', () => {
      const estimate = updateCostEstimator();
      switchTab('pane-contact');

      const carInput = document.getElementById('car');
      if (carInput && !carInput.value) {
        carInput.value = `${estimate.currentSegment} (${estimate.currentBasePackageName})`;
      }

      const serviceSelect = document.getElementById('service');
      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.includes('Custom Package') || serviceSelect.options[i].text.includes('Car Servicing')) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      const notesInput = document.getElementById('notes');
      if (notesInput) {
        notesInput.value = `Applied Cost Estimate: ${estimate.currentSegment} - ${estimate.currentBasePackageName}. Estimated Total: ₹${estimate.grandTotal.toLocaleString('en-IN')}`;
      }

      const nameInput = document.getElementById('name');
      if (nameInput) {
        setTimeout(() => {
          nameInput.focus();
          nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }
    });
  }

  // ================= 6. LIVE VEHICLE SERVICE TRACKER =================
  const trackerForm = document.getElementById('trackerSearchForm');
  const trackerResultBox = document.getElementById('trackerResultBox');
  const trackerRegBadge = document.getElementById('trackerRegBadge');
  const trackerJobNo = document.getElementById('trackerJobNo');
  const trackerCurrentBadge = document.getElementById('trackerCurrentBadge');
  const trackerTimestamp = document.getElementById('trackerTimestamp');

  if (trackerForm) {
    trackerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('trackerInput')?.value.trim().toUpperCase() || 'TN 47 AB 1234';

      if (trackerRegBadge) trackerRegBadge.textContent = query;
      if (trackerJobNo) trackerJobNo.textContent = `#SAW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      if (trackerTimestamp) trackerTimestamp.textContent = `Updated: Today, ${timeString}`;

      // Randomize realistic state (Step 3 or 4)
      const isReady = query.includes('1001') || query.includes('READY');
      
      const step3 = document.getElementById('step3');
      const step4 = document.getElementById('step4');
      const step5 = document.getElementById('step5');

      if (isReady) {
        if (step3) { step3.className = 'step-node completed'; step3.querySelector('.step-icon').innerHTML = '<i class="fas fa-check"></i>'; }
        if (step4) { step4.className = 'step-node completed'; step4.querySelector('.step-icon').innerHTML = '<i class="fas fa-check"></i>'; }
        if (step5) { step5.className = 'step-node active'; step5.querySelector('.step-icon').innerHTML = '<i class="fas fa-car-on"></i>'; }
        if (trackerCurrentBadge) {
          trackerCurrentBadge.className = 'badge bg-success text-white px-3 py-1 font-mono fs-8';
          trackerCurrentBadge.innerHTML = '<i class="fas fa-circle-check me-1"></i> Ready for Pickup / Delivery';
        }
      } else {
        if (step3) { step3.className = 'step-node active'; step3.querySelector('.step-icon').innerHTML = '<i class="fas fa-wrench"></i>'; }
        if (step4) { step4.className = 'step-node'; step4.querySelector('.step-icon').innerHTML = '<i class="fas fa-shower"></i>'; }
        if (step5) { step5.className = 'step-node'; step5.querySelector('.step-icon').innerHTML = '<i class="fas fa-car-on"></i>'; }
        if (trackerCurrentBadge) {
          trackerCurrentBadge.className = 'badge bg-success-subtle text-success border border-success-subtle px-3 py-1 font-mono fs-8';
          trackerCurrentBadge.innerHTML = '<i class="fas fa-wrench me-1"></i> Service In Progress';
        }
      }

      if (trackerResultBox) {
        trackerResultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // ================= 7. SOS 24/7 BREAKDOWN GPS DISPATCHER =================
  const btnShareLocationSOS = document.getElementById('btnShareLocationSOS');
  if (btnShareLocationSOS) {
    btnShareLocationSOS.addEventListener('click', () => {
      if (navigator.geolocation) {
        btnShareLocationSOS.innerHTML = '<i class="fas fa-spinner fa-spin text-red"></i> Fetching GPS...';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
            const sosMsg = `🚨 *EMERGENCY BREAKDOWN SOS* 🚨\n\nHello Senthoor Auto Works! My vehicle is broken down and I need immediate roadside assistance in Karur.\n\n📍 *My Current GPS Location:* ${mapUrl}\n\nPlease dispatch your breakdown/recovery team immediately.`;
            btnShareLocationSOS.innerHTML = '<i class="fas fa-location-crosshairs text-red"></i> Share GPS via WhatsApp';
            window.open(`https://wa.me/919787561810?text=${encodeURIComponent(sosMsg)}`, '_blank');
          },
          (err) => {
            btnShareLocationSOS.innerHTML = '<i class="fas fa-location-crosshairs text-red"></i> Share GPS via WhatsApp';
            const fallbackMsg = `🚨 *EMERGENCY BREAKDOWN SOS* 🚨\n\nHello Senthoor Auto Works! My vehicle is broken down near Karur / Athur. Please contact me for roadside assistance.`;
            window.open(`https://wa.me/919787561810?text=${encodeURIComponent(fallbackMsg)}`, '_blank');
          },
          { timeout: 8000 }
        );
      } else {
        window.open(`https://wa.me/919787561810?text=Hello%20Senthoor%20Auto%20Works!%20My%20car%20broke%20down%20in%20Karur.%20Need%20roadside%20assistance.`, '_blank');
      }
    });
  }

  // ================= 8. MAINTENANCE MILEAGE SCHEDULE ADVISOR =================
  let selectedFuel = 'petrol';
  const fuelBtns = document.querySelectorAll('.fuel-btn');
  fuelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fuelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFuel = btn.getAttribute('data-fuel') || 'petrol';
    });
  });

  const btnCalculateSchedule = document.getElementById('btnCalculateSchedule');
  const odometerInput = document.getElementById('odometerInput');
  const reportHeader = document.getElementById('reportHeader');
  const reportSubtitle = document.getElementById('reportSubtitle');
  const oilIntervalText = document.getElementById('oilIntervalText');

  function calculateSchedule() {
    const km = parseInt(odometerInput?.value) || 35000;
    const interval = 10000;
    const nextOilKm = Math.ceil((km + 1) / interval) * interval;
    const remainingKm = nextOilKm - km;

    if (reportHeader) reportHeader.textContent = `Vehicle Health Card (${km.toLocaleString('en-IN')} KM)`;
    if (reportSubtitle) reportSubtitle.textContent = `Recommended intervals for ${selectedFuel.toUpperCase()} vehicle`;
    if (oilIntervalText) {
      oilIntervalText.innerHTML = `Next replacement due at <strong>${nextOilKm.toLocaleString('en-IN')} KM</strong> (~${remainingKm.toLocaleString('en-IN')} KM remaining)`;
    }
  }

  if (btnCalculateSchedule) {
    btnCalculateSchedule.addEventListener('click', calculateSchedule);
  }

  const btnBookFromSchedule = document.getElementById('btnBookFromSchedule');
  if (btnBookFromSchedule) {
    btnBookFromSchedule.addEventListener('click', () => {
      const km = parseInt(odometerInput?.value) || 35000;
      switchTab('pane-contact');
      const notesInput = document.getElementById('notes');
      if (notesInput) {
        notesInput.value = `Periodic Maintenance based on ${km.toLocaleString('en-IN')} KM Odometer reading.`;
      }
      const nameInput = document.getElementById('name');
      if (nameInput) {
        setTimeout(() => {
          nameInput.focus();
          nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }
    });
  }

  // ================= 9. SERVICE CARD BUTTONS =================
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
        }, 200);
      }
    });
  });

  // ================= 10. GALLERY LIGHTBOX MODAL =================
  const galleryCards = document.querySelectorAll('.gallery-card[data-img-src]');
  const lightboxImg = document.getElementById('lightboxModalImg');
  const galleryModalEl = document.getElementById('galleryModal');

  if (galleryCards.length && lightboxImg && galleryModalEl) {
    const bsModal = new bootstrap.Modal(galleryModalEl);
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img-src');
        if (imgSrc) {
          lightboxImg.src = imgSrc;
          bsModal.show();
        }
      });
    });
  }

  // ================= 11. DIGITAL BOOKING VOUCHER GENERATOR =================
  const form = document.getElementById('contactForm');
  const receiptContainer = document.getElementById('bookingReceiptContainer');
  let currentWhatsAppUrl = '';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim() || 'Valued Customer';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const car = document.getElementById('car')?.value.trim() || 'Vehicle';
      const serviceSelect = document.getElementById('service');
      const service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex]?.text : 'Car Service';
      const notes = document.getElementById('notes')?.value.trim() || 'Routine inspection / Standard service';

      // Generate Unique Receipt Number
      const receiptNo = `#SAW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      // Populate Bill Fields
      const billReceiptNo = document.getElementById('billReceiptNo');
      const billDate = document.getElementById('billDate');
      const billName = document.getElementById('billName');
      const billPhone = document.getElementById('billPhone');
      const billCar = document.getElementById('billCar');
      const billService = document.getElementById('billService');
      const billNotes = document.getElementById('billNotes');

      if (billReceiptNo) billReceiptNo.textContent = receiptNo;
      if (billDate) billDate.textContent = formattedDate;
      if (billName) billName.textContent = name;
      if (billPhone) billPhone.textContent = phone;
      if (billCar) billCar.textContent = car;
      if (billService) billService.textContent = service;
      if (billNotes) billNotes.textContent = notes;

      // WhatsApp URL string
      const message = `Hello Senthoor Auto Works! I have generated a Service Booking Voucher:\n\n` +
        `🧾 *Receipt No:* ${receiptNo}\n` +
        `👤 *Customer Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🚗 *Car Model:* ${car}\n` +
        `🛠️ *Service Needed:* ${service}\n` +
        `📝 *Notes:* ${notes}\n\n` +
        `Please confirm my appointment slot at Odakkattupudur, Athur, Karur.`;

      currentWhatsAppUrl = `https://wa.me/919787561810?text=${encodeURIComponent(message)}`;

      // Reveal Bill Container
      if (receiptContainer) {
        receiptContainer.classList.remove('d-none');
        receiptContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      form.reset();
    });
  }

  // ================= 12. SEND TO WHATSAPP & PRINT VOUCHER =================
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
          <title>Senthoor Auto Works - Voucher ${receiptNo}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; margin: 0; color: #0f172a; background: #fff; }
            .card { border: 2px dashed #e11d48; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #e11d48; padding-bottom: 12px; margin-bottom: 20px; }
            .header h2 { margin: 4px 0; color: #e11d48; font-size: 24px; letter-spacing: 1px; }
            .header p { margin: 0; font-size: 13px; color: #64748b; }
            .badge { display: inline-block; background: #22c55e; color: #fff; padding: 4px 12px; font-size: 11px; font-weight: bold; border-radius: 12px; margin-top: 8px; }
            .info { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 14px; text-align: left; }
            th { background: #f8fafc; width: 35%; font-weight: 600; color: #334155; }
            .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>SENTHOOR AUTO WORKS</h2>
              <p>Odakkattupudur, Athur, Karur - 639008 | Phone: +91 97875 61810</p>
              <span class="badge">OFFICIAL SERVICE BOOKING VOUCHER</span>
            </div>
            <div class="info">
              <div><strong>Receipt No:</strong> <span style="color:#e11d48;">${receiptNo}</span></div>
              <div><strong>Date:</strong> ${date}</div>
            </div>
            <table>
              <tr><th>Customer Name</th><td>${custName}</td></tr>
              <tr><th>Phone Number</th><td>${custPhone}</td></tr>
              <tr><th>Vehicle Model</th><td>${custCar}</td></tr>
              <tr><th>Requested Service</th><td style="font-weight:bold; color:#e11d48;">${custService}</td></tr>
              <tr><th>Symptoms / Notes</th><td>${custNotes}</td></tr>
              <tr><th>Booking Status</th><td>Pending Workshop Confirmation</td></tr>
            </table>
            <div class="footer">
              <p>Thank you for choosing Senthoor Auto Works! Please show this voucher upon arrival.</p>
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