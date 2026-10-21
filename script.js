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


// Hide the short blue circular loader used on inner pages.
(() => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const hideLoader = () => {
    window.setTimeout(() => loader.classList.add('is-hidden'), 500);
    window.setTimeout(() => loader.remove(), 650);
  };
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });
  window.setTimeout(hideLoader, 250);
})();

// Show the delivery-truck splash screen only on the homepage, where its markup exists.
(() => {
  const loader = document.getElementById('cooking-loader');
  if (!loader) return;

  const hideCookingLoader = () => {
    window.setTimeout(() => loader.classList.add('is-hidden'), 500);
    window.setTimeout(() => loader.remove(), 750);
  };
  if (document.readyState === 'complete') hideCookingLoader();
  else window.addEventListener('load', hideCookingLoader, { once: true });
  // Fallback for slow image/network loads.
  window.setTimeout(hideCookingLoader, 500);
})();
