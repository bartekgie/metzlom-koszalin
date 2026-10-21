document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");
    var label = dropdown.querySelector(".nav-dropdown-label");
    var list = dropdown.querySelector(".nav-dropdown-list");
    if (!toggle || !list) return;

    var toggleDropdown = function (e) {
      e.stopPropagation();
      var isOpen = !list.hidden;
      list.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
    };

    toggle.addEventListener("click", toggleDropdown);
    // Napis "oferta" (nie tylko strzałka obok) też otwiera/zamyka submenu —
    // dotyczy to zarówno hamburgera na mobile, jak i paska na desktopie.
    if (label) {
      label.addEventListener("click", toggleDropdown);
    }
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-dropdown-list").forEach(function (list) {
      list.hidden = true;
    });
    document.querySelectorAll(".nav-dropdown-toggle").forEach(function (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // --- Realna wysokość navbara jako zmienna CSS ---
  // Rozwinięty panel mobilny (.nav-menu[data-nav-menu-open]) jest
  // zakotwiczony do viewportu (position:fixed) i musi zaczynać się
  // dokładnie pod navbarem. Sztywna wartość w CSS rozjeżdżała się przy
  // zmianie wysokości navbara (np. górny pasek kontaktowy chowany na
  // mobile) — stąd przerwa z widocznym hero pod spodem.
  var navbar = document.querySelector(".navbar");
  if (navbar) {
    var updateNavbarHeight = function () {
      document.documentElement.style.setProperty(
        "--navbar-height",
        navbar.getBoundingClientRect().height + "px"
      );
    };
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);
    window.addEventListener("orientationchange", updateNavbarHeight);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateNavbarHeight);
    }
  }
});
