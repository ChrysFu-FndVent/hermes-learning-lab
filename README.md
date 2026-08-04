<a id="readme-top"></a>

<!-- README-ARCHITECT: visual-shell -->
<p align="center">
  <img src="assets/readme/hermes-learning-lab-banner.svg" alt="hermes-learning-lab project banner" width="100%" />
</p>
<p align="center">
  <a href="https://github.com/ChrysFu-FndVent/hermes-learning-lab/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/ChrysFu-FndVent/hermes-learning-lab?style=for-the-badge&amp;logo=github" /></a>
  <a href="https://github.com/ChrysFu-FndVent/hermes-learning-lab/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/ChrysFu-FndVent/hermes-learning-lab?style=for-the-badge" /></a>
  <a href="https://github.com/ChrysFu-FndVent/hermes-learning-lab/search?l=CSS"><img alt="Top language" src="https://img.shields.io/github/languages/top/ChrysFu-FndVent/hermes-learning-lab?style=for-the-badge" /></a>
</p>
<!-- README-ARCHITECT: visual-shell end -->

<div align="center">

# Hermes Learning Lab

**Learn Hermes by operating it, verifying the result, and recovering from failure.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0b0b0a)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=0b0b0a)](./src/)
[![Lessons](https://img.shields.io/badge/Lessons-13-e7a83e?style=for-the-badge)](./CURRICULUM.md)

[课程大纲](./CURRICULUM.md) · [实验手册](./docs/labs/README.md) · [电子资料库](./resources/README.md) · [排错指南](./docs/TROUBLESHOOTING.md)

</div>

![Hermes Learning Lab interactive course workspace](./preview.png)

<div align="right"><a href="#english">English</a> | <a href="#简体中文">简体中文</a></div>

<a id="english"></a>

## English

<details>
<summary>Table of Contents</summary>

- [Overview](#overview)
- [Highlights](#highlights)
- [Learning Loop](#learning-loop)
- [Learning Path](#learning-path)
- [How to Use](#how-to-use)
- [Online Learning Materials](#online-learning-materials)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Checks and Safety](#checks-and-safety)
- [Sources and License](#sources-and-license)

</details>

## Overview

Hermes Learning Lab is a Chinese interactive curriculum for learners new to Hermes Agent. It starts with the real Desktop and Feishu surfaces, then progresses through CLI usage, model switching, prompt contracts, Memory, Skills, automation, delegation, isolation, and recovery.

The course adapts the structure of [microsoft/AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners): environment setup and diagnostics come first, followed by self-contained labs with explicit inputs, expected results, post-checks, and further reading. Hermes commands and configuration facts are grounded in the [official documentation](https://hermes-agent.nousresearch.com/docs/) and [official repository](https://github.com/NousResearch/hermes-agent).

> [!NOTE]
> This is an independent community education project, not an official Nous Research or Microsoft product.

## Highlights

| Hands-on learning | Evidence and safety |
|---|---|
| macOS, native Windows, WSL2, and Desktop setup routes | Setup, basic chat, and Doctor establish the first baseline |
| Official Hermes Desktop screenshot with interactive landmarks | Learners submit `DESKTOP_OK`; the course never reads window content |
| Feishu developer-console and client walkthroughs | Covers WebSocket, mentions, typing, approval cards, and error `200340` |
| One progressive 13-lesson path | Theory is reduced to the minimum needed for each operation |
| Pre-check, four operational steps, and a real lab in every lesson | Every lab defines success criteria, evidence, and recovery actions |
| Choices, builders, and interface simulations | Lab verification plus the post-check forms two-part mastery evidence |
| Official references and per-lesson community readings | Community material never replaces official command verification |
| Automatic local progress | `localStorage v3` with migration from v1/v2 |

## Learning Loop

```text
Pre-check
  -> Essential context and core operations
  -> Observable agent trace
  -> Real-environment lab
  -> Result checklist
  -> Evidence capture and recovery rehearsal
  -> Post-check
  -> Official and community references
```

The course shows no estimated lesson durations. A lesson contributes to mastery only after both its real lab and post-check are verified.

## Learning Path

| Phase | Lessons | Evidence produced |
|---|---|---|
| I Setup and Foundations | 00 Download and Channels · 01 Environment and Doctor · 02 Agent Loop · 03 Model Switching and Recovery | Desktop/Feishu receipts, Doctor baseline, read-only tool evidence, model rollback record |
| II Reliable Interaction | 04 Prompt Contracts · 05 Tools/Context/Approval · 06 Sessions/Memory/SOUL | Validated prompt, minimal tool scope, redacted Memory |
| III Extensions and Automation | 07 Skill Install/Smoke Test · 08 Gateway/Cron/Hooks/Batch · 09 Parallel Tasks and Review | Skill review, idempotent automation, `/agents` closure evidence |
| IV Production Engineering | 10 Sandbox/Egress/ACP · 11 Backup/Update/Restore · 12 Capstone | Isolation negative tests, restore rehearsal, evaluation-driven workflow |

See [CURRICULUM.md](./CURRICULUM.md) for prerequisites and mastery criteria, and [docs/labs/README.md](./docs/labs/README.md) for the real-environment evidence template.

## How to Use

### 1. Start the interactive site

Requirements: Node.js 18+ and npm 9+.

```bash
git clone https://github.com/ChrysFu-FndVent/hermes-learning-lab.git
cd hermes-learning-lab
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173/`. If the port is busy, Vite reports the replacement port.

### 2. Complete a lesson

1. Select a lesson and complete the ungraded pre-check.
2. Follow the agent trace and four core operational steps.
3. Run the real lab in a dedicated directory, test Profile, or Sandbox.
4. Check every item under result verification against the actual outcome.
5. Save the requested redacted evidence and confirm the recovery action is executable.
6. Record the lab verification, then pass the post-check.
7. Continue only after the progress rail confirms both forms of evidence.

### 3. Use the Desktop and Feishu simulations

Lesson 00 includes Desktop and Feishu simulations for sessions, models, mentions, and tool approval. They never connect to a real Hermes runtime. Real verification requires the learner to run the prompt in Desktop or Feishu and explicitly submit a redacted receipt.

### 4. Check local status

Only an explicit click invokes the local Vite probe. It checks whether the Hermes command exists, whether the Desktop process is running, and whether Gateway reports a usable state. It returns booleans only, never paths, configuration, secrets, logs, sessions, or messages.

> [!IMPORTANT]
> Static hosting and direct build-file access do not provide the local probe. Simulations, resource links, and browser progress still work.

### 5. Build a local preview

```bash
npm run lint
npm run build
npm run preview
```

## Online Learning Materials

The [resources/](./resources/) folder contains indexes, original summaries, access states, and source links only. It does not copy third-party PDFs, article bodies, or video transcripts.

| Material | Best for | Preview |
|---|---|---|
| Hermes Agent documentation | Current setup, Desktop, Feishu, Skills, Memory, Cron, security | [Open docs](https://hermes-agent.nousresearch.com/docs/) |
| NousResearch/hermes-agent | Current commands, releases, source, implementation boundaries | [Open repository](https://github.com/NousResearch/hermes-agent) |
| Hermes Agent Orange Book 2.0 | Chinese overview of UI, memory, multi-agent workflows, and security | [Preview Chinese PDF](https://github.com/alchaincyf/hermes-agent-orange-book/blob/main/Hermes-Agent%E6%A9%99%E7%9A%AE%E4%B9%A62.0-v260607.pdf) |
| hermes-agent-zh | Chinese setup, providers, automation, messaging, and FAQ | [Open tutorial](https://github.com/dongsheng123132/hermes-agent-zh) |
| awesome-hermes-agent | Skills, plugins, tools, surfaces, and advanced guides | [Open index](https://github.com/0xNyk/awesome-hermes-agent) |
| Full beginner tutorial | Setup, Memory, Subagents, Cron, Skills, backup, firewall | [Watch on YouTube](https://www.youtube.com/watch?v=-EivK7vpOXY) |
| Ten beginner tips | Models, SOUL, Memory, Doctor, UI, migration, Skills | [Watch on YouTube](https://www.youtube.com/watch?v=hLiN_X7dzdw) |
| Desktop release tutorial | Real Windows, macOS, and Linux Desktop UI | [Watch on YouTube](https://www.youtube.com/watch?v=FdSVeOAd480) |

Browse the [resource index](./resources/README.md), [official references](./resources/OFFICIAL.md), [community materials](./resources/COMMUNITY.md), and [lesson map](./resources/LESSON-MAP.md).

> [!WARNING]
> YouTube transcripts were not reliably available. Anonymous retrieval of the Zhihu article returned `403`, and an older Feishu document returned `404`. These sources are not used to validate concrete commands.

## Architecture

![Hermes Learning Lab system architecture](./assets/readme/learning-system.drawio.png)

The React workspace loads curriculum and resource data from `src/data.js`. Diagnostics, lab verification, post-checks, and the current position are saved in browser `localStorage`. The Vite middleware reaches the read-only local probe only after an explicit click. The editable source is [learning-system.drawio](./assets/readme/learning-system.drawio).

## Project Structure

```text
hermes-learning-lab/
├── src/                         # React learning engine, curriculum data, styles
├── resources/                   # Electronic material indexes and lesson map
├── docs/labs/README.md          # Real-environment lab guide
├── docs/TROUBLESHOOTING.md      # Setup, UI, tooling, and recovery guide
├── docs/adr/                    # Architecture decisions
├── assets/readme/               # README architecture asset and editable source
├── public/ui-reference/         # Attributed official UI reference
├── CURRICULUM.md                # Curriculum and two-part mastery model
├── RESEARCH.md                  # Source research and evidence limits
└── preview.png                  # Current product screenshot
```

## Checks and Safety

```bash
npm run lint
npm run build
```

- Browser simulations never invoke a shell, modify `~/.hermes`, install extensions, or connect messaging platforms.
- The local probe runs only after an explicit click and returns three boolean status values.
- Real labs should use dedicated directories, isolated Profiles, Sandboxes, and one-time approvals.
- Receipts and reports must exclude tokens, app secrets, user IDs, chat history, and personal paths.
- Community commands must be checked against the current official documentation.

See [ADR 0001](./docs/adr/0001-browser-simulation-first.md) and [ADR 0002](./docs/adr/0002-explicit-read-only-local-verification.md) for the implementation boundaries.

## Sources and License

- [AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners): setup, lab, quiz, and further-reading structure.
- [Hermes Agent](https://github.com/NousResearch/hermes-agent): runtime, commands, and UI facts.
- [Hermes 4.3 model card](https://huggingface.co/NousResearch/Hermes-4.3-36B): model, prompt, serving, and sampling references.
- [RESEARCH.md](./RESEARCH.md): research findings, adoption decisions, and version risks.

This repository currently has no `LICENSE` file. Public visibility does not grant permission to copy, modify, or redistribute it by default. Third-party materials remain subject to their source licenses and copyright terms.

<p align="right"><a href="#readme-top">Back to top</a></p>

<a id="简体中文"></a>

## 简体中文

<details>
<summary>目录</summary>

- [项目简介](#项目简介)
- [课程特色](#课程特色)
- [教学闭环](#教学闭环)
- [学习路线](#学习路线)
- [使用方法](#使用方法)
- [电子资料在线预览](#电子资料在线预览)
- [系统架构](#系统架构)
- [项目结构](#项目结构)
- [检查与安全边界](#检查与安全边界)
- [资料与许可](#资料与许可)

</details>

## 项目简介

Hermes Learning Lab 是一个面向零基础学习者的 Hermes Agent 中文交互课程。课程从 Desktop 和飞书真实界面开始，再逐步进入 CLI、模型切换、Prompt 契约、Memory、Skills、自动化、并行任务、安全隔离与恢复。

课程结构参考 [microsoft/AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners)：先准备环境和诊断基础，再通过独立实验、明确输入、预期结果、课后检查与延伸资料形成学习闭环。Hermes 的命令和配置事实以[官方文档](https://hermes-agent.nousresearch.com/docs/)及[官方仓库](https://github.com/NousResearch/hermes-agent)为准。

> [!NOTE]
> 这是独立社区教学项目，不是 Nous Research 或 Microsoft 的官方产品。

## 课程特色

| 操作学习 | 结果与安全 |
|---|---|
| macOS、Windows 原生、WSL2 与 Desktop 安装路径 | 安装后先完成 Setup、普通聊天和 Doctor 基线 |
| Hermes Desktop 官方实景图与可点击地标 | 用户主动粘贴 `DESKTOP_OK` 回执，课程不读取窗口内容 |
| 飞书控制台与客户端双路径指南 | 覆盖 WebSocket、@提及、Typing、审批卡和 `200340` 排错 |
| 13 课单线渐进路径 | 定义内容压缩为操作所需的最小背景 |
| 每课有课前诊断、四步操作和真实实验 | 每项实验都给出成功标准、证据与恢复动作 |
| 单选、多选、配置构建器和模拟界面 | 实验验收与课后检查组成双证据掌握度 |
| 官方资料与社区延伸阅读按课匹配 | 社区内容不替代官方命令核验 |
| 本地进度自动保存 | `localStorage v3`，兼容迁移 v1/v2 记录 |

## 教学闭环

每课都执行同一套可验证流程：

```text
课前诊断
  -> 必要说明与核心操作
  -> Agent 行动轨迹
  -> 真实环境实验
  -> 逐项结果核验
  -> 保存证据与演练恢复
  -> 课后检查
  -> 官方资料与社区延伸阅读
```

课程不会显示学习时长估计。完成课后题不等于完成真实操作；只有实验验收和课后检查都通过，本课才计入掌握度。

## 学习路线

| 阶段 | 课程 | 交付结果 |
|---|---|---|
| I 启动与基础 | 00 下载与多端接入 · 01 环境与诊断 · 02 Agent Loop · 03 模型切换与回退 | Desktop/飞书回执、Doctor 基线、只读工具证据、模型回切记录 |
| II 可靠交互 | 04 Prompt 契约 · 05 工具/Context/审批 · 06 Session/Memory/SOUL | 可校验 Prompt、最小工具范围、脱敏 Memory |
| III 扩展与自动化 | 07 Skill 安装/冒烟测试 · 08 Gateway/Cron/Hooks/Batch · 09 并行任务与收口 | Skill 审查记录、幂等自动化、`/agents` 收口证据 |
| IV 工程化与进阶 | 10 Sandbox/Egress/ACP · 11 备份/更新/恢复 · 12 毕业项目 | 隔离负向测试、恢复演练、评测驱动工作流 |

完整先修关系和掌握标准见 [CURRICULUM.md](./CURRICULUM.md)，真实环境记录模板见 [docs/labs/README.md](./docs/labs/README.md)。

## 使用方法

### 1. 启动交互式网站

环境要求：Node.js 18+、npm 9+。

```bash
git clone https://github.com/ChrysFu-FndVent/hermes-learning-lab.git
cd hermes-learning-lab
npm install
npm run dev
```

打开终端显示的地址；默认是 `http://127.0.0.1:5173/`。如果该端口已占用，Vite 会显示实际使用的新端口。

### 2. 完成一门课程

1. 从左侧选择课程，先完成不计分的课前诊断。
2. 按顺序查看 Agent 轨迹和四个核心操作步骤。
3. 在专用练习目录、测试 Profile 或 Sandbox 中执行真实实验。
4. 对照“操作结果检验”逐项核对成功标准。
5. 保存课程指定的脱敏证据，并确认失败恢复动作可执行。
6. 点击“确认结果已核验”，再通过课后检查。
7. 当右侧显示“本课已取得实验与课后检查双证据”后进入下一课。

### 3. 使用 Desktop 与飞书模拟

第 00 课包含 Hermes Desktop 和飞书端模拟。模拟练习用于熟悉会话、模型、@提及和工具审批，不会连接真实 Hermes。真实界面验收需要学习者在 Desktop 或飞书中主动执行校验 Prompt，再把脱敏回执粘贴回课程。

### 4. 检测本机状态

只有点击“检测本机状态”时，本地 Vite 服务才执行最小只读探针：检查 Hermes 命令是否存在、Desktop 进程是否运行，以及 Gateway 是否处于可用状态。接口只返回布尔值，不返回安装路径、配置、密钥、日志、会话或消息。

> [!IMPORTANT]
> 静态 GitHub Pages 或直接打开构建文件时没有本机探针；课程模拟、资料链接和浏览器进度仍可使用。

### 5. 构建本地预览

```bash
npm run lint
npm run build
npm run preview
```

## 电子资料在线预览

仓库的 [resources/](./resources/) 目录只保存分类索引、原创摘要、访问状态和来源链接，不复制第三方 PDF、文章正文或视频字幕。

| 资料 | 适合学习 | 在线预览 |
|---|---|---|
| Hermes Agent 官方文档 | 当前安装、Desktop、飞书、Skills、Memory、Cron、安全与排错 | [打开文档](https://hermes-agent.nousresearch.com/docs/) |
| NousResearch/hermes-agent | 当前命令、Release、源码与实现边界 | [打开仓库](https://github.com/NousResearch/hermes-agent) |
| Hermes Agent 橙皮书 2.0 | 中文整体理解、界面、记忆、多 Agent 与安全 | [预览中文版 PDF](https://github.com/alchaincyf/hermes-agent-orange-book/blob/main/Hermes-Agent%E6%A9%99%E7%9A%AE%E4%B9%A62.0-v260607.pdf) |
| hermes-agent-zh | 中文安装、Provider、自动化、IM 和 FAQ | [打开教程](https://github.com/dongsheng123132/hermes-agent-zh) |
| awesome-hermes-agent | Skills、插件、工具、界面与进阶指南 | [打开索引](https://github.com/0xNyk/awesome-hermes-agent) |
| Hermes Agent 保姆级教学 | 安装、Memory、Subagent、Cron、Skills、备份和防火墙演示 | [观看 YouTube](https://www.youtube.com/watch?v=-EivK7vpOXY) |
| Hermes Agent 新手使用十大技巧 | 模型、SOUL、Memory、Doctor、UI、迁移和 Skills | [观看 YouTube](https://www.youtube.com/watch?v=hLiN_X7dzdw) |
| Hermes Agent 桌面版教程 | Windows、macOS、Linux Desktop 真实界面 | [观看 YouTube](https://www.youtube.com/watch?v=FdSVeOAd480) |

更多访问状态与课程映射：

- [资料库首页](./resources/README.md)
- [官方资料与命令核验](./resources/OFFICIAL.md)
- [社区电子书、文章与视频](./resources/COMMUNITY.md)
- [课程与资料映射](./resources/LESSON-MAP.md)

> [!WARNING]
> YouTube 字幕目前未稳定取得；知乎文章的无登录抓取返回 `403`；一个飞书旧文档链接返回 `404`。这些来源不会用于证明具体命令正确。

## 系统架构

![Hermes Learning Lab system architecture](./assets/readme/learning-system.drawio.png)

React 工作区从 `src/data.js` 读取课程和资料数据。诊断、实验验收、课后检查与最近位置保存在浏览器 `localStorage`；只有用户明确点击后，Vite 中间件才调用只读本机状态探针。可编辑图源见 [learning-system.drawio](./assets/readme/learning-system.drawio)。

## 项目结构

```text
hermes-learning-lab/
├── src/
│   ├── App.jsx                    # 学习引擎、实验验收、进度迁移与视图
│   ├── data.js                    # 13 课、资料映射、安装与界面数据
│   └── styles.css                 # 三栏工作台与响应式样式
├── resources/
│   ├── README.md                  # 电子资料总索引
│   ├── OFFICIAL.md                # 官方资料与命令核验入口
│   ├── COMMUNITY.md               # 社区电子书、文章与视频
│   └── LESSON-MAP.md              # 逐课资料映射
├── docs/
│   ├── labs/README.md             # 真实环境实验手册
│   ├── TROUBLESHOOTING.md         # 安装、界面、工具和恢复排错
│   └── adr/                       # 架构决策记录
├── assets/readme/                 # README 架构图与可编辑图源
├── public/ui-reference/           # 有来源说明的官方界面参考图
├── CURRICULUM.md                  # 课程体系和双证据掌握标准
├── RESEARCH.md                    # 资料研究、采用边界和版本说明
└── preview.png                    # 当前产品界面截图
```

## 检查与安全边界

```bash
npm run lint
npm run build
```

- 浏览器模拟不会调用 Shell、修改 `~/.hermes`、安装扩展或连接消息平台。
- 本机探针只在明确点击后执行，并只返回 Hermes、Desktop、Gateway 三类布尔状态。
- 真实实验建议使用专用目录、隔离 Profile、Sandbox 和单次审批。
- 回执和实验记录不得包含 Token、App Secret、用户 ID、聊天历史或个人路径。
- 社区资料中的命令必须回到当前官方文档复核。

设计取舍见 [ADR 0001](./docs/adr/0001-browser-simulation-first.md) 和 [ADR 0002](./docs/adr/0002-explicit-read-only-local-verification.md)。

## 资料与许可

- [AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners)：课程 Setup、实验、测验和延伸阅读结构参考。
- [Hermes Agent](https://github.com/NousResearch/hermes-agent)：运行时、命令和界面事实源。
- [Hermes 4.3 model card](https://huggingface.co/NousResearch/Hermes-4.3-36B)：模型、Prompt、Serving 与采样资料。
- [RESEARCH.md](./RESEARCH.md)：来源核验、采用决策和版本风险。

本仓库当前未包含 `LICENSE` 文件。公开可见不等于自动授予复制、修改或再分发权；第三方资料继续受各自来源的许可与版权条款约束。

<p align="right"><a href="#readme-top">返回顶部</a></p>

---
