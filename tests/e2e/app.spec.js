import { expect, test } from "@playwright/test";

test("loads the first lesson and switches primary views", async ({ page }) => {
  await page.goto("./");

  await expect(page).toHaveTitle("Hermes Learning Lab");
  await expect(page.getByRole("heading", { level: 1, name: "安装 Hermes，并完成桌面与飞书首轮体验" })).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await page.getByRole("tab", { name: "资料研究" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Hermes 技术与教学资料" })).toBeVisible();
  await expect(page.getByText("Hermes Agent v0.20.0（v2026.8.3）")).toBeVisible();
  await expect(page.locator(".access-state.is-open", { hasText: "YouTube 直接观看" })).toHaveCount(3);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  await page.getByRole("tab", { name: "教学架构" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "从资料到可验证学习闭环" })).toBeVisible();
});

test("static builds disable the local probe and keep receipt verification", async ({ page }) => {
  await page.route("http://127.0.0.1:43127/v1/health", (route) => route.abort());
  await page.goto("./");

  await expect(page.getByText("本机伴随服务未连接")).toBeVisible();
  await expect(page.getByRole("link", { name: "下载 macOS 启动脚本" })).toBeVisible();
  await expect(page.getByRole("button", { name: "检测本机状态" })).toHaveCount(0);

  await page.getByLabel("Hermes 回复").fill("DESKTOP_OK");
  await page.getByRole("button", { name: "验证回执" }).click();
  await expect(page.getByText("回执匹配，真实消息链路已通过。")).toBeVisible();
});

test("pairs with the local companion and shows redacted status", async ({ page }) => {
  await page.route("http://127.0.0.1:43127/v1/health", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ service: "hermes-learning-lab-companion", version: 1, pairingRequired: true }) }));
  await page.route("http://127.0.0.1:43127/v1/pair", async (route) => {
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ token: "test-token" }) });
  });
  await page.route("http://127.0.0.1:43127/v1/check", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ hermesInstalled: true, desktopRunning: true, gatewayRunning: false, hermesVersion: "v0.20.0", doctor: { status: "pass", summary: "Doctor completed without blocking issues." }, checkedAt: "2026-08-08T00:00:00.000Z" }) }));
  await page.goto("./");

  await expect(page.getByText("先配对这台浏览器")).toBeVisible();
  await page.getByLabel("本机伴随服务配对码").fill("ABCD-2345");
  await page.getByRole("button", { name: "配对" }).click();
  await expect(page.getByRole("button", { name: "检测本机状态" })).toBeVisible();
  await page.getByRole("button", { name: "检测本机状态" }).click();
  await expect(page.getByText("Doctor completed without blocking issues.")).toBeVisible();
  await expect(page.getByText("Hermes CLI")).toBeVisible();
});

test("mobile navigation stays within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);

  await page.getByRole("button", { name: "打开课程导航" }).click();
  await expect(page.locator(".course-sidebar")).toHaveClass(/is-open/);
  await page.getByRole("button", { name: "01 环境与诊断" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "先建立一个可工作的 Hermes" })).toBeVisible();
  await expect(page.locator(".course-sidebar")).not.toHaveClass(/is-open/);
});
