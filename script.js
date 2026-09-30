const CONFIG = {
  business: {
    name: "Islamabad Home Care Services",
    legalName: "Islamabad Home Care Services Pvt. Ltd.",
    category: "Home Care / Healthcare / Patient Care Services",
    phone: "+923426881984",
    whatsapp: "923426881984",
    address: "Tower, Lower Ground, Shop No. 7, Aria Street 2, Markaz FECHS E-11/2, E-11, Islamabad 44006, Pakistan",
    hours: "10:00 AM – 10:00 PM",
    rating: "4.9",
    reviewCount: "22",
    mapsUrl: "https://maps.app.goo.gl/Z2REQo4qYFWz86sc8"
  },
  backend: {
    googleAppsScriptUrl: "YOUR_APPS_SCRIPT_WEB_APP_URL"
  },
  whatsappMessages: {
    general: "Hello Islamabad Home Care Services, I would like to know more about your services.",
    appointment: "Hello Islamabad Home Care Services, I would like to request an appointment."
  }
};

const services = [
  {title:"Doctor Home Visit", image:"assets/images/ihcs-promo-01.jpg", desc:"Home-focused doctor visit service shown in the client's promotional material."},
  {title:"Male & Female Nurses", image:"assets/images/ihcs-promo-02.jpg", desc:"Male and female nursing support as presented by IHCS."},
  {title:"Home Nursing Care", image:"assets/images/ihcs-promo-02.jpg", desc:"Home nursing care presented in the official IHCS material."},
  {title:"Patient Care", image:"assets/images/ihcs-promo-02.jpg", desc:"Patient-care support shown in the business's promotional material."},
  {title:"Patient Attendant Services", image:"assets/images/ihcs-promo-02.jpg", desc:"Patient attendant services listed in the supplied business material."},
  {title:"Elderly Care", image:"assets/images/ihcs-promo-02.jpg", desc:"Elderly-care support shown in the supplied IHCS material."},
  {title:"Injection & IV Drip Services", image:"assets/images/ihcs-promo-01.jpg", desc:"Injection and IV drip services listed in the supplied material."},
  {title:"Cannula & Dressing", image:"assets/images/ihcs-promo-02.jpg", desc:"Cannula and dressing service listed by the business."},
  {title:"ECG & Echo", image:"assets/images/ihcs-promo-01.jpg", desc:"ECG and Echo services listed in the supplied business material."},
  {title:"BP & Sugar Check", image:"assets/images/ihcs-promo-01.jpg", desc:"Blood-pressure and sugar-check service shown in the supplied material."},
  {title:"Dressing & Wound Care", image:"assets/images/ihcs-promo-01.jpg", desc:"Dressing and wound-care service listed in the supplied material."},
  {title:"Physiotherapy", image:"assets/images/ihcs-promo-01.jpg", desc:"Physiotherapy service shown in the official promotional material."},
  {title:"24/7 Home Medical Services", image:"assets/images/ihcs-promo-02.jpg", desc:"24/7 home medical services are highlighted in the supplied business graphics."}
];

/* Add only authentic, client-provided/verified Google reviews here.
const reviews = [
  {name:"Verified customer", rating:5, text:"Authentic Google review text.", date:"2026"}
];
*/
const reviews = [];

const $ = (selector, scope=document) => scope.querySelector(selector);
const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  wireBusinessLinks();
  renderServices();
  setupNavigation();
  setupReveal();
  setupScrollUI();
  setupForms();
  setupGallery();
  setupModal();
  renderReviews();
  setMinDate();
});

function wireBusinessLinks(){
  $$("[data-whatsapp]").forEach(a => {
    const message = encodeURIComponent(CONFIG.whatsappMessages.general);
    a.href = `https://wa.me/${CONFIG.business.whatsapp}?text=${message}`;
  });
  $$("[data-phone]").forEach(a => a.href = `tel:${CONFIG.business.phone}`);
  $$("[data-maps]").forEach(a => a.href = CONFIG.business.mapsUrl);
}

function renderServices(){
  const grid = $("#servicesGrid");
  const select = $("#appointmentService");
  services.forEach((service, i) => {
    const card = document.createElement("article");
    card.className = "service-card reveal";
    card.innerHTML = `
      <div class="service-image"><img src="${service.image}" alt="${escapeHTML(service.title)}" loading="lazy"></div>
      <div class="service-body">
        <span class="service-no">SERVICE ${String(i+1).padStart(2,"0")}</span>
        <h3>${escapeHTML(service.title)}</h3>
        <p>${escapeHTML(service.desc)}</p>
        <div class="service-actions">
          <a href="#appointment" data-service="${escapeHTML(service.title)}">Request service</a>
          <a target="_blank" rel="noopener" href="https://wa.me/${CONFIG.business.whatsapp}?text=${encodeURIComponent("Hello Islamabad Home Care Services, I would like to ask about " + service.title + ".")}">WhatsApp</a>
        </div>
      </div>`;
    grid.appendChild(card);

    const option = document.createElement("option");
    option.value = service.title;
    option.textContent = service.title;
    select.appendChild(option);
  });

  $$("[data-service]").forEach(link => link.addEventListener("click", () => {
    setTimeout(() => {
      select.value = link.dataset.service;
      $("#appointment").scrollIntoView({behavior:"smooth", block:"start"});
    }, 50);
  });
}

function setupNavigation(){
  const header = $("#siteHeader"), toggle = $("#menuToggle"), links = $("#navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
  }));
}

