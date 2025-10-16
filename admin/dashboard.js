// admin/admin/dashboard.js
// Panel metriklerini /data/panel.json'dan çeker.
// Bağlantı hatası olursa demo veriye düşer ve rozet "Demo veri" kalır.

const ui = {
  mode: document.getElementById('modeBadge'),
  total: document.getElementById('totalCount'),
  new24: document.getElementById('new24'),
  comp: document.getElementById('completion'),
  top: document.getElementById('topCodes') // <ul> veya <div>
};

// Demo fallback (fetch başarısızsa)
const demoStats = {
  totals: { technical_records: 1284, new_last_24h: 36, completion_percent: 36 },
  top_panic_codes_24h: [
    { code: "0x8000_002", count: 5, ios: "17.5", models: ["iPhone 11", "iPhone 12"] },
    { code: "0x6000_133", count: 4, ios: "16.7", models: ["iPhone Xr"] },
    { code: "0x5000_0A4", count: 3, ios: "17.2", models: ["iPhone 11 Pro"] }
  ]
};

function applyStats(data, isLive) {
  try {
    ui.total.textContent = (data.totals.technical_records ?? 0).toLocaleString('tr-TR');
    ui.new24.textContent = `+${data.totals.new_last_24h ?? 0}`;
    ui.comp.textContent = `${data.totals.completion_percent ?? 0}%`;

    // Top panic listesi
    if (ui.top) {
      const list = (data.top_panic_codes_24h || []).map(
        r => `<li><strong>${r.code}</strong> • ${r.count} adet` +
             `${r.ios ? ` • iOS ${r.ios}` : ""}` +
             `${r.models ? ` • ${r.models.join(", ")}` : ""}</li>`
      ).join("");
      ui.top.innerHTML = list || "<li>Son 24 saatte kayıt yok.</li>";
    }

    // Rozet
    if (ui.mode) {
      ui.mode.textContent = isLive ? "Canlı veri" : "Demo veri";
      ui.mode.classList.toggle('online', isLive);
    }
  } catch (e) {
    console.error("Render error:", e);
  }
}

async function loadStats() {
  const url = `/VoltAIRepair/data/panel.json?bust=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    applyStats(json, true);            // canlı veri
    console.log("Panel canlı veriyi yükledi.");
  } catch (err) {
    console.warn("Canlı veri alınamadı, demo veriye düşüldü:", err);
    applyStats(demoStats, false);      // demo veriye fallback
  }
}

document.addEventListener("DOMContentLoaded", loadStats);