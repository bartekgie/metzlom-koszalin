document.addEventListener("DOMContentLoaded", function () {
  // --- Delikatne pojawianie się sekcji przy scrollu ---
  var revealEls = document.querySelectorAll(".reveal-on-scroll");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is--visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // brak wsparcia dla IntersectionObserver — po prostu pokaż od razu
      revealEls.forEach(function (el) {
        el.classList.add("is--visible");
      });
    }
  }

  // --- Galeria: strzałki przewijają o jeden kadr ---
  var track = document.querySelector(".gallery-track");
  var prevBtn = document.querySelector(".gallery-nav-prev");
  var nextBtn = document.querySelector(".gallery-nav-next");

  if (track && prevBtn && nextBtn) {
    var scrollByOneSlide = function (direction) {
      var slide = track.querySelector(".gallery-slide");
      if (!slide) return;
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var amount = (slide.getBoundingClientRect().width + gap) * direction;
      track.scrollBy({ left: amount, behavior: "smooth" });
    };

    prevBtn.addEventListener("click", function () {
      scrollByOneSlide(-1);
    });
    nextBtn.addEventListener("click", function () {
      scrollByOneSlide(1);
    });
  }

  // --- Delikatna paralaksa zdjęcia hero (np. "Skup złomu") ---
  var parallaxImgs = document.querySelectorAll(".photo-hero-full img");
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (parallaxImgs.length && !reduceMotion) {
    var ticking = false;

    var updateParallax = function () {
      parallaxImgs.forEach(function (img) {
        var rect = img.parentElement.getBoundingClientRect();
        var elementCenter = rect.top + rect.height / 2;
        var viewportCenter = window.innerHeight / 2;
        var offset = (viewportCenter - elementCenter) * 0.08;
        offset = Math.max(-30, Math.min(30, offset));
        img.style.transform = "translateY(" + offset.toFixed(1) + "px)";
      });
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateParallax();
  }

  // --- Delikatne pojawianie się zdjęć treściowych po załadowaniu ---
  var lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  lazyImgs.forEach(function (img) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("is--loaded");
    } else {
      img.addEventListener("load", function () {
        img.classList.add("is--loaded");
      });
      img.addEventListener("error", function () {
        img.classList.add("is--loaded");
      });
    }
  });

  // --- Lightbox galerii: pełnoekranowy podgląd po kliknięciu zdjęcia ---
  var lightbox = document.getElementById("lightbox");
  var gallerySlideImgs = document.querySelectorAll(".gallery-slide img");

  if (lightbox && gallerySlideImgs.length) {
    var lightboxImg = lightbox.querySelector(".lightbox-img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn2 = lightbox.querySelector(".lightbox-prev");
    var nextBtn2 = lightbox.querySelector(".lightbox-next");
    var images = Array.prototype.slice.call(gallerySlideImgs);
    var currentIndex = 0;
    var lastFocused = null;

    var showImage = function (index) {
      currentIndex = (index + images.length) % images.length;
      var img = images[currentIndex];
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "";
    };

    var openLightbox = function (index) {
      lastFocused = document.activeElement;
      showImage(index);
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    var closeLightbox = function () {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      lightboxImg.src = "";
      if (lastFocused) {
        lastFocused.focus();
      }
    };

    images.forEach(function (img, index) {
      img.closest(".gallery-slide").addEventListener("click", function () {
        openLightbox(index);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn2.addEventListener("click", function () {
      showImage(currentIndex - 1);
    });
    nextBtn2.addEventListener("click", function () {
      showImage(currentIndex + 1);
    });

    // klik na tło (poza zdjęciem i przyciskami) też zamyka
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });
  }
});
