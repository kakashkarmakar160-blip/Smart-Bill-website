(() => {
  "use strict";
  const DEFAULT_PASSWORD = "AK1234";
  const form = document.getElementById("loginForm");
  const input = document.getElementById("password");
  const error = document.getElementById("error");
  if (!form || !input || !error) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    const savedPassword = sessionStorage.getItem("sb_demo_password") || DEFAULT_PASSWORD;
    if (input.value === savedPassword) {
      sessionStorage.setItem("sb_logged_in", "yes");
      // Relative navigation works on GitHub Pages project sites.
      window.location.assign(new URL("dashboard.html", window.location.href).href);
    } else {
      error.textContent = "পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।";
      input.value = "";
      input.focus();
    }
  });
})();
