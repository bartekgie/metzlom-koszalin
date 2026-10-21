document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");
    var list = dropdown.querySelector(".nav-dropdown-list");
    if (!toggle || !list) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = !list.hidden;
      list.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-dropdown-list").forEach(function (list) {
      list.hidden = true;
    });
    document.querySelectorAll(".nav-dropdown-toggle").forEach(function (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