function setupReveal(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  $$(".reveal").forEach(el => observer.observe(el));
}

function setupScrollUI(){
  const header = $("#siteHeader"), top = $("#backTop"), progress = $("#scrollProgress");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
    top.classList.toggle("show", window.scrollY > 650);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : "0%";
  }, {passive:true});
  top.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
}

function setupForms(){
  $("#appointmentForm").addEventListener("submit", e => handleForm(e, "appointment", $("#appointmentMessage")));
  $("#contactForm").addEventListener("submit", e => handleForm(e, "contact", $("#contactMessage")));
}

async function handleForm(event, formType, messageEl){
  event.preventDefault();
  const form = event.currentTarget;
  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }
  const button = $("button[type='submit']", form);
  button.classList.add("loading");
  button.disabled = true;
  messageEl.textContent = "";
  messageEl.className = "form-message";

  const payload = {formType};
  new FormData(form).forEach((value,key) => payload[key] = String(value).trim());

  if(!CONFIG.backend.googleAppsScriptUrl || CONFIG.backend.googleAppsScriptUrl.includes("YOUR_APPS_SCRIPT")){
    button.classList.remove("loading");
    button.disabled = false;
    messageEl.textContent = "Backend not connected yet. Add your Google Apps Script Web App URL in script.js.";
    messageEl.classList.add("error");
    return;
  }

  try{
    const response = await fetch(CONFIG.backend.googleAppsScriptUrl, {
      method:"POST",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload)
    });
    const data = await response.json();
    if(!response.ok || data.success !== true) throw new Error(data.message || "Submission failed");
    form.reset();
    messageEl.textContent = "Submitted successfully.";
    messageEl.classList.add("success");
    $("#successModal").classList.add("open");
    $("#successModal").setAttribute("aria-hidden","false");
  }catch(error){
    console.error(error);
    messageEl.textContent = "Something went wrong while sending your request. Please try again or contact us directly on WhatsApp.";
    messageEl.classList.add("error");
  }finally{
    button.classList.remove("loading");
    button.disabled = false;
  }
}

function setupGallery(){
  const lightbox = $("#lightbox"), img = $("#lightboxImage");
  $$(".gallery-item").forEach(item => item.addEventListener("click", () => {
    img.src = item.dataset.image;
    img.alt = $("img", item).alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden","false");
  }));
  $("#lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => {if(e.target === lightbox) closeLightbox()});
  document.addEventListener("keydown", e => {if(e.key === "Escape") closeLightbox()});
  function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");}
}

function setupModal(){
  const modal = $("#successModal");
  const close = () => {modal.classList.remove("open");modal.setAttribute("aria-hidden","true")};
  $("#modalClose").addEventListener("click", close);
  $("#modalDone").addEventListener("click", close);
  modal.addEventListener("click", e => {if(e.target === modal) close()});
}

function renderReviews(){
  if(!reviews.length) return;
  const wrap = $("#reviewWrap"), track = $("#reviewTrack"), dots = $("#reviewDots");
  $(".reviews-placeholder").hidden = true; wrap.hidden = false;
  let index = 0;
  reviews.forEach((review, i) => {
    const card = document.createElement("article");
    card.className = "review-card";
    card.innerHTML = `<div class="review-stars">${"★".repeat(Math.min(5,Math.max(1,review.rating)))}</div><h3>${escapeHTML(review.name)}</h3><p>${escapeHTML(review.text)}</p><small>${escapeHTML(review.date || "")}</small>`;
    track.appendChild(card);
    const dot = document.createElement("button");
    dot.className = "dot-btn" + (i===0 ? " active":"");
    dot.setAttribute("aria-label",`Go to review ${i+1}`);
    dot.addEventListener("click",()=>go(i));
    dots.appendChild(dot);
  });
  function go(i){
    index = (i + reviews.length) % reviews.length;
    const card = track.children[index];
    track.scrollTo({left:card.offsetLeft,behavior:"smooth"});
    $$(".dot-btn", dots).forEach((d,n)=>d.classList.toggle("active",n===index));
  }
  $("#reviewPrev").onclick=()=>go(index-1);
  $("#reviewNext").onclick=()=>go(index+1);
}

function setMinDate(){
  const date = document.querySelector('input[name="preferredDate"]');
  if(date){
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset()*60000).toISOString().split("T")[0];
    date.min = local;
  }
}

function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}
