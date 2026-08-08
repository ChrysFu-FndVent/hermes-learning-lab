import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function runCommand(command, args = []) {
  try {
    const result = await execFileAsync(command, args, {
      maxBuffer: 64 * 1024,
      timeout: 5000,
      windowsHide: true,
    });
    return { ok: true, output: `${result.stdout || ""}\n${result.stderr || ""}`.trim() };
  } catch (error) {
    return { ok: false, output: `${error.stdout || ""}\n${error.stderr || ""}`.trim() };
  }
}

function firstSafeLine(output) {
  const line = String(output || "").split(/\r?\n/).find((item) => item.trim()) || "Unavailable";
  // Strip terminal control characters before exposing a bounded summary.
  // eslint-disable-next-line no-control-regex
  return line.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 120) || "Unavailable";
}

function summarizeDoctor(result, hermesInstalled) {
  if (!hermesInstalled) return { status: "unavailable", summary: "Doctor unavailable because Hermes CLI was not found." };
  const normalized = result.output.toLowerCase();
  if (!result.ok || /\b(?:error|failed|critical|blocking)\b/.test(normalized)) {
    return { status: "error", summary: "Doctor reported a blocking issue." };
  }
  if (/\bwarn(?:ing)?\b/.test(normalized)) {
    return { status: "warning", summary: "Doctor completed with warnings." };
  }
  return { status: "pass", summary: "Doctor completed without blocking issues." };
}

export function createHermesProbe({ now = () => new Date(), platform = process.platform, run = runCommand } = {}) {
  return async function probeHermes() {
    const isWindows = platform === "win32";
    const binaryProbe = await run(isWindows ? "where.exe" : "which", ["hermes"]);
    const processProbe = await run(isWindows ? "tasklist.exe" : "ps", isWindows ? ["/fo", "csv", "/nh"] : ["-ax", "-o", "comm="]);
    const desktopPattern = isWindows
      ? /(?:^|,)"?(?:Hermes(?: Desktop)?|hermes-desktop)\.exe"?/im
      : /(?:^|\/)(?:Hermes(?: Desktop)?(?:\.app\/Contents\/MacOS\/Hermes)?|hermes-desktop)$/im;

    if (!binaryProbe.ok) {
      return {
        checkedAt: now().toISOString(),
        hermesInstalled: false,
        desktopRunning: processProbe.ok && desktopPattern.test(processProbe.output),
        gatewayRunning: false,
        hermesVersion: "Unavailable",
        doctor: summarizeDoctor({ ok: false, output: "" }, false),
      };
    }

    const [versionProbe, gatewayProbe, doctorProbe] = await Promise.all([
      run("hermes", ["--version"]),
      run("hermes", ["gateway", "status"]),
      run("hermes", ["doctor"]),
    ]);
    const gatewayStatus = gatewayProbe.output.toLowerCase();
    const gatewayStopped = /not running|stopped|inactive|offline|not configured|failed/.test(gatewayStatus);

    return {
      checkedAt: now().toISOString(),
      hermesInstalled: true,
      desktopRunning: processProbe.ok && desktopPattern.test(processProbe.output),
      gatewayRunning: gatewayProbe.ok && !gatewayStopped && /running|active|connected|healthy/.test(gatewayStatus),
      hermesVersion: versionProbe.ok ? firstSafeLine(versionProbe.output) : "Unavailable",
      doctor: summarizeDoctor(doctorProbe, true),
    };
  };
}

export const getLocalHermesStatus = createHermesProbe();
