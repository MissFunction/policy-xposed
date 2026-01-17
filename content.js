console.log("🔥 Policy Xposed content.js loaded");

window.addEventListener("load", () => {

  // ✅ REALISTIC PRIVACY POLICY KEYWORDS
  const riskyClauses = {
    "third parties|service providers|vendors|affiliates":
      "Your data may be shared with external organizations",

    "sell|sale|commercial purposes|monetize":
      "Your data may be sold or monetized",

    "tracking|cookies|pixels|tracking technologies":
      "Your activity may be tracked across services",

    "advertising|ads|marketing|targeted advertising":
      "Your data may be used for targeted advertising",

    "location data|precise location|geolocation|gps":
      "Your location information may be collected",

    "analytics|usage data|diagnostics|performance data":
      "Your behavior may be analyzed",

    "partners|business partners|third-party partners":
      "Your data may be shared with partners"
  };

  let totalRiskCount = 0;

  // ---- Highlight risky words ----
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    if (!text.trim()) continue;

    let replaced = text;

    Object.keys(riskyClauses).forEach(pattern => {
      const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

      replaced = replaced.replace(regex, match => {
        totalRiskCount++;
        return `<mark class="risky-word"
          data-desc="${riskyClauses[pattern]}"
          style="background:#ffeb3b;color:#000;font-weight:bold;cursor:pointer;">
          ${match}
        </mark>`;
      });
    });

    if (replaced !== text) {
      const span = document.createElement("span");
      span.innerHTML = replaced;
      node.parentNode.replaceChild(span, node);
    }
  }

  // ---- Create banner ----
  const banner = document.createElement("div");
  banner.style.cssText = `
    position:fixed;
    bottom:14px;
    right:14px;
    padding:12px 16px;
    border-radius:10px;
    font-size:15px;
    font-weight:bold;
    color:#fff;
    cursor:pointer;
    z-index:2147483647;
    box-shadow:0 0 10px rgba(0,0,0,0.5);
  `;
  document.body.appendChild(banner);

  // ---- Tooltip ----
  const tooltip = document.createElement("div");
  tooltip.style.cssText = `
    position:fixed;
    top:70px;
    left:50%;
    transform:translateX(-50%);
    background:#222;
    color:#fff;
    padding:6px 12px;
    border-radius:6px;
    font-size:14px;
    opacity:0;
    z-index:2147483648;
    transition:opacity 0.3s;
  `;
  document.body.appendChild(tooltip);

  // ---- Risk Level ----
  let riskLevel = "Low";
  let bannerColor = "#2e7d32";

  if (totalRiskCount >= 5 && totalRiskCount < 10) {
    riskLevel = "Medium";
    bannerColor = "#f57c00";
  } else if (totalRiskCount >= 10) {
    riskLevel = "High";
    bannerColor = "#b00020";
  }

  banner.style.background = bannerColor;
  banner.innerText = `⚠️ Policy Xposed: ${totalRiskCount} risks | ${riskLevel}`;

  // ---- Glow animation ----
  if (riskLevel !== "Low") {
    let glow = true;
    setInterval(() => {
      banner.style.boxShadow = glow
        ? `0 0 25px ${riskLevel === "High"
            ? "rgba(176,0,32,0.9)"
            : "rgba(245,124,0,0.9)"}`
        : "0 0 10px rgba(0,0,0,0.5)";
      glow = !glow;
    }, 900);
  }

  // ---- Auto-scroll demo ----
  let started = false;
  banner.onclick = () => {
    if (started) return;
    started = true;

    const riskyWords = document.querySelectorAll("mark.risky-word");
    let index = 0;

    function scrollNext() {
      if (!riskyWords.length) return;

      const word = riskyWords[index];
      word.scrollIntoView({ behavior: "smooth", block: "center" });

      // Highlight
      word.style.transition = "background 0.4s, transform 0.3s";
      word.style.backgroundColor = "yellow";
      word.style.transform = "scale(1.3)";

      tooltip.innerText = word.dataset.desc;
      tooltip.style.opacity = 1;

      setTimeout(() => {
        word.style.backgroundColor = "#ffeb3b";
        word.style.transform = "";
        tooltip.style.opacity = 0;
      }, 1200);

      index = (index + 1) % riskyWords.length;
      setTimeout(scrollNext, 1500);
    }

    scrollNext();
  };
});


   