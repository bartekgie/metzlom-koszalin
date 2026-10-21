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
});
