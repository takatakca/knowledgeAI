"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const handler = require("../api/search.js");
const health = require("../api/health.js");

function invoke(fn, query = {}, method = "GET") {
  const headers = {};
  const response = {
    statusCode: 200,
    setHeader: (name, value) => { headers[name.toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
  fn({ method, query }, response);
  return { status: response.statusCode, body: response.body, headers };
}

test("search enumerates only the public curated catalog", () => {
  const { status, body, headers } = invoke(handler, { limit: "50" });
  assert.equal(status, 200);
  assert.equal(body.visibility, "public");
  assert.ok(body.total >= 50);
  assert.ok(body.results.every((item) => item.source_url.startsWith(
    "https://github.com/takatakca/knowledgeAI/blob/main/"
  )));
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.match(headers["cache-control"], /public/);
  assert.ok(!("search_text" in body.results[0]));
  assert.ok(body.results.every((item) => item.source_id.startsWith("github:takatakca/knowledgeAI:")));
  assert.ok(body.results.every((item) => /^[a-f0-9]{64}$/.test(item.source_sha256)));
});

test("accent insensitive search returns provenance links", () => {
  const result = invoke(handler, { q: "montreal", limit: "5" });
  assert.equal(result.status, 200);
  assert.ok(result.body.total > 0);
  assert.ok(result.body.results.every((item) => item.path && item.source_url));
});

test("section scope, stable pagination and bounded pages", () => {
  const a = invoke(handler, { section: "project", limit: "5", offset: "0" }).body;
  const b = invoke(handler, { section: "project", limit: "5", offset: "5" }).body;
  assert.ok(a.total >= 10);
  assert.ok(a.results.every((item) => item.section === "project"));
  assert.notEqual(a.results[0].path, b.results[0].path);
  assert.equal(a.total, b.total);
});

test("invalid input returns 400 without unbounded processing", () => {
  for (const query of [
    { q: "x".repeat(121) }, { q: ["one", "two"] },
    { limit: "1000" }, { limit: "0" }, { offset: "-1" },
    { section: "private" }, { q: "a b c d e f g h i j k l m" }
  ]) {
    const result = invoke(handler, query);
    assert.equal(result.status, 400);
    assert.match(result.headers["cache-control"], /no-store/);
  }
});

test("write methods forbidden on search and health", () => {
  assert.equal(invoke(handler, {}, "POST").status, 405);
  assert.equal(invoke(health, {}, "DELETE").status, 405);
});

test("health verifies the bundled public catalog", () => {
  const { status, body, headers } = invoke(health);
  assert.equal(status, 200);
  assert.equal(body.status, "ok");
  assert.ok(body.records >= 50);
  assert.equal(headers["cache-control"], "no-store");
});

test("unknown search returns an empty array, never fictional results", () => {
  const { status, body } = invoke(handler, { q: "zzzkqjwquidsqwwyeo123" });
  assert.equal(status, 200);
  assert.equal(body.total, 0);
  assert.deepEqual(body.results, []);
});
