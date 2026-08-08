import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join } from "node:path";

const SERVICE_NAME = "hermes-learning-lab-companion";
const PROTOCOL_VERSION = 1;
const MAX_BODY_BYTES = 4096;
const LOCAL_ORIGIN = /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/;

function createPairingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  const characters = [...bytes].map((value) => alphabet[value % alphabet.length]);
  return `${characters.slice(0, 4).join("")}-${characters.slice(4).join("")}`;
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function tokenMatches(candidate, expectedHash) {
  const candidateHash = Buffer.from(hashToken(candidate), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return candidateHash.length === expected.length && timingSafeEqual(candidateHash, expected);
}

function normalizeCode(value) {
  return String(value || "").trim().toUpperCase();
}

function sanitizeClientName(value) {
  return String(value || "Browser").replace(/[^\p{L}\p{N} ._()-]/gu, "").slice(0, 80) || "Browser";
}

function sanitizeStatus(status) {
  const doctorStatus = ["pass", "warning", "error", "unavailable"].includes(status?.doctor?.status)
    ? status.doctor.status
    : "unavailable";

  return {
    checkedAt: typeof status?.checkedAt === "string" ? status.checkedAt : new Date().toISOString(),
    hermesInstalled: Boolean(status?.hermesInstalled),
    desktopRunning: Boolean(status?.desktopRunning),
    gatewayRunning: Boolean(status?.gatewayRunning),
    hermesVersion: typeof status?.hermesVersion === "string" ? status.hermesVersion.slice(0, 120) : "Unavailable",
    doctor: {
      status: doctorStatus,
      summary: typeof status?.doctor?.summary === "string" ? status.doctor.summary.slice(0, 160) : "Doctor status unavailable.",
    },
  };
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("body_too_large");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}

function getBearerToken(request) {
  const value = request.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

export function createCompanionServer({
  allowedOrigins,
  confirmation,
  onPairingCode = () => {},
  pairingCode,
  probe,
  stateDirectory,
}) {
  if (!Array.isArray(allowedOrigins) || !allowedOrigins.length) throw new Error("allowedOrigins is required");
  if (typeof confirmation !== "function") throw new Error("confirmation is required");
  if (typeof probe !== "function") throw new Error("probe is required");
  if (!stateDirectory) throw new Error("stateDirectory is required");

  const stateFile = join(stateDirectory, "pairings.json");
  let currentPairingCode = normalizeCode(pairingCode || createPairingCode());
  let server;
  let pairings = [];

  const savePairings = async () => {
    await mkdir(stateDirectory, { recursive: true, mode: 0o700 });
    await writeFile(stateFile, `${JSON.stringify({ version: 1, pairings }, null, 2)}\n`, { mode: 0o600 });
  };

  const loadPairings = async () => {
    try {
      const saved = JSON.parse(await readFile(stateFile, "utf8"));
      pairings = Array.isArray(saved.pairings)
        ? saved.pairings.filter((item) => typeof item?.tokenHash === "string")
        : [];
    } catch {
      pairings = [];
    }
  };

  const isTrustedOrigin = (origin) => !origin || allowedOrigins.includes(origin) || LOCAL_ORIGIN.test(origin);

  const applyCors = (request, response, origin) => {
    if (!origin) return;
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
    if (request.headers["access-control-request-private-network"] === "true") {
      response.setHeader("Access-Control-Allow-Private-Network", "true");
    }
  };

  const findPairing = (token) => token && pairings.find((item) => tokenMatches(token, item.tokenHash));

  const handler = async (request, response) => {
    const origin = request.headers.origin;
    if (!isTrustedOrigin(origin)) {
      sendJson(response, 403, { error: "origin_not_allowed" });
      return;
    }

    applyCors(request, response, origin);
    if (request.method === "OPTIONS") {
      response.statusCode = 204;
      response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
      response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
      response.setHeader("Access-Control-Max-Age", "600");
      response.end();
      return;
    }

    if (request.method === "GET" && request.url === "/v1/health") {
      sendJson(response, 200, { service: SERVICE_NAME, version: PROTOCOL_VERSION, pairingRequired: true });
      return;
    }

    if (request.method === "POST" && request.url === "/v1/pair") {
      const body = await readJsonBody(request);
      if (normalizeCode(body.code) !== currentPairingCode) {
        sendJson(response, 401, { error: "invalid_pairing_code" });
        return;
      }

      const token = randomBytes(32).toString("base64url");
      pairings.push({
        clientName: sanitizeClientName(body.clientName),
        createdAt: new Date().toISOString(),
        tokenHash: hashToken(token),
      });
      await savePairings();
      currentPairingCode = createPairingCode();
      onPairingCode(currentPairingCode);
      sendJson(response, 201, { token });
      return;
    }

    const token = getBearerToken(request);
    const pairing = findPairing(token);
    if (!pairing) {
      sendJson(response, 401, { error: "pairing_required" });
      return;
    }

    if (request.method === "POST" && request.url === "/v1/check") {
      const decision = await confirmation({ clientName: pairing.clientName, origin: origin || "local-client" });
      if (decision === "timeout") {
        sendJson(response, 408, { error: "confirmation_timeout" });
        return;
      }
      if (decision !== "allow") {
        sendJson(response, 403, { error: "confirmation_denied" });
        return;
      }

      sendJson(response, 200, sanitizeStatus(await probe()));
      return;
    }

    if (request.method === "DELETE" && request.url === "/v1/pairing") {
      pairings = pairings.filter((item) => item !== pairing);
      await savePairings();
      sendJson(response, 200, { revoked: true });
      return;
    }

    sendJson(response, 404, { error: "not_found" });
  };

  return {
    get pairingCode() {
      return currentPairingCode;
    },
    get url() {
      const address = server?.address();
      return address && typeof address === "object" ? `http://127.0.0.1:${address.port}` : null;
    },
    async listen({ port = 43127 } = {}) {
      await loadPairings();
      server = createServer((request, response) => {
        handler(request, response).catch((error) => {
          const statusCode = error?.message === "body_too_large" ? 413 : 400;
          sendJson(response, statusCode, { error: statusCode === 413 ? "body_too_large" : "invalid_request" });
        });
      });
      await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, "127.0.0.1", resolve);
      });
      onPairingCode(currentPairingCode);
    },
    async close() {
      if (!server) return;
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      server = undefined;
    },
  };
}
