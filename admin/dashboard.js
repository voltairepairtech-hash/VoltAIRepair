/* VoltAIRepair Admin • dashboard.js (enhanced)
   - Live status badge + graceful fallbacks
   - Pulls from /admin/data/*.json if present, else demo
   - Renders top panic codes with iOS/model hints
*/

(function () {
  // ----- Helpers -----
  const $ = (sel) => document.querySelector(sel);
  const byId = (id) => document.getElementById(id);
  const safe = (...ids) => ids.map(byId).find(Boolean) || { textContent: "", innerHTML: "" };

  // UI anchors (support legacy ids too)
  const UI = {
    total: safe("total", "totalRecords"),
    new24: safe("new24", "newLast24"),
    comp: safe("comp", "completion", "completeRatio"),
    top: safe("top", "topCodes", "topList"),
    status: safe("status", "badgeStatus"),
    log: (msg) => {
      const ts = new Date().toLocaleTimeString("tr-TR", { hour12: false });
      console.log(`[Admin] ${ts} ${msg}`);
    },
  };

  // Where to look for data on GitHub Pages (optional static JSONs)
  const SOURCE = {
    stats: "/VoltAIRepair/admin/data/stats.json",        // { total, new24, completion }
    top: "/VoltAIRepair/admin/data/top-codes.json"       // [{code,count,ios,models:[]},...]
  };

  // Demo data as final fallback
  const demo = {
    stats: { total: 1284, new24: 36, completion: 36 }, // %
    top: [
      { code: "0x8000_002", count: 5, ios: "iOS 17.5", models: ["iPhone 11", "11 Pro"] },
      { code: "0x6000_133", count: 4, ios: "iOS 16.7", models: ["iPhone Xr"] },
      { code: "0x5900_0A4", count: 3, ios: "iOS 17.x", models: ["SE (2nd)"] }
    ]
  };

  // ----- Status badge -----
  function setStatus(kind, note = "") {
    const el = UI.status;
    const text = {
      offline: "Bağlantı yok",
      demo: "Demo veri",
      online: "Bağlı"
    }[kind] || "Durum yok";

    el.textContent = note ? `${text} • ${note}` : text;

    // small visual hint via data-attr (CSS isteğe bağlı)
    try { el.setAttribute("data-state", kind); } catch {}
  }

  // ----- Renderers -----
  function renderStats(s) {
    UI.total.textContent = (s.total ?? 0).toLocaleString("tr-TR");
    UI.new24.textContent = `+${s.new24 ?? 0}`;
    const pct = Number(s.completion ?? 0);
    UI.comp.textContent = `${pct}%`;
  }

  function renderTop(list) {
    if (!Array.isArray(list) || !list.length) {
      UI.top.innerHTML = `<em>Veri yok</em>`;
      return;
    }
    const html = list.slice(0, 3).map(item => {
      const ios = item.ios ? ` <span style="opacity:.75;">(${item.ios})</span>` : "";
      const models = Array.isArray(item.models) && item.models.length
        ? ` <span style="opacity:.75;">[${item.models.join(", ")}]</span>` : "";
      return `<li><strong>${item.code}</strong> — ${item.count} adet${ios}${models}</li>`;
    }).join("");
    UI.top.innerHTML = `<ul style="margin:.25rem 0 .5rem 1rem;">${html}</ul>`;
  }

  // ----- Fetchers with graceful fallback -----
  async function tryJson(url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      UI.log(`Fetch fail: ${url} • ${e.message}`);
      return null;
    }
  }

  async function loadData() {
    // Show who is logged in (if auth.js stored something)
    try {
      const u = JSON.parse(localStorage.getItem("va_admin_user") || "null");
      if (u?.email) setStatus("online", u.email);
    } catch { /* ignore */ }

    // Attempt static JSONs first
    let stats = await tryJson(SOURCE.stats);
    let top = await tryJson(SOURCE.top);

    if (!stats && !top) {
      // all failed → demo
      setStatus("demo");
      stats = demo.stats;
      top = demo.top;
    } else if (!stats) {
      setStatus("demo", "stats yok");
      stats = demo.stats;
    } else if (!top) {
      setStatus("demo", "top-codes yok");
      top = demo.top;
    } else {
      // both ok
      if (UI.status.textContent.startsWith("Bağlantı yok")) setStatus("online");
    }

    renderStats(stats);
    renderTop(top);
    UI.log("Panel yüklendi • veriler işlendi");
  }

  // ----- Auto-refresh (30s) -----
  let timer;
  function start() {
    loadData();
    clearInterval(timer);
    timer = setInterval(loadData, 30_000);
  }

  // Kick-off
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") start();
  });
  start();
})();