// ========== Basit yerel kimlik doğrulama ==========
// NOT: Üretimde gerçek bir backend gerekir. Bu demo sadece localStorage ile çalışır.

const DEMO_EMAIL = "hknngnr36@gmail.com";
const DEMO_PASS  = "voltai";

const sel = (q) => document.querySelector(q);
const $status = sel("#conn-status");
const $login  = sel("#login");
const $dash   = sel("#dashboard");
const $form   = sel("#login-form");
const $email  = sel("#admin-email");
const $pass   = sel("#admin-pass");
const $btn    = sel("#login-btn");
const $logout = sel("#logout-btn");
const $toast  = sel("#toast");

function setStatus(connected) {
  if (connected) {
    $status.textContent = "Durum: Bağlandı";
    $status.classList.add("ok");
  } else {
    $status.textContent = "Durum: Bağlantı yok";
    $status.classList.remove("ok");
  }
}

function showToast(msg, type = "info") {
  $toast.textContent = msg;
  $toast.className = `toast ${type}`;
  $toast.hidden = false;
  setTimeout(() => ($toast.hidden = true), 2200);
}

function showDashboard() {
  $login.hidden = true;
  $dash.hidden  = false;
  setStatus(true);
}

function showLogin() {
  $dash.hidden  = true;
  $login.hidden = false;
  setStatus(false);
}

function disableForm(disabled) {
  [$email, $pass, $btn].forEach(el => (el.disabled = disabled));
}

// İlk yüklemede oturum var mı?
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("va_logged_in");
  if (token === "true") {
    showDashboard();
  } else {
    showLogin();
  }
});

// Giriş
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  disableForm(true);

  const mail = ($email.value || "").trim().toLowerCase();
  const pwd  = $pass.value || "";

  // küçük gecikme → “işleniyor” hissi
  setTimeout(() => {
    if (mail === DEMO_EMAIL && pwd === DEMO_PASS) {
      localStorage.setItem("va_logged_in", "true");
      showDashboard();
      showToast("Giriş başarılı", "ok");
      $pass.value = "";
    } else {
      showToast("E-posta veya şifre hatalı", "err");
      // ufak bir sallama efekti
      $form.classList.remove("shake");
      void $form.offsetWidth;
      $form.classList.add("shake");
    }
    disableForm(false);
  }, 450);
});

// Çıkış
$logout.addEventListener("click", () => {
  localStorage.removeItem("va_logged_in");
  showLogin();
  showToast("Oturum kapatıldı", "info");
});