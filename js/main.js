/* ============================================
   LatinEnglish Landing Page - Main JavaScript
   Carousel, Theme Toggle, Mobile Nav, Animations
   ============================================ */

(function () {
  "use strict";

  // ========== THEME TOGGLE ==========
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem("latinenglish-theme") || "light";
  body.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", function () {
    const current = body.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    body.setAttribute("data-theme", next);
    localStorage.setItem("latinenglish-theme", next);
  });

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById("navbar");

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // ========== MOBILE NAV ==========
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
    body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      body.style.overflow = "";
    });
  });

  // ========== HERO CAROUSEL ==========
  const slides = document.querySelectorAll(".carousel-slide");
  const dotsContainer = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  let currentSlide = 0;
  let autoplayInterval;

  // Create dots
  slides.forEach(function (_, index) {
    var dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    dot.setAttribute("aria-label", "Ir a imagen " + (index + 1));
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", function () {
      goToSlide(index);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  var dots = dotsContainer.querySelectorAll(".carousel-dot");

  function goToSlide(index) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  nextBtn.addEventListener("click", function () {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener("click", function () {
    prevSlide();
    resetAutoplay();
  });

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();

  // Pause autoplay on hover
  var heroEl = document.getElementById("hero");
  heroEl.addEventListener("mouseenter", function () {
    clearInterval(autoplayInterval);
  });
  heroEl.addEventListener("mouseleave", function () {
    startAutoplay();
  });

  // Touch swipe for carousel
  var touchStartX = 0;
  var touchEndX = 0;

  heroEl.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  heroEl.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoplay();
      }
    },
    { passive: true },
  );

  // ========== SCROLL ANIMATIONS ==========
  var animatedElements = document.querySelectorAll("[data-aos]");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add stagger delay for grid children
          var parent = entry.target.parentElement;
          if (parent) {
            var siblings = parent.querySelectorAll("[data-aos]");
            var index = Array.prototype.indexOf.call(siblings, entry.target);
            entry.target.style.transitionDelay = index * 0.1 + "s";
          }
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  animatedElements.forEach(function (el) {
    observer.observe(el);
  });

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ========== CONTACT FORM ==========
  var contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();

    if (!name || !email || !message) return;

    // Simple email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Por favor, ingresa un email válido.");
      return;
    }

    var btn = contactForm.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    btn.textContent = "¡Mensaje Enviado! ✓";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    contactForm.reset();

    setTimeout(function () {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = "1";
    }, 3000);
  });

  // ========== KEYBOARD SUPPORT ==========
  document.addEventListener("keydown", function (e) {
    // ESC closes mobile nav
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      body.style.overflow = "";
    }

    // Arrow keys for carousel when hero is in view
    var heroRect = heroEl.getBoundingClientRect();
    var heroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;
    if (heroVisible) {
      if (e.key === "ArrowLeft") {
        prevSlide();
        resetAutoplay();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        resetAutoplay();
      }
    }
  });
})();
