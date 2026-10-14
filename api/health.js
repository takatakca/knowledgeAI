"use strict";

// A lightweight deployment probe. This checks the public catalog was bundled.
const catalog = require("../knowledge-catalog.json");

function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const healthy = catalog.version === 1 && Array.isArray(catalog.items) && catalog.items.length > 0;
  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "unhealthy",
    component: "public-knowledge-catalog",
    records: Array.isArray(catalog.items) ? catalog.items.length : 0,
    catalog_version: catalog.version
  });
}

module.exports = handler;
