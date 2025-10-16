const ui = {
  total: document.getElementById("total"),
  new24: document.getElementById("new24"),
  completion: document.getElementById("completion"),
  top: document.getElementById("topCodes"),
  status: document.getElementById("status").querySelector("span")
};

const demoStats = {
  total: 1284,
  new24: 36,
  completion: 36,
  topCodes: [
    { code: "0x8000_002", count: 5, models: ["iPhone 11", "12 Pro"], ios: "17.5.1" },
    { code: "0x6000_133", count: 4, models: ["iPhone XR"], ios: "16.7.8" },
    { code: "0x5900_0A4", count: 3, models: ["SE 2", "8 Plus"], ios: "17.4" }
  ]
};

async function loadData() {
  try {
    const [statsRes, codesRes] = await Promise.all([
      fetch("./data/stats.json"),
      fetch("./data/top-codes.json")
    ]);

    if (!statsRes.ok || !codesRes.ok) throw new Error("Demo mod");

    const stats = await statsRes.json();
    const codes = await codesRes.json();

    render(stats.total, stats.new24, stats.completion, codes, "Bağlı");
  } catch (e) {
    render(
      demoStats.total,
      demoStats.new24,
      demoStats.completion,
      demoStats.topCodes,
      "Demo veri"
    );
  }
}

function render(total, new24, completion, codes, mode) {
  ui.total.textContent = total.toLocaleString("tr-TR");
  ui.new24.textContent = `+${new24}`;
  ui.completion.textContent = `${completion}%`;
  ui.status.textContent = mode;

  ui.top.innerHTML = codes
    .map(
      (c) =>
        `<li><strong>${c.code}</strong> — ${c.count} kez <span style="color:#94a3b8">(${c.ios}, ${c.models.join(", ")})</span></li>`
    )
    .join("");
}

loadData();