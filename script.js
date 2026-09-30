"use strict";
/* ================= CONFIG: edit client values here ================= */
const CONFIG = {
  business: {
    name: "Islamabad Home Care Services",
    phone: "+923426881984", phoneDisplay: "+92 342 6881984", whatsapp: "923426881984",
    address: "Tower, Lower Ground, Shop No. 7, Aria Street 2, Markaz FECHS E-11/2, E-11, Islamabad, 44006, Pakistan",
    hours: "10:00 AM – 10:00 PM", rating: "4.9", reviewCount: "22",
    mapsUrl: "https://maps.app.goo.gl/Z2REQo4qYFWz86sc8"
  },
  messages: { // pre-filled WhatsApp texts
    general: "Hello Islamabad Home Care Services, I would like to know more about your services.",
    appointment: "Hello Islamabad Home Care Services, I would like to request an appointment.",
    question: "Hello Islamabad Home Care Services, I have a question."
  },
  social: { facebook: "", instagram: "", youtube: "" },
  backend: { googleAppsScriptUrl: "YOUR_APPS_SCRIPT_WEB_APP_URL", timeoutMs: 15000 }
};

/* Only add services the client has verified. Placeholders are NOT real claims. */
const services = [
  { title: "[Home Nursing Care]", description: "[Professional nurses provide healthcare assistance to patients at home, including routine monitoring, medication-related care, and support during recovery.]", icon: "🩺", image: "assets/images/service-01.jpg" },
  { title: "[Patient & Elderly Care]", description: "[Trained attendants assist patients with everyday needs such as feeding, hygiene, mobility, changing positions, and general supervision. Personalized assistance for senior citizens who need help with daily activities, mobility, medication reminders and companionship.]", icon: "❤️", image: "assets/images/service-02.jpg" },
  { title: "[Home Doctor Visits]", description: "[A doctor can potentially visit the patient's home for consultation and basic medical assessment, which is a common service offered by Islamabad home-healthcare providers.]", icon: "🏠", image: "assets/images/service-03.jpg" },
    { title: "[Medical Procedures at Home]", description: "[Essential medical procedures can be provided at home by qualified healthcare professionals when prescribed or medically appropriate. Services may include injections, IV/drip support, wound dressing, catheter care, and vital-sign monitoring.]", icon: "💉", image: "assets/images/service-01.jpg" },
  { title: "[ADD VERIFIED SERVICE]", description: "[ADD VERIFIED DESCRIPTION]", icon: "🧑‍🦽", image: "assets/images/service-02.jpg" },
  { title: "[ADD VERIFIED SERVICE]", description: "[ADD VERIFIED DESCRIPTION]", icon: "👶", image: "assets/images/service-03.jpg" }
];

/* Paste ONLY authentic Google reviews here: { name, rating, text, date } */
const reviews = [];

/* Client-authorized media. type: "image" | "video" */
const gallery = [
  { type: "image", src: "assets/images/image-01.jpg", alt: "Islamabad Home Care Services" },
  { type: "image", src: "assets/images/image-02.jpg", alt: "Home care support" },
  { type: "image", src: "assets/images/image-03.jpg", alt: "Our team" },
  { type: "image", src: "assets/images/image-04.jpg", alt: "Our clinic location" },
  { type: "video", src: "assets/videos/video-01.mp4", alt: "Video" }
];

const why = [
  ["✚", "Professional Care", "[ADD VERIFIED DETAIL]"],
  ["☎", "Convenient Communication", "Reach us by phone or WhatsApp every day."],
  ["♡", "Patient-Focused Support", "[ADD VERIFIED DETAIL]"],
  ["⌖", "Accessible Location", "Find us in Markaz FECHS E-11/2, Islamabad."]
];

