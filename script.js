/* ==========================================================
   ISLAMABAD HOME CARE SERVICES
   Central client configuration — edit this object first.
   ========================================================== */
const CONFIG = {
  business: {
    name: "Islamabad Home Care Services",
    category: "Home Care / Healthcare / Patient Care Services",
    phone: "+92 342 6881984",
    phoneHref: "tel:+923426881984",
    whatsapp: "923426881984",
    whatsappMessage: "Hello Islamabad Home Care Services, I would like to know more about your services.",
    appointmentWhatsappMessage: "Hello Islamabad Home Care Services, I would like to request an appointment.",
    address: "Tower, Lower Ground, Shop No. 7, Aria Street 2, Markaz FECHS E-11/2, E-11, Islamabad, 44006, Pakistan",
    hours: "10:00 AM – 10:00 PM",
    rating: "4.9",
    reviewCount: "22",
    mapsUrl: "https://maps.app.goo.gl/Z2REQo4qYFWz86sc8",
    mapEmbedUrl: "https://www.google.com/maps?q=Tower%2C%20Lower%20Ground%2C%20Shop%20No.%207%2C%20Aria%20Street%202%2C%20Markaz%20FECHS%20E-11%2F2%2C%20E-11%2C%20Islamabad%2C%2044006%2C%20Pakistan&output=embed"
  },
  social: { facebook: "", instagram: "", youtube: "" },
  backend: {
    // Replace with your deployed Apps Script /exec URL.
    googleAppsScriptUrl: "YOUR_APPS_SCRIPT_WEB_APP_URL"
  },
  media: {
    images: [
      "assets/images/image-01.svg",
      "assets/images/image-02.svg",
      "assets/images/image-03.svg",
      "assets/images/image-04.svg"
    ],
    video: "assets/videos/video-01.mp4"
  }
};

/* IMPORTANT:
   These are deliberately NOT fake services. Replace these entries with
   services confirmed by the business before publishing.
*/
const services = [
  { title: "[ADD VERIFIED SERVICE]", description: "[ADD VERIFIED SERVICE DESCRIPTION]", icon: "✚", image: "assets/images/image-01.svg" },
  { title: "[ADD VERIFIED SERVICE]", description: "[ADD VERIFIED SERVICE DESCRIPTION]", icon: "♥", image: "assets/images/image-02.svg" },
  { title: "[ADD VERIFIED SERVICE]", description: "[ADD VERIFIED SERVICE DESCRIPTION]", icon: "◌", image: "assets/images/image-03.svg" }
];

/* Paste authentic Google review data supplied/verified by the client here.
   Do NOT publish invented review text or names.
*/
const reviews = [];

