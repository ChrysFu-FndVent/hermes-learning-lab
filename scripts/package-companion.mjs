import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceFiles = ["companion/server.mjs", "companion/probe.mjs", "companion/cli.mjs"];
const encoded = Object.fromEntries(await Promise.all(sourceFiles.map(async (file) => [file, (await readFile(resolve(root, file))).toString("base64")])))
;
const outputDirectory = resolve(root, "public/downloads");
await mkdir(outputDirectory, { recursive: true });

const shellPayload = sourceFiles.map((file) => `write_file "${file.replace(/^companion\//, "")}" "${encoded[file]}"`).join("\n");
const macScript = `#!/bin/zsh
set -euo pipefail
if ! command -v node >/dev/null 2>&1; then
  echo "需要先安装 Node.js 22 或更高版本。"
  exit 1
fi
node_major=$(node -p 'Number(process.versions.node.split(".")[0])')
if (( node_major < 22 )); then
  echo "需要 Node.js 22 或更高版本。"
  exit 1
fi
install_dir="\${HOME}/.hermes-learning-lab/companion"
mkdir -p "$install_dir"
write_file() { print -r -- "$2" | /usr/bin/base64 -D > "$install_dir/$1"; }
${shellPayload}
chmod 600 "$install_dir"/*.mjs
exec node "$install_dir/cli.mjs"
`;

const powershellPayload = sourceFiles.map((file) => `Write-CompanionFile "${file.replace(/^companion\//, "")}" "${encoded[file]}"`).join("\n");
const windowsScript = `# Hermes Learning Lab companion bootstrap\n$ErrorActionPreference = "Stop"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "需要先安装 Node.js 22 或更高版本。" }
$nodeMajor = [int]((& node -p "process.versions.node.split('.')[0]").Trim())
if ($nodeMajor -lt 22) { throw "需要 Node.js 22 或更高版本。" }
$installDir = Join-Path $env:LOCALAPPDATA "HermesLearningLab\\companion"
New-Item -ItemType Directory -Force -Path $installDir | Out-Null
function Write-CompanionFile([string]$name, [string]$base64) { [IO.File]::WriteAllBytes((Join-Path $installDir $name), [Convert]::FromBase64String($base64)) }
${powershellPayload}
node (Join-Path $installDir "cli.mjs")
`;

await writeFile(resolve(outputDirectory, "start-hermes-lab.command"), macScript, "utf8");
await chmod(resolve(outputDirectory, "start-hermes-lab.command"), 0o755);
await writeFile(resolve(outputDirectory, "start-hermes-lab.ps1"), windowsScript, "utf8");
