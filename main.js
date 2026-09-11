(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var form = document.getElementById("waitlist-form");
  var statusEl = document.getElementById("form-status");
  var emailInput = document.getElementById("email");

  function setMenu(open) {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      mobileNav.removeAttribute("hidden");
    } else {
      mobileNav.setAttribute("hidden", "");
    }
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  if (form && statusEl && emailInput) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        statusEl.textContent = "Enter a valid email so we can find you when invites open.";
        emailInput.focus();
        return;
      }

      try {
        var existing = JSON.parse(localStorage.getItem("palheim-waitlist") || "[]");
        if (!Array.isArray(existing)) existing = [];
        if (existing.indexOf(email) === -1) {
          existing.push(email);
          localStorage.setItem("palheim-waitlist", JSON.stringify(existing));
        }
      } catch (_) {
        // localStorage may be blocked; still show success for the stub
      }

      statusEl.textContent =
        "You're on the list (local stub). We'll wire real invites when the Viking can carry wood.";
      form.reset();
    });
  }
})();
