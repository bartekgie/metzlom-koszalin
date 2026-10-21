(function () {
  var STORAGE_KEY = "metzlom_consent";
  var stored = localStorage.getItem(STORAGE_KEY);

  function updateConsent(granted) {
    if (typeof gtag !== "function") return;
    var state = granted ? "granted" : "denied";
    gtag("consent", "update", {
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state
    });
  }

  if (stored === "granted") {
    updateConsent(true);
    return;
  }

  if (stored === "denied") {
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var banner = document.getElementById("consent-banner");
    if (!banner) return;
    banner.hidden = false;

    var acceptBtn = document.getElementById("consent-accept");
    var declineBtn = document.getElementById("consent-decline");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        localStorage.setItem(STORAGE_KEY, "granted");
        updateConsent(true);
        banner.hidden = true;
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener("click", function () {
        localStorage.setItem(STORAGE_KEY, "denied");
        banner.hidden = true;
      });
    }
  });
})();
