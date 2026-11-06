const $ = id => document.getElementById(id);
function requireLogin(){ if(sessionStorage.getItem("sb_logged_in")!=="yes") location.href="index.html"; }
requireLogin();
function getConfig(){return {url:localStorage.getItem("sb_url")||"",key:localStorage.getItem("sb_key")||""};}
function getClient(){const c=getConfig();if(!c.url||!c.key||!window.supabase)return null;return window.supabase.createClient(c.url,c.key);}
function getPrefs(){return {gst:Number(localStorage.getItem("sb_default_gst")??"5"),discount:Number(localStorage.getItem("sb_default_discount")??"0"),prefix:localStorage.getItem("sb_invoice_prefix")||"INV"};}
function money(n){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(Number(n)||0);}
function localDemo(key){try{return JSON.parse(localStorage.getItem("demo_"+key)||"[]")}catch{return []}}
function saveDemo(key,data){localStorage.setItem("demo_"+key,JSON.stringify(data))}
function logout(){sessionStorage.removeItem("sb_logged_in");location.href="index.html";}
document.addEventListener("DOMContentLoaded",()=>{const b=$("logout");if(b)b.addEventListener("click",logout);});