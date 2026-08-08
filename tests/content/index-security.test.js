import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the production entrypoint does not load third-party scripts", async () => {
  const html = await readFile("index.html", "utf8");

  assert.doesNotMatch(html, /<script[^>]+src=["']https?:\/\//i);
  assert.doesNotMatch(html, /mcp\.figma\.com\/mcp\/html-to-design\/capture\.js/i);
});
