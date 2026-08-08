const SERVICE_URL = "http://127.0.0.1:43127";
const TOKEN_KEY = "hermes-learning-lab-companion-token-v1";

function withTimeout(signal, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  const cleanup = () => window.clearTimeout(timeout);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });
  return { signal: controller.signal, cleanup };
}

async function request(path, options = {}) {
  const timeout = withTimeout(options.signal, options.timeoutMs);
  try {
    const headers = { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) };
    const response = await fetch(`${SERVICE_URL}${path}`, { ...options, headers, signal: timeout.signal, cache: "no-store" });
    let body = {};
    try { body = await response.json(); } catch { /* Empty error bodies are handled by status. */ }
    if (!response.ok) {
      const error = new Error(body.error || `request_failed_${response.status}`);
      error.code = body.error || `http_${response.status}`;
      throw error;
    }
    return body;
  } finally {
    timeout.cleanup();
  }
}

function readToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
}

function writeToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* Browser storage may be unavailable. */ }
}

function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* No-op when storage is unavailable. */ }
}

export function hasCompanionToken() {
  return Boolean(readToken());
}

export async function discoverCompanion() {
  return request("/v1/health");
}

export async function pairCompanion(code) {
  const body = await request("/v1/pair", {
    method: "POST",
    body: JSON.stringify({ code, clientName: "Hermes Learning Lab" }),
  });
  if (!body.token) throw new Error("missing_pairing_token");
  writeToken(body.token);
  return body;
}

export async function checkCompanion() {
  const token = readToken();
  if (!token) {
    const error = new Error("pairing_required");
    error.code = "pairing_required";
    throw error;
  }
  return request("/v1/check", { method: "POST", token, timeoutMs: 35_000 });
}

export async function revokeCompanion() {
  const token = readToken();
  if (token) {
    try { await request("/v1/pairing", { method: "DELETE", token }); } finally { clearToken(); }
  } else {
    clearToken();
  }
}

export const companionServiceUrl = SERVICE_URL;
