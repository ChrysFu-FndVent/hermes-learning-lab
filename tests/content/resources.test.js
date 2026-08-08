import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const learnerFacingResourceFiles = [
  "README.md",
  "resources/README.md",
  "resources/COMMUNITY.md",
  "src/App.jsx",
  "src/data.js",
];

test("learner-facing resource indexes exclude inaccessible-source warnings", async () => {
  const entries = await Promise.all(
    learnerFacingResourceFiles.map(async (file) => [file, await readFile(file, "utf8")]),
  );

  for (const [file, content] of entries) {
    assert.doesNotMatch(content, /(?:抓取|返回 HTTP )403|返回 HTTP 404|字幕未核验|链接失效/, file);
    assert.doesNotMatch(content, /zhuanlan\.zhihu\.com\/p\/2027128115831260939/, file);
    assert.doesNotMatch(content, /my\.feishu\.cn\/wiki\/IQN1wMxixivvaKkqELlc1lmrnec/, file);
  }
});