/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const B = CONFIG.business;
const waLink = key => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(CONFIG.messages[key] || CONFIG.messages.general)}`;
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyConfig() {
  const vals = { ...B, hoursDaily: `${B.hours.replace(/:00/g, "")} Daily` };
  $$("[data-cfg]").forEach(n => { n.textContent = vals[n.dataset.cfg] ?? ""; });
  $$("[data-tel]").forEach(a => a.href = `tel:${B.phone}`);
  $$("[data-maps]").forEach(a => a.href = B.mapsUrl);
  $$("[data-wa]").forEach(a => a.href = waLink(a.dataset.wa));
  $("#map").src = `https://www.google.com/maps?q=${encodeURIComponent(B.name + " " + B.address)}&output=embed`;
  $$("[data-media]").forEach(n => {
    const img = new Image(); img.onload = () => { n.style.backgroundImage = `url(${n.dataset.media})`; }; img.src = n.dataset.media;
  });
  const soc = Object.entries(CONFIG.social).filter(([, u]) => u);
  $("#social").innerHTML = soc.map(([k, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${k}</a>`).join(" ");
}

/* ================= render ================= */
function renderServices() {
  const grid = $("#services-grid"), sel = $("#service-select");
  services.forEach(s => {
    const c = el("article", "card reveal");
    c.innerHTML = `<div class="img"><img src="${esc(s.image)}" alt="${esc(s.title)}" loading="lazy" width="640" height="400"></div>
      <div class="body"><span class="ic" aria-hidden="true">${s.icon}</span><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p>
      <div class="row"><a class="btn btn-ghost dk" href="#appointment" data-svc="${esc(s.title)}">Learn More</a>
      <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink("appointment")}">WhatsApp</a></div></div>`;
    grid.append(c);
    sel.append(new Option(s.title, s.title));
  });
  sel.append(new Option("Other / Not sure", "Other"));
  grid.addEventListener("click", e => { const a = e.target.closest("[data-svc]"); if (a) sel.value = a.dataset.svc; });
  $("#why-grid").innerHTML = why.map(w => `<div class="why reveal"><span class="ic" aria-hidden="true">${w[0]}</span><h3>${w[1]}</h3><p>${w[2]}</p></div>`).join("");
}

function renderGallery() {
  const g = $("#gallery-grid");
  gallery.forEach((m, i) => {
    const b = el("button", "tile" + (m.type === "video" ? " vid" : ""));
    b.setAttribute("aria-label", "Open " + m.alt);
    b.innerHTML = m.type === "video" ? `<video src="${m.src}" preload="metadata" muted playsinline></video>` : `<img src="${m.src}" alt="${esc(m.alt)}" loading="lazy">`;
    b.addEventListener("click", () => openLightbox(i));
    g.append(b);
  });
  $$("img", g).forEach(i => i.addEventListener("error", () => i.remove()));
}
let lbIndex = 0, lastFocus = null;
function openLightbox(i) {
  lbIndex = (i + gallery.length) % gallery.length; const m = gallery[lbIndex];
  $("#lb-body").innerHTML = m.type === "video" ? `<video src="${m.src}" controls autoplay playsinline></video>` : `<img src="${m.src}" alt="${esc(m.alt)}">`;
  lastFocus = document.activeElement; $("#lightbox").hidden = false; $("#lb-x").focus();
}
function closeModal(m) { m.hidden = true; $("#lb-body").innerHTML = ""; lastFocus && lastFocus.focus(); }

/* ================= reviews carousel ================= */
function initCarousel() {
  const track = $("#track"), dots = $("#dots"), box = $("#carousel");
  if (!reviews.length) {
    track.innerHTML = `<div class="slide"><blockquote><p>Read what our patients say about us on Google.</p></blockquote></div>`;
    $(".car-ctl").hidden = true; return;
  }
  let cur = 0, timer;
  reviews.forEach((r, i) => {
    track.append(el("div", "slide", `<blockquote><span class="stars" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}</span><p>${esc(r.text)}</p>
      <footer>${esc(r.name)} ${r.date ? `<small>· ${esc(r.date)}</small>` : ""}</footer></blockquote>`));
    const d = el("button"); d.setAttribute("aria-label", `Review ${i + 1}`); d.onclick = () => go(i); dots.append(d);
  });
  const go = i => {
    cur = (i + reviews.length) % reviews.length; track.style.transform = `translateX(-${cur * 100}%)`;
    $$("button", dots).forEach((d, k) => d.setAttribute("aria-current", k === cur));
  };
  const play = () => { if (!reduced) timer = setInterval(() => go(cur + 1), 6000); }, stop = () => clearInterval(timer);
  $("#prev").onclick = () => go(cur - 1); $("#next").onclick = () => go(cur + 1);
  box.addEventListener("mouseenter", stop); box.addEventListener("mouseleave", play); box.addEventListener("focusin", stop);
  box.addEventListener("keydown", e => { if (e.key === "ArrowLeft") go(cur - 1); if (e.key === "ArrowRight") go(cur + 1); });
  let x0 = null; track.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
  track.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });
  go(0); play();
}

