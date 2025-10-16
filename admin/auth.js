// admin/auth.js  — DEMO oturum (e-posta: hknngnr36@gmail.com, şifre: voltai)
(() => {
  const ADMIN_EMAIL = "hknngnr36@gmail.com";
  const ADMIN_PASS  = "voltai"; // DEMO - sonra değiştir

  const $ = (s) => document.querySelector(s);

  const form   = $('#login-form') || $('form');
  const email  = $('#admin-email') || $('input[type="email"]');
  const pass   = $('#admin-pass')  || $('input[type="password"]');
  const status = $('#conn-status'); // varsa "Durum" yazısını günceller

  function unlockUI() {
    document.querySelectorAll('[data-requires-auth]').forEach(el => el.removeAttribute('hidden'));
    if (status) { status.textContent = 'Bağlandı'; status.style.color = '#3fb950'; }
  }

  // Girişten sonra açık kalsın
  if (localStorage.getItem('var_admin') === '1') unlockUI();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = email?.value.trim().toLowerCase() === ADMIN_EMAIL && pass?.value === ADMIN_PASS;
      if (ok) {
        localStorage.setItem('var_admin', '1');
        unlockUI();
        alert('Giriş başarılı ✅');
      } else {
        alert('E-posta veya şifre hatalı');
      }
    });
  }
})();
