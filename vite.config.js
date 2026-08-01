import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function runProbe(command, args = []) {
  try {
    const result = await execFileAsync(command, args, { timeout: 3500, windowsHide: true, maxBuffer: 64 * 1024 });
    return { ok: true, output: `${result.stdout || ""}\n${result.stderr || ""}`.trim() };
  } catch (error) {
    return { ok: false, output: `${error.stdout || ""}\n${error.stderr || ""}`.trim() };
  }
}

async function getLocalHermesStatus() {
  const isWindows = process.platform === "win32";
  const binaryProbe = await runProbe(isWindows ? "where.exe" : "which", ["hermes"]);
  const processProbe = await runProbe(isWindows ? "tasklist.exe" : "ps", isWindows ? ["/fo", "csv", "/nh"] : ["-ax", "-o", "comm="]);
  const desktopPattern = isWindows
    ? /(?:^|,)"?(?:Hermes(?: Desktop)?|hermes-desktop)\.exe"?/im
    : /(?:^|\/)(?:Hermes(?: Desktop)?(?:\.app\/Contents\/MacOS\/Hermes)?|hermes-desktop)$/im;

  let gatewayRunning = false;
  if (binaryProbe.ok) {
    const gatewayProbe = await runProbe("hermes", ["gateway", "status"]);
    const status = gatewayProbe.output.toLowerCase();
    const stopped = /not running|stopped|inactive|offline|not configured|failed/.test(status);
    gatewayRunning = gatewayProbe.ok && !stopped && /running|active|connected|healthy/.test(status);
  }

  return {
    bridge: true,
    checkedAt: new Date().toISOString(),
    hermesInstalled: binaryProbe.ok,
    desktopRunning: processProbe.ok && desktopPattern.test(processProbe.output),
    gatewayRunning,
  };
}

function localVerificationMiddleware(req, res, next) {
  if (req.url !== "/api/local-verification") return next();
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  getLocalHermesStatus()
    .then((status) => {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(JSON.stringify(status));
    })
    .catch(() => {
      res.statusCode = 500;
      res.end(JSON.stringify({ bridge: true, error: "local_probe_failed" }));
    });
}

function hermesLocalVerification() {
  return {
    name: "hermes-local-verification",
    configureServer(server) {
      server.middlewares.use(localVerificationMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(localVerificationMiddleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), hermesLocalVerification()],
  server: {
    host: "127.0.0.1",
  },
});
