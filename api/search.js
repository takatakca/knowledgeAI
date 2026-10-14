"use strict";

/**
 * Public, read-only catalog search for agents and other TAKATAK applications.
 * Never return non-public documents here. Private/tenant knowledge needs a
 * separately authenticated server-side service.
 */
const catalog = require("../knowledge-catalog.json");

const sections = new Set(["all", "guide", "standard", "project", "prompt"]);
const githubBase = "https://github.com/takatakca/knowledgeAI/blob/main/";
const normalize = (value) => String(value).normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr-CA");
const entries = Object.freeze(catalog.items.map((entry) => ({
  item: entry,
  searchable: normalize([entry.title, entry.summary, entry.path, entry.search_text].join(" ")),
  title: normalize(entry.title),
  summary: normalize(entry.summary)
})));

function readParameter(query, name, fallback) {
  const input = query ? query[name] : undefined;
  if (input === undefined) return fallback;
  if (typeof input !== "string") throw new Error(name + " must appear exactly once");
  return input;
}

function search(query) {
  const raw = readParameter(query, "q", "").trim();
  if (raw.length > 120) throw new Error("q must be at most 120 characters");
  const section = readParameter(query, "section", "all");
  if (!sections.has(section)) throw new Error("Unknown section");
  const limitString = readParameter(query, "limit", "20");
  const offsetString = readParameter(query, "offset", "0");
  if (!/^(?:[1-9]|[1-4]\d|50)$/.test(limitString)) throw new Error("limit must be between 1 and 50");
  if (!/^(?:0|[1-9]\d{0,5})$/.test(offsetString)) throw new Error("offset must be between 0 and 999999");
  const limit = Number(limitString);
  const offset = Number(offsetString);
  const terms = normalize(raw).split(/\s+/).filter(Boolean);
  if (terms.length > 12) throw new Error("q must contain no more than 12 terms");

  const matched = entries.filter(({ item, searchable }) => {
    if (section !== "all" && item.section !== section) return false;
    return terms.every((term) => searchable.includes(term));
  }).map(({ item, title, summary }) => ({
    item,
    rank: terms.reduce((score, word) => score + (title.includes(word) ? 8 : 0) +
      (summary.includes(word) ? 3 : 0), 0)
  })).sort((a, b) => b.rank - a.rank || a.item.path.localeCompare(b.item.path));

  return {
    version: 1,
    visibility: "public",
    source: catalog.repository,
    query: raw,
    section,
    total: matched.length,
    limit,
    offset,
    results: matched.slice(offset, offset + limit).map(({ item }) => ({
      title: item.title,
      summary: item.summary,
      section: item.section,
      path: item.path,
      source_id: item.source_id,
      source_sha256: item.sha256,
      source_url: githubBase + item.path.split("/").map(encodeURIComponent).join("/"),
      // Search text indexes only the repository's already-public source files.
      excerpt: item.search_text.slice(0, 500)
    }))
  };
}

function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const result = search(req.query);
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(result);
  } catch (error) {
    res.setHeader("Cache-Control", "no-store");
    res.status(400).json({ error: error.message });
  }
}

module.exports = handler;
module.exports.search = search;