/* ---------- Helpers ---------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

function whatsappUrl(message = CONFIG.business.whatsappMessage) {
  return `https://wa.me/${CONFIG.business.whatsapp}?text=${encodeURIComponent(message)}`;
}

function setBusinessData() {
  $$("[data-rating]").forEach(el => el.textContent = CONFIG.business.rating);
  $$("[data-review-count]").forEach(el => el.textContent = CONFIG.business.reviewCount);
  $$("[data-address]").forEach(el => el.textContent = CONFIG.business.address);
  $$("[data-phone]").forEach(el => {
    el.href = CONFIG.business.phoneHref;
    el.setAttribute("aria-label", `Call ${CONFIG.business.name}`);
  });
  $$("[data-whatsapp]").forEach(el => {
    el.href = whatsappUrl();
    el.setAttribute("aria-label", `WhatsApp ${CONFIG.business.name}`);
  });
  $$("[data-maps]").forEach(el => el.href = CONFIG.business.mapsUrl);
  const mapFrame = $("#mapFrame");
  if (mapFrame) mapFrame.src = CONFIG.business.mapEmbedUrl;
  document.title = `${CONFIG.business.name} | Home Care & Patient Support in Islamabad`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": CONFIG.business.name,
    "description": "Home care and patient care service business in Islamabad.",
    "telephone": CONFIG.business.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tower, Lower Ground, Shop No. 7, Aria Street 2, Markaz FECHS E-11/2, E-11",
      "addressLocality": "Islamabad",
      "postalCode": "44006",
      "addressCountry": "PK"
    },
    "openingHours": "Mo-Su 10:00-22:00",
    "url": "https://YOUR-DOMAIN.example/",
    "sameAs": [CONFIG.business.mapsUrl]
  };
  $("#businessSchema").textContent = JSON.stringify(schema);
}

function renderServices() {
  const grid = $("#serviceGrid");
  const select = $("#appointmentService");
  if (!grid || !select) return;

  grid.innerHTML = services.map((service, index) => `
    <article class="service-card reveal ${index ? `delay-${Math.min(index,4)}` : ""}">
      <div class="service-image"><img src="${escapeHtml(service.image)}" alt="" loading="lazy"></div>
      <div class="service-body">
        <div class="service-icon" aria-hidden="true">${escapeHtml(service.icon)}</div>
        <h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.description)}</p>
        <a href="${whatsappUrl(CONFIG.business.appointmentWhatsappMessage)}" target="_blank" rel="noopener">Request via WhatsApp ↗</a>
      </div>
    </article>
  `).join("");

  select.innerHTML = `<option value="" selected disabled>Select a verified service</option>` +
    services.map(service => `<option value="${escapeHtml(service.title)}">${escapeHtml(service.title)}</option>`).join("");
  observeReveals();
}

let currentReview = 0;
let reviewTimer;

function renderReviews() {
  const track = $("#reviewTrack"), dots = $("#reviewDots");
  if (!track || !dots) return;

  if (!reviews.length) {
    track.innerHTML = `
      <article class="review-card">
        <div class="quote">“</div>
        <p>Authentic Google reviews will appear here after the verified review text is added to the <code>reviews</code> array in <strong>script.js</strong>.</p>
        <strong>Google Reviews</strong>
        <small>View the official listing for the current review content.</small>
      </article>`;
    dots.innerHTML = "";
    return;
  }

  track.innerHTML = reviews.map(review => `
    <article class="review-card">
      <div class="quote">“</div>
      <p>${escapeHtml(review.text)}</p>
      <strong>${escapeHtml(review.name)}</strong>
      <small>${"★".repeat(Math.max(0, Math.min(5, Number(review.rating || 5))))}${review.date ? ` · ${escapeHtml(review.date)}` : ""}</small>
    </article>
  `).join("");

  dots.innerHTML = reviews.map((_, i) =>
    `<button type="button" aria-label="Go to review ${i+1}" data-review-index="${i}" class="${i===0?"active":""}"></button>`
  ).join("");

  $$("#reviewDots button").forEach(btn => btn.addEventListener("click", () => goToReview(Number(btn.dataset.reviewIndex))));
  startReviewAutoplay();
}

function goToReview(index) {
  if (!reviews.length) return;
  currentReview = (index + reviews.length) % reviews.length;
  $("#reviewTrack").style.transform = `translateX(-${currentReview * 100}%)`;
  $$("#reviewDots button").forEach((btn, i) => btn.classList.toggle("active", i === currentReview));
}
function startReviewAutoplay() {
  clearInterval(reviewTimer);
  if (reviews.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reviewTimer = setInterval(() => goToReview(currentReview + 1), 6000);
  }
}

/* ---------- Navigation ---------- */
function initNavigation() {
  const header = $("#siteHeader"), toggle = $("#menuToggle");
  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#scrollProgress").style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  $$("#primaryNav a").forEach(link => link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }));

  $("#backTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Reveal animation ---------- */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  $$(".reveal:not(.visible)").forEach(el => revealObserver.observe(el));
}

/* ---------- Forms / Google Apps Script ---------- */
function formToObject(form) {
  const data = {};
  new FormData(form).forEach((value, key) => { data[key] = String(value).trim(); });
  return data;
}

function validateForm(form) {
  let valid = true;
  $$("[required]", form).forEach(field => {
    const ok = field.value.trim() !== "";
    field.setAttribute("aria-invalid", String(!ok));
    field.style.borderColor = ok ? "" : "#c44b43";
    if (!ok) valid = false;
  });
  const email = $('input[type="email"]', form);
  if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.setAttribute("aria-invalid", "true");
    email.style.borderColor = "#c44b43";
    valid = false;
  }
  return valid;
}

