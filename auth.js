// Demo-only password gate. Replace with the server-side auth flow described in SECURITY.md before public deployment.
const DEFAULT_DEMO_PASSWORD = "AK1234";
const stored = sessionStorage.getItem("sb_demo_password") || DEFAULT_DEMO_PASSWORD;
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const entered = document.getElementById("password").value;
  if (entered === (sessionStorage.getItem("sb_demo_password") || DEFAULT_DEMO_PASSWORD)) {
    sessionStorage.setItem("sb_logged_in", "yes");
    location.href = "dashboard.html";
  } else {
    document.getElementById("error").textContent = "পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।";
  }
});