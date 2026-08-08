import { createInterface } from "node:readline/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { getLocalHermesStatus } from "./probe.mjs";
import { createCompanionServer } from "./server.mjs";

const PORT = Number(process.env.HERMES_LAB_COMPANION_PORT || 43127);
const PRODUCTION_ORIGIN = "https://chrysfu.github.io";

export function createTerminalConfirmation({ input = process.stdin, output = process.stdout, timeoutMs = 30_000 } = {}) {
  return async ({ clientName }) => {
    const readline = createInterface({ input, output });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      output.write(`\nHermes Learning Lab 请求读取本机状态（${clientName}）。允许本次检测？[y/N] `);
      const answer = await readline.question("", { signal: controller.signal });
      return /^(?:y|yes)$/i.test(answer.trim()) ? "allow" : "deny";
    } catch (error) {
      return error?.name === "AbortError" ? "timeout" : "deny";
    } finally {
      clearTimeout(timeout);
      readline.close();
    }
  };
}

export async function startCompanion({
  confirmation = createTerminalConfirmation(),
  stateDirectory = process.env.HERMES_LAB_STATE_DIR || join(homedir(), ".hermes-learning-lab"),
  port = PORT,
  output = process.stdout,
} = {}) {
  const companion = createCompanionServer({
    allowedOrigins: [PRODUCTION_ORIGIN],
    confirmation,
    onPairingCode: (code) => output.write(`\n本机伴随服务配对码：${code}\n`),
    probe: getLocalHermesStatus,
    stateDirectory,
  });
  await companion.listen({ port });
  output.write(`Hermes Learning Lab 本机伴随服务已启动：http://127.0.0.1:${port}\n`);
  output.write("请保持此终端运行；每次网页检测前需要在此处确认。\n");
  return companion;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const companion = await startCompanion();
  const stop = async () => {
    await companion.close();
    process.exit(0);
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}