/* ================= forms ================= */
const phoneOk = v => /^\+?[0-9\s\-]{10,15}$/.test(v.trim());
function validate(form) {
  let ok = true;
  $$("input,select,textarea", form).forEach(f => {
    const err = f.parentElement.querySelector(".err"); if (!err) return;
    let msg = "";
    const v = f.value.trim();
    if (f.required && !v) msg = "This field is required.";
    else if (v && f.type === "tel" && !phoneOk(v)) msg = "Enter a valid phone number.";
    else if (v && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email address.";
    err.textContent = msg; f.setAttribute("aria-invalid", !!msg); if (msg) ok = false;
  });
  const rs = $("#rating-set", form);
  if (rs) { const bad = !$("input:checked", rs); $("#rating-err").textContent = bad ? "Please choose a star rating." : ""; if (bad) ok = false; }
  if (!ok) $("[aria-invalid=true]", form)?.focus();
  return ok;
}
async function submitForm(form) {
  const msgBox = $(".form-err", form), btn = $("button[type=submit]", form), label = btn.textContent;
  msgBox.hidden = true;
  if (!validate(form)) return;
  const data = Object.fromEntries(new FormData(form)); data.formType = form.dataset.type;
  if (data.website) return; // honeypot
  if (CONFIG.backend.googleAppsScriptUrl.startsWith("YOUR_")) return fail("Something went wrong while sending your request.");
  btn.disabled = true; btn.textContent = "Sending…";
  const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), CONFIG.backend.timeoutMs);
  try {
    // text/plain avoids a CORS preflight, which Apps Script does not support
    const res = await fetch(CONFIG.backend.googleAppsScriptUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data), signal: ctrl.signal });
    const json = await res.json();
    if (!json.success) throw new Error("backend");
    form.reset(); lastFocus = document.activeElement;
    const m = $("#modal"); $("#m-title").textContent = form.dataset.type === "appointment" ? "Appointment Request Received" : "Message Received";
    const fbk = form.dataset.type === "feedback"; if (fbk) { $("#m-title").textContent = "Thank You for Your Feedback"; $("#m-text").textContent = "Your feedback has been sent to our team."; } else { $("#m-text").textContent = "Thank you. Our team will contact you shortly to confirm your request."; }
    m.hidden = false; $("#m-close").focus();
  } catch (e) { fail("Something went wrong while sending your request."); }
  finally { clearTimeout(t); btn.disabled = false; btn.textContent = label; }
  function fail(text) {
    msgBox.innerHTML = `${text} Please try again or <a href="${waLink("appointment")}" target="_blank" rel="noopener">contact us directly on WhatsApp</a>.`; msgBox.hidden = false;
  }
}

/* ================= scroll & UI ================= */
function initScroll() {
  const nav = $("#nav"), bar = $("#progress"), top = $("#totop"), steps = $("#steps");
  const links = $$(".menu a"), secs = links.map(a => $(a.getAttribute("href")));
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle("scrolled", y > 40); bar.style.width = (y / h * 100) + "%"; top.classList.toggle("show", y > 600);
    const r = steps.getBoundingClientRect(); steps.style.setProperty("--line", Math.min(1, Math.max(0, (innerHeight * .8 - r.top) / r.height)));
    if (!reduced) $(".hero-media").style.transform = `translateY(${y * .15}px) scale(1.05)`;
    let idx = 0; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 120) idx = i; });
    links.forEach((a, i) => a.classList.toggle("active", i === idx));
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  top.onclick = () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".reveal").forEach(n => io.observe(n));
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const end = +e.target.textContent, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 1200); e.target.textContent = Math.round(end * p); if (p < 1) requestAnimationFrame(step); };
    reduced ? 0 : requestAnimationFrame(step);
  }));
  $$("[data-count]").forEach(n => co.observe(n));
}
function initMenu() {
  const b = $("#burger"), m = $("#menu");
  const set = o => { m.classList.toggle("open", o); b.setAttribute("aria-expanded", o); document.body.style.overflow = o ? "hidden" : ""; };
  b.onclick = () => set(!m.classList.contains("open"));
  $$("a", m).forEach(a => a.addEventListener("click", () => set(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") { set(false); [$("#modal"), $("#lightbox")].forEach(x => !x.hidden && closeModal(x)); } if (!$("#lightbox").hidden) { if (e.key === "ArrowRight") openLightbox(lbIndex + 1); if (e.key === "ArrowLeft") openLightbox(lbIndex - 1); } });
}
function initVideo() {
  const v = $("#promo"), o = $("#video-over");
  $("#play").onclick = () => { o.classList.add("off"); v.play(); };
  v.addEventListener("pause", () => { if (v.ended) o.classList.remove("off"); });
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig(); renderServices(); renderGallery(); initCarousel(); initScroll(); initMenu(); initVideo();
  $$("form[data-type]").forEach(f => {
    f.addEventListener("submit", e => { e.preventDefault(); submitForm(f); });
    f.addEventListener("input", e => { if (e.target.getAttribute("aria-invalid") === "true") validate(f); });
  });
  const d = $("input[name=date]"); if (d) d.min = new Date().toISOString().slice(0, 10);
  $("#m-close").onclick = () => closeModal($("#modal")); $("#lb-x").onclick = () => closeModal($("#lightbox"));
  [$("#modal"), $("#lightbox")].forEach(m => m.addEventListener("click", e => { if (e.target === m) closeModal(m); }));
  $$("img").forEach(i => i.addEventListener("error", () => { i.style.visibility = "hidden"; }));
});
