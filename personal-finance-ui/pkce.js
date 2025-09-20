// pkce.js
import crypto from "crypto";

// Generate a code_verifier (random string, 43–128 chars)
function generateCodeVerifier() {
  return crypto.randomBytes(64).toString("base64url");
}

// Generate a code_challenge (SHA256 of verifier, base64url encoded)
function generateCodeChallenge(verifier) {
  return crypto.createHash("sha256")
    .update(verifier)
    .digest()
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Main
const verifier = generateCodeVerifier();
const challenge = generateCodeChallenge(verifier);

console.log("🔑 Code Verifier:\n", verifier);
console.log("📌 Code Challenge:\n", challenge);
