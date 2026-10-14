/* Public static catalog search. No credentials, third-party analytics or private API. */
(() => {
  "use strict";
  const search = document.getElementById("q");
  const filter = document.getElementById("catalog-section");
  const output = document.getElementById("catalog-results");
  const status = document.getElementById("catalog-status");
  const more = document.getElementById("catalog-more");
  if (!search || !filter || !output || !status || !more) return;

  const repoPrefix = "https://github.com/takatakca/knowledgeAI/blob/main/";
  const sectionNames = { guide: "Guide", standard: "Standard", project: "Project", prompt: "Prompt" };
  const normalize = value => String(value || "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr-CA");
  let records = [];
  let displayed = 12;

  function createCard(item) {
    const link = document.createElement("a");
    link.className = "card catalog-card";
    link.href = repoPrefix + item.path.split("/").map(encodeURIComponent).join("/");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const meta = document.createElement("span");
    meta.className = "kicker";
    meta.textContent = sectionNames[item.section] || "Knowledge";
    const title = document.createElement("h3");
    title.textContent = item.title;
    const summary = document.createElement("p");
    summary.textContent = item.summary;
    const path = document.createElement("span");
    path.className = "catalog-path";
    path.textContent = item.path;
    link.append(meta, title, summary, path);
    return link;
  }

  function render() {
    const words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    const section = filter.value;
    const filtered = records.filter(item => {
      if (section !== "all" && item.section !== section) return false;
      return words.every(word => item.haystack.includes(word));
    }).sort((a, b) => {
      const score = item => words.reduce((sum, word) =>
        sum + (normalize(item.title).includes(word) ? 8 : 0) +
        (normalize(item.summary).includes(word) ? 3 : 0), 0);
      return score(b) - score(a) || a.path.localeCompare(b.path);
    });
    output.replaceChildren(...filtered.slice(0, displayed).map(createCard));
    status.textContent = filtered.length === 0
      ? "No public knowledge matched. Try another search or category."
      : String(filtered.length) + " public documents found · " + String(Math.min(displayed, filtered.length)) + " displayed";
    more.hidden = filtered.length <= displayed;
  }

  search.addEventListener("input", () => { displayed = 12; render(); });
  filter.addEventListener("change", () => { displayed = 12; render(); });
  more.addEventListener("click", () => { displayed += 12; render(); });
  document.addEventListener("keydown", event => {
    if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
    const tag = document.activeElement ? document.activeElement.tagName : "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    event.preventDefault();
    search.focus();
  });

  fetch("./knowledge-catalog.json", { cache: "no-cache" })
    .then(response => {
      if (!response.ok) throw new Error("Catalog unavailable");
      return response.json();
    })
    .then(data => {
      if (data.version !== 1 || !Array.isArray(data.items)) throw new Error("Invalid catalog");
      records = data.items.filter(item =>
        typeof item.path === "string" &&
        (/^(docs|projects|prompts)\/[A-Za-z0-9_./-]+\.md$/.test(item.path) ||
          /^(README|BRAND|AGENTS)\.md$/.test(item.path)) &&
        !item.path.split("/").includes("..") &&
        typeof item.title === "string" && typeof item.summary === "string" &&
        typeof item.search_text === "string"
      ).map(item => ({
        ...item,
        haystack: normalize([item.title, item.path, item.summary, item.search_text].join(" ")),
      }));
      render();
    })
    .catch(() => {
      status.textContent = "Full catalog is unavailable. The verified links above remain accessible.";
      more.hidden = true;
    });
})();
