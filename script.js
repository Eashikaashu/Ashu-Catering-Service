const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("open");
      menuToggle.focus();
    }
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const sections = document.querySelectorAll("main section[id], main section.hero");
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id || "top";
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === (id === "top" ? "#top" : `#${id}`);
        link.classList.toggle("active", active);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => observer.observe(section));
}


/* Hero food-photo slideshow */
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const slideDots = Array.from(document.querySelectorAll(".slide-dot"));
const previousSlide = document.querySelector(".slide-prev");
const nextSlide = document.querySelector(".slide-next");
const heroSlideshow = document.querySelector(".hero-slideshow");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentSlide = 0;
let slideshowTimer;

function showHeroSlide(index) {
  if (!heroSlides.length) return;
  currentSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle("is-active", i === currentSlide));
  slideDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === currentSlide);
    dot.setAttribute("aria-pressed", String(i === currentSlide));
  });
}

function stopHeroSlideshow() {
  window.clearInterval(slideshowTimer);
}

function startHeroSlideshow() {
  stopHeroSlideshow();
  if (heroSlides.length > 1 && !reduceMotion.matches && !document.hidden) {
    slideshowTimer = window.setInterval(() => showHeroSlide(currentSlide + 1), 5500);
  }
}

if (heroSlides.length) {
  slideDots.forEach((dot, i) => dot.addEventListener("click", () => {
    showHeroSlide(i);
    startHeroSlideshow();
  }));
  previousSlide?.addEventListener("click", () => {
    showHeroSlide(currentSlide - 1);
    startHeroSlideshow();
  });
  nextSlide?.addEventListener("click", () => {
    showHeroSlide(currentSlide + 1);
    startHeroSlideshow();
  });
  heroSlideshow?.addEventListener("mouseenter", stopHeroSlideshow);
  heroSlideshow?.addEventListener("mouseleave", startHeroSlideshow);
  heroSlideshow?.addEventListener("focusin", stopHeroSlideshow);
  heroSlideshow?.addEventListener("focusout", startHeroSlideshow);
  document.addEventListener("visibilitychange", startHeroSlideshow);
  reduceMotion.addEventListener?.("change", startHeroSlideshow);
  startHeroSlideshow();
}

/* Reveal content as sections enter the viewport. */
if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealTargets = document.querySelectorAll(
    ".intro-visual, .intro-copy, .section-heading, .service-card, .quote-band > *, .gallery-item, .contact-text, .contact-action"
  );
  revealTargets.forEach((item) => item.classList.add("reveal-ready"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach((item) => revealObserver.observe(item));
}


// Keep the delivery-truck splash screen brief.
(() => {
  const hideCookingLoader = () => {
    let loader = document.getElementById('cooking-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'cooking-loader';
      loader.id = 'cooking-loader';
      loader.setAttribute('role', 'status');
      loader.setAttribute('aria-label', 'Loading Ashu Catering Service');
      loader.innerHTML = '<div class="truck-road"><div class="loader-truck" aria-hidden="true"><svg viewBox="0 0 120 64"><path d="M7 12h65v36H7zM72 25h22l17 16v7H72z" fill="#fff" stroke="#111" stroke-width="3" stroke-linejoin="round"/><path d="M82 29h10l12 12H82z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M15 20h49v19H15z" fill="#111"/><path d="M22 26h35M22 32h25" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="27" cy="49" r="9" fill="#fff" stroke="#111" stroke-width="4"/><circle cx="91" cy="49" r="9" fill="#fff" stroke="#111" stroke-width="4"/><circle cx="27" cy="49" r="3" fill="#111"/><circle cx="91" cy="49" r="3" fill="#111"/></svg></div><span class="road-line"></span></div><p>On the way with something delicious<span class="loader-dots">...</span></p>';
      document.body.prepend(loader);
    }
    window.setTimeout(() => loader.classList.add('is-hidden'), 500);
    window.setTimeout(() => loader.remove(), 750);
  };
  if (document.readyState === 'complete') hideCookingLoader();
  else window.addEventListener('load', hideCookingLoader, { once: true });
  // Fallback for slow image/network loads.
  window.setTimeout(hideCookingLoader, 500);
})();
