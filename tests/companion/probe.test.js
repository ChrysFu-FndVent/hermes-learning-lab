import assert from "node:assert/strict";
import test from "node:test";
import { createHermesProbe } from "../../companion/probe.mjs";

test("the Hermes probe returns fixed fields without command output", async () => {
  const responses = new Map([
    ["which hermes", { ok: true, output: "/Users/example/.local/bin/hermes" }],
    ["ps -ax -o comm=", { ok: true, output: "/Applications/Hermes Desktop.app/Contents/MacOS/Hermes\nother" }],
    ["hermes --version", { ok: true, output: "Hermes Agent v0.20.0\n/Users/example/private" }],
    ["hermes gateway status", { ok: true, output: "Gateway is running and healthy" }],
    ["hermes doctor", { ok: true, output: "WARNING provider fallback uses /Users/example/private" }],
  ]);
  const run = async (command, args = []) => responses.get([command, ...args].join(" ")) || { ok: false, output: "" };
  const probe = createHermesProbe({ now: () => new Date("2026-08-08T08:00:00.000Z"), platform: "darwin", run });

  assert.deepEqual(await probe(), {
    checkedAt: "2026-08-08T08:00:00.000Z",
    hermesInstalled: true,
    desktopRunning: true,
    gatewayRunning: true,
    hermesVersion: "Hermes Agent v0.20.0",
    doctor: { status: "warning", summary: "Doctor completed with warnings." },
  });
});
