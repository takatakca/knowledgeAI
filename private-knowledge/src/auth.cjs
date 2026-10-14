"use strict";
const { createPublicKey, verify: verifySignature, constants } = require("node:crypto");
class AccessError extends Error {
  constructor(message = "Unauthorized", status = 401) { super(message); this.status = status; }
}
function decodePart(part) {
  if (!/^[A-Za-z0-9_-]+$/.test(part) || part.length > 10000) throw new AccessError();
  try { return JSON.parse(Buffer.from(part, "base64url").toString("utf8")); }
  catch { throw new AccessError(); }
}
function validateConfiguration(config) {
  if (!config || typeof config.issuer !== "string" || !config.issuer ||
      typeof config.audience !== "string" || !config.audience ||
      typeof config.jwksUrl !== "string") throw new Error("Private JWT authority is not configured");
  const uri = new URL(config.jwksUrl);
  if (uri.protocol !== "https:" || uri.username || uri.password || uri.hash) {
    throw new Error("JWKS endpoint must use trusted HTTPS");
  }
  return uri.toString();
}
function createVerifier(config, getJwks) {
  const jwksUrl = validateConfiguration(config);
  let cached = null, cachedUntil = 0;
  async function keys() {
    if (getJwks) return getJwks();
    if (cached && Date.now() < cachedUntil) return cached;
    const response = await fetch(jwksUrl, {
      signal: AbortSignal.timeout(4000), headers: { Accept: "application/json" }, redirect: "error"
    });
    if (!response.ok) throw new AccessError("Identity provider unavailable", 503);
    const body = await response.text();
    if (body.length > 65536) throw new AccessError("Identity provider unavailable", 503);
    const candidate = JSON.parse(body);
    if (!candidate || !Array.isArray(candidate.keys) || candidate.keys.length > 30) {
      throw new AccessError("Identity provider unavailable", 503);
    }
    cached = candidate;
    cachedUntil = Date.now() + 60000;
    return candidate;
  }
  return async function verifyToken(bearer, neededScope) {
    if (typeof bearer !== "string" || bearer.length > 9000) throw new AccessError();
    const parts = bearer.split(".");
    if (parts.length !== 3 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) {
      throw new AccessError();
    }
    const header = decodePart(parts[0]), claims = decodePart(parts[1]);
    if (!header || header.alg !== "RS256" || header.typ !== "JWT" ||
        typeof header.kid !== "string" || !/^[A-Za-z0-9._:-]{1,128}$/.test(header.kid)) {
      throw new AccessError();
    }
    let jwks;
    try { jwks = await keys(); }
    catch (error) {
      if (error instanceof AccessError) throw error;
      throw new AccessError("Identity provider unavailable", 503);
    }
    const matching = jwks.keys.filter(key => key.kid === header.kid && key.kty === "RSA" &&
      (key.alg === undefined || key.alg === "RS256") &&
      (key.use === undefined || key.use === "sig"));
    if (matching.length !== 1) throw new AccessError();
    let valid = false;
    try {
      const publicKey = createPublicKey({ key: matching[0], format: "jwk" });
      valid = verifySignature("RSA-SHA256", Buffer.from(parts[0] + "." + parts[1]), {
        key: publicKey, padding: constants.RSA_PKCS1_PADDING
      }, Buffer.from(parts[2], "base64url"));
    } catch { throw new AccessError(); }
    if (!valid) throw new AccessError();
    const now = Math.floor(Date.now() / 1000);
    if (!claims || claims.iss !== config.issuer ||
        !(claims.aud === config.audience ||
          (Array.isArray(claims.aud) && claims.aud.includes(config.audience))) ||
        !Number.isInteger(claims.iat) || !Number.isInteger(claims.exp) ||
        claims.iat > now + 30 || claims.exp <= now ||
        claims.exp <= claims.iat || claims.exp - claims.iat > 300 ||
        (claims.nbf !== undefined && (!Number.isInteger(claims.nbf) || claims.nbf > now + 30)) ||
        typeof claims.sub !== "string" || claims.sub.length < 8 || claims.sub.length > 200 ||
        typeof claims.workspace_id !== "string" ||
        !/^[a-zA-Z0-9_-]{8,64}$/.test(claims.workspace_id) ||
        claims.product !== "knowledgeai" ||
        typeof claims.jti !== "string" || !/^[a-zA-Z0-9._:-]{16,128}$/.test(claims.jti)) {
      throw new AccessError();
    }
    if (typeof claims.scope !== "string") throw new AccessError();
    if (!claims.scope.split(" ").includes(neededScope)) {
      throw new AccessError("Insufficient permission", 403);
    }
    return Object.freeze({ actor: claims.sub, workspace: claims.workspace_id,
      jti: claims.jti, scope: neededScope });
  };
}
module.exports = { AccessError, createVerifier };
