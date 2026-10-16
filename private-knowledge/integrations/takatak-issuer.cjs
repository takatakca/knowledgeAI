"use strict";

// Portable server-only adapter for TAKATAK's existing authenticated workspace
// resolver. This module does NOT establish a user identity or product grant,
// expose a route, persist a signing key, or set up a new identity authority.
// Host exclusively inside TAKATAK's trusted backend after connecting its
// server-side membership, product entitlement and permission checks.
const { createPrivateKey, createPublicKey, randomUUID, sign, constants } = require("node:crypto");

const SCOPES=Object.freeze([
  "knowledge:read", "knowledge:write", "knowledge:delete", "knowledge:export"
]);
const WORKSPACE=/^[A-Za-z0-9_-]{8,64}$/;
const ACTOR=/^[A-Za-z0-9._:-]{8,200}$/;
const KID=/^[A-Za-z0-9._:-]{1,128}$/;
const JTI=/^[A-Za-z0-9._:-]{16,128}$/;

class IssuerDenied extends Error {
  constructor(message="KnowledgeAI issuance denied") {
    super(message);
    this.name="IssuerDenied";
  }
}
function requireIssuer(config) {
  if (!config || typeof config.issuer!=="string" ||
    typeof config.audience!=="string" || !config.audience ||
    typeof config.kid!=="string" || !KID.test(config.kid) ||
    typeof config.privateKeyPem!=="string") {
    throw new IssuerDenied("Dedicated issuer configuration unavailable");
  }
  let uri, key;
  try {
    uri=new URL(config.issuer);
    key=createPrivateKey(config.privateKeyPem);
  } catch {
    throw new IssuerDenied("Dedicated issuer configuration unavailable");
  }
  if (uri.protocol!=="https:" || uri.username || uri.password ||
      uri.search || uri.hash || uri.origin!==config.issuer ||
      key.asymmetricKeyType!=="rsa" ||
      (key.asymmetricKeyDetails?.modulusLength||0)<2048) {
    throw new IssuerDenied("Dedicated issuer configuration unavailable");
  }
  return key;
}
function getKnowledgeJwks(config) {
  const key=requireIssuer(config);
  // Publish public parameters ONLY, never a private PEM, d, p, q or other CRT fields.
  const publicJwk=createPublicKey(key).export({format:"jwk"});
  const { kty, n, e }=publicJwk;
  return {keys:[{kty,n,e,kid:config.kid,use:"sig",alg:"RS256"}]};
}
function encoded(value) {
  return Buffer.from(JSON.stringify(value),"utf8").toString("base64url");
}
async function issueKnowledgeToken(input) {
  if (!input || typeof input.resolveAccess!=="function" ||
      typeof input.authorizeProduct!=="function" ||
      typeof input.authorizeScope!=="function" ||
      !SCOPES.includes(input.scope)) {
    throw new IssuerDenied();
  }
  // The private key is validated BEFORE resolving a user session or returning
  // any authorization information. No silent insecure signing fallback.
  const key=requireIssuer(input);
  let access, productAllowed, scopeAllowed;
  try {
    access=await input.resolveAccess();
    if (access?.mode!=="client_scoped" ||
        !WORKSPACE.test(access.activeClientId||"") ||
        !ACTOR.test(access.profileId||"") ||
        !Array.isArray(access.allowedClientIds) ||
        !access.allowedClientIds.includes(access.activeClientId)) {
      throw new IssuerDenied();
    }
    // Both callbacks MUST query TAKATAK's trusted DB and effective permissions.
    // Browser-supplied product or role assertions must never be accepted.
    productAllowed=await input.authorizeProduct({
      product:"knowledgeai",workspaceId:access.activeClientId,actorId:access.profileId
    });
    scopeAllowed=await input.authorizeScope({scope:input.scope,access});
  } catch {
    throw new IssuerDenied();
  }
  if (productAllowed!==true || scopeAllowed!==true) throw new IssuerDenied();
  const epoch=Math.floor((input.nowMs===undefined?Date.now():input.nowMs)/1000);
  const jti=input.jti===undefined?randomUUID():input.jti;
  if (!Number.isSafeInteger(epoch) || epoch<1 || typeof jti!=="string" ||
      !JTI.test(jti)) throw new IssuerDenied();
  const header={typ:"JWT",alg:"RS256",kid:input.kid};
  const claims={
    iss:input.issuer,aud:input.audience,
    sub:access.profileId,workspace_id:access.activeClientId,
    product:"knowledgeai",scope:input.scope,
    iat:epoch,exp:epoch+60,jti
  };
  const signed=encoded(header)+"."+encoded(claims);
  const signature=sign("RSA-SHA256",Buffer.from(signed),{
    key,padding:constants.RSA_PKCS1_PADDING
  }).toString("base64url");
  return signed+"."+signature;
}
module.exports={getKnowledgeJwks,issueKnowledgeToken,IssuerDenied,SCOPES};
