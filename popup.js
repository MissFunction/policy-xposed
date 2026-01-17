chrome.storage.local.get(["riskCount", "riskLevel", "riskDetails"], data => {
  const summary = document.getElementById("summary");
  const risksList = document.getElementById("risksList");
  const exportBtn = document.getElementById("exportBtn");

  if (!data.riskDetails || data.riskDetails.length === 0) {
    summary.innerText = "Open a privacy policy page.";
    risksList.style.display = "none";
    exportBtn.style.display = "none";
    return;
  }

  summary.innerHTML = `
    Risks Found: <b>${data.riskCount}</b><br>
    Risk Level: <span class="${data.riskLevel.toLowerCase()}">${data.riskLevel}</span>
  `;

  risksList.innerHTML = "";
  data.riskDetails.forEach(risk => {
    const li = document.createElement("li");
    li.textContent = `${risk.word} → ${risk.description}`;
    risksList.appendChild(li);
  });
  risksList.style.display = "block";

  exportBtn.style.display = "block";
  exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(data.riskDetails, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "policy_risks.json";
    a.click();
    URL.revokeObjectURL(url);
  };
});




