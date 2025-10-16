// admin/dashboard.js  — VoltAIRepair Admin Panel (live JSON + graceful fallback)

// UI refs
const ui = {
  total: document.getElementById('totalCount'),
  new24: document.getElementById('new24'),
  comp:  document.getElementById('completePct'),
  top:   document.getElementById('topCodes'),
  badge: document.getElementById('badgeMode'), // "Demo veri" rozeti
};

// Mutlak URL (Pages yol hatasını bitirir)
const LIVE_JSON = "https://voltairepairtech-hash.github.io/VoltAIRepair/data/panel.json?bust=" + Date.now();

// Demo yedek veri (fetch başarısızsa)
const demoStats = {
  updated_at: new Date().toISOString(),
  total: 1284,
  new24: 36,
  complete_pct: 36,
  topCodes: [
    { code: "0x8000_002", count: 5, models: ["iPhone 11","11 Pro"] },
    { code: "0x6000_133", count: 4, models: ["iPhone 12","12 mini"] },
    { code: "0x5000_0A4", count: 3, models: ["iPhone XR"] }
  ]
};

function render(stats, mode) {
  ui.total.textContent = (stats.total ?? 0).toLocaleString('tr-TR');
  ui.new24.textContent = "+" + (stats.new24 ?? 0);
  ui.comp.textContent  = (stats.complete_pct ?? 0) + "%";
  ui.top.innerHTML = (stats.topCodes ?? [])
    .map(t => `<li><code>${t.code}</code> — <strong>${t.count}</strong> <span style="color:#94a3b8">(${(t.models||[]).join(", ")})</span></li>`)
    .join("") || "<li>Kayıt yok</li>";

  if (ui.badge) {
    ui.badge.textContent = (mode === "live") ? "Canlı veri" : "Demo veri";
    ui.badge.className   = (mode === "live") ? "badge live" : "badge demo";
  }
}

async function load() {
  try {
    const res = await fetch(LIVE_JSON, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    render(data, "live");
  } catch (e) {
    console.warn("Live JSON okunamadı, demo'ya düşüldü:", e);
    render(demoStats, "demo");
  }
}

document.addEventListener("DOMContentLoaded", load);