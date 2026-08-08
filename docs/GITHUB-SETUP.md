# GitHub 发布与社区设置

仓库已经包含 GitHub Actions 工作流 `.github/workflows/ci-pages.yml`。它会在 Pull Request 和 `main` 推送时运行 lint、Pages 构建与 Playwright；`main` 通过后部署 `dist/`。

## 首次启用 Pages

1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment** 中把 Source 设为 **GitHub Actions**。
3. 推送到 `main` 或手动运行 **CI and Pages** 工作流。
4. 部署成功后把仓库 Website 设置为：

   `https://chrysfu.github.io/hermes-learning-lab/`

静态站点不会运行本机探针。学习者仍可完成模拟、回执验收、实验清单和本地进度保存。

## Repository topics

建议设置以下 Topics：

```text
hermes-agent
ai-agents
chinese-tutorial
interactive-learning
multi-agent
feishu
```

这些值也记录在 `package.json#keywords`，避免仓库元数据与项目文档漂移。

## Discussions 路由

使用现有类别即可建立四条入口：

| 用途 | Discussion 类别 |
|---|---|
| 学习打卡 | General |
| 环境排错 | Q&A |
| 课程纠错 | Ideas |
| 毕业项目展示 | Show and tell |

入口已写入 `CONTRIBUTING.md`。如以后新增中文类别，应同步更新其中的链接。

## 传播方式

对外分享时优先指向一个可立即完成的实验，例如 Lesson 00 的 Desktop/飞书回执，而不是只发布完整课程介绍。发布前确认链接、Hermes 核验版本和隐私提示仍然有效。
