import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createCompanionServer } from "../../companion/server.mjs";

const trustedOrigin = "https://chrysfu.github.io";

test("a paired learner can approve a redacted Hermes status check", async (context) => {
  const stateDirectory = await mkdtemp(join(tmpdir(), "hermes-lab-companion-"));
  const companion = createCompanionServer({
    allowedOrigins: [trustedOrigin],
    confirmation: async () => "allow",
    pairingCode: "ABCD-EFGH",
    probe: async () => ({
      checkedAt: "2026-08-08T08:00:00.000Z",
      hermesInstalled: true,
      desktopRunning: false,
      gatewayRunning: true,
      hermesVersion: "Hermes Agent v0.20.0",
      doctor: { status: "warning", summary: "Doctor completed with warnings." },
    }),
    stateDirectory,
  });

  await companion.listen({ port: 0 });
  context.after(async () => {
    await companion.close();
    await rm(stateDirectory, { recursive: true, force: true });
  });

  const healthResponse = await fetch(`${companion.url}/v1/health`, {
    headers: { Origin: trustedOrigin },
  });
  assert.equal(healthResponse.status, 200);
  assert.deepEqual(await healthResponse.json(), {
    service: "hermes-learning-lab-companion",
    version: 1,
    pairingRequired: true,
  });

  const pairResponse = await fetch(`${companion.url}/v1/pair`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: trustedOrigin },
    body: JSON.stringify({ code: "ABCD-EFGH", clientName: "Chrome on macOS" }),
  });
  assert.equal(pairResponse.status, 201);
  const { token } = await pairResponse.json();
  assert.match(token, /^[A-Za-z0-9_-]{40,}$/);

  const checkResponse = await fetch(`${companion.url}/v1/check`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Origin: trustedOrigin },
  });
  assert.equal(checkResponse.status, 200);
  assert.deepEqual(await checkResponse.json(), {
    checkedAt: "2026-08-08T08:00:00.000Z",
    hermesInstalled: true,
    desktopRunning: false,
    gatewayRunning: true,
    hermesVersion: "Hermes Agent v0.20.0",
    doctor: { status: "warning", summary: "Doctor completed with warnings." },
  });
});

test("the companion allows private-network preflight only for trusted origins", async (context) => {
  const stateDirectory = await mkdtemp(join(tmpdir(), "hermes-lab-companion-"));
  const companion = createCompanionServer({
    allowedOrigins: [trustedOrigin],
    confirmation: async () => "allow",
    probe: async () => ({}),
    stateDirectory,
  });
  await companion.listen({ port: 0 });
  context.after(async () => {
    await companion.close();
    await rm(stateDirectory, { recursive: true, force: true });
  });

  const preflight = await fetch(`${companion.url}/v1/health`, {
    method: "OPTIONS",
    headers: {
      "Access-Control-Request-Headers": "authorization,content-type",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Private-Network": "true",
      Origin: trustedOrigin,
    },
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), trustedOrigin);
  assert.equal(preflight.headers.get("access-control-allow-private-network"), "true");

  const untrusted = await fetch(`${companion.url}/v1/health`, {
    headers: { Origin: "https://example.invalid" },
  });
  assert.equal(untrusted.status, 403);
  assert.deepEqual(await untrusted.json(), { error: "origin_not_allowed" });
});

test("denied and timed-out checks return distinct safe errors", async (context) => {
  const stateDirectory = await mkdtemp(join(tmpdir(), "hermes-lab-companion-"));
  const decisions = ["deny", "timeout"];
  const companion = createCompanionServer({
    allowedOrigins: [trustedOrigin],
    confirmation: async () => decisions.shift(),
    pairingCode: "ABCD-EFGH",
    probe: async () => {
      throw new Error("probe must not run without approval");
    },
    stateDirectory,
  });
  await companion.listen({ port: 0 });
  context.after(async () => {
    await companion.close();
    await rm(stateDirectory, { recursive: true, force: true });
  });

  const pairResponse = await fetch(`${companion.url}/v1/pair`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: trustedOrigin },
    body: JSON.stringify({ code: "ABCD-EFGH" }),
  });
  const { token } = await pairResponse.json();
  const headers = { Authorization: `Bearer ${token}`, Origin: trustedOrigin };

  const denied = await fetch(`${companion.url}/v1/check`, { method: "POST", headers });
  assert.equal(denied.status, 403);
  assert.deepEqual(await denied.json(), { error: "confirmation_denied" });

  const timedOut = await fetch(`${companion.url}/v1/check`, { method: "POST", headers });
  assert.equal(timedOut.status, 408);
  assert.deepEqual(await timedOut.json(), { error: "confirmation_timeout" });
});

test("pairing survives restart until the learner revokes it", async (context) => {
  const stateDirectory = await mkdtemp(join(tmpdir(), "hermes-lab-companion-"));
  context.after(() => rm(stateDirectory, { recursive: true, force: true }));
  const options = {
    allowedOrigins: [trustedOrigin],
    confirmation: async () => "allow",
    pairingCode: "ABCD-EFGH",
    probe: async () => ({ doctor: { status: "pass", summary: "OK" } }),
    stateDirectory,
  };
  const first = createCompanionServer(options);
  await first.listen({ port: 0 });
  const pairResponse = await fetch(`${first.url}/v1/pair`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: trustedOrigin },
    body: JSON.stringify({ code: "ABCD-EFGH" }),
  });
  const { token } = await pairResponse.json();
  await first.close();

  const restarted = createCompanionServer(options);
  await restarted.listen({ port: 0 });
  context.after(() => restarted.close());
  const headers = { Authorization: `Bearer ${token}`, Origin: trustedOrigin };
  const checkResponse = await fetch(`${restarted.url}/v1/check`, { method: "POST", headers });
  assert.equal(checkResponse.status, 200);

  const revokeResponse = await fetch(`${restarted.url}/v1/pairing`, { method: "DELETE", headers });
  assert.equal(revokeResponse.status, 200);
  const afterRevoke = await fetch(`${restarted.url}/v1/check`, { method: "POST", headers });
  assert.equal(afterRevoke.status, 401);
});
