(() => {
  "use strict";
  window.$ = (id) => document.getElementById(id);
  // Password/login gate removed as requested.
  // This only removes the front-end gate; it does NOT secure database access.
  window.requireLogin = function () {
    return true;
  };
  window.getConfig = () => ({
    url: localStorage.getItem("sb_url") || "",
    key: localStorage.getItem("sb_key") || ""
  });
  window.getClient = () => {
    const cfg = window.getConfig();
    if (!cfg.url || !cfg.key || !window.supabase?.createClient) return null;
    try { return window.supabase.createClient(cfg.url, cfg.key); }
    catch (error) { console.error("Supabase configuration error", error); return null; }
  };
  window.getPrefs = () => ({
    gst: Number(localStorage.getItem("sb_default_gst") ?? "5"),
    discount: Number(localStorage.getItem("sb_default_discount") ?? "0"),
    prefix: localStorage.getItem("sb_invoice_prefix") || "INV"
  });
  window.money = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR"
  }).format(Number(value) || 0);
  // Local demo fallback only. Real shared business data must use Supabase Auth + RLS.
  window.localDemo = (key) => {
    try { return JSON.parse(localStorage.getItem("demo_" + key) || "[]"); }
    catch { return []; }
  };
  window.saveDemo = (key, data) => localStorage.setItem("demo_" + key, JSON.stringify(data));
  window.logout = () => {
    // No login screen is used. Keep the button from sending users into a redirect loop.
    window.location.assign(new URL("dashboard.html", window.location.href).href);
  };
  document.addEventListener("DOMContentLoaded", () => {
    const button = window.$("logout");
    if (button) {
      button.textContent = "ড্যাশবোর্ড";
      button.addEventListener("click", window.logout);
    }
  });
  window.escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
  window.requireLogin();
})();