async function submitForm(form) {
  const status = $(".form-status", form);
  const button = $(".form-submit", form) || $("button[type='submit']", form);
  if (!validateForm(form)) {
    status.textContent = "Please complete the required fields.";
    status.className = "form-status error";
    return;
  }

  if (!CONFIG.backend.googleAppsScriptUrl || CONFIG.backend.googleAppsScriptUrl.includes("YOUR_APPS_SCRIPT")) {
    status.textContent = "The form backend is not configured yet. Please contact us directly on WhatsApp.";
    status.className = "form-status error";
    return;
  }

  button.disabled = true;
  button.classList.add("is-loading");
  status.textContent = "Sending securely…";
  status.className = "form-status";

  const payload = formToObject(form);
  payload.formType = form.dataset.formType || "Contact";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(CONFIG.backend.googleAppsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const raw = await response.text();
    let result;
    try { result = JSON.parse(raw); } catch { result = { success: false }; }

    if (!response.ok || !result.success) throw new Error("Submission failed");

    status.textContent = "Submitted successfully.";
    status.className = "form-status success";
    form.reset();

    if (payload.formType === "Appointment") openModal("successModal");
  } catch (error) {
    clearTimeout(timeout);
    status.textContent = "Something went wrong while sending your request. Please try again or contact us directly on WhatsApp.";
    status.className = "form-status error";
  } finally {
    button.disabled = false;
    button.classList.remove("is-loading");
  }
}

function initForms() {
  $$("[data-form]").forEach(form => form.addEventListener("submit", event => {
    event.preventDefault();
    submitForm(form);
  }));
}

/* ---------- Modals / gallery / video ---------- */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.hidden = false; document.body.classList.add("modal-open"); }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.hidden = true;
  if (!$$(".modal:not([hidden])").length) document.body.classList.remove("modal-open");
}
function initMedia() {
  $$(".gallery-item[data-lightbox]").forEach(item => item.addEventListener("click", () => {
    $("#lightboxImage").src = item.dataset.lightbox;
    $("#lightboxImage").alt = item.querySelector("img")?.alt || "Business image";
    $("#lightboxCaption").textContent = item.dataset.caption || "";
    openModal("lightboxModal");
  }));
  $$("[data-close-lightbox]").forEach(el => el.addEventListener("click", () => closeModal("lightboxModal")));

  $("#videoOpen").addEventListener("click", () => openModal("videoModal"));
  $$("[data-close-video]").forEach(el => el.addEventListener("click", () => {
    $("#businessVideo").pause();
    closeModal("videoModal");
  }));

  $$("[data-close-modal]").forEach(el => el.addEventListener("click", () => closeModal("successModal")));

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") $$(".modal:not([hidden])").forEach(m => closeModal(m.id));
  });
}

/* ---------- Review controls + swipe ---------- */
function initReviewControls() {
  $("#reviewPrev").addEventListener("click", () => { goToReview(currentReview - 1); startReviewAutoplay(); });
  $("#reviewNext").addEventListener("click", () => { goToReview(currentReview + 1); startReviewAutoplay(); });

  const windowEl = $(".review-window");
  let startX = 0;
  windowEl.addEventListener("touchstart", e => { startX = e.changedTouches[0].screenX; }, { passive: true });
  windowEl.addEventListener("touchend", e => {
    const delta = e.changedTouches[0].screenX - startX;
    if (Math.abs(delta) > 45) goToReview(currentReview + (delta < 0 ? 1 : -1));
  }, { passive: true });
  windowEl.addEventListener("mouseenter", () => clearInterval(reviewTimer));
  windowEl.addEventListener("mouseleave", startReviewAutoplay);
}

/* ---------- Startup ---------- */
document.addEventListener("DOMContentLoaded", () => {
  setBusinessData();
  renderServices();
  renderReviews();
  initNavigation();
  initForms();
  initMedia();
  initReviewControls();
  observeReveals();
});
