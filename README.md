<div align="right">
  <a href="#简体中文">简体中文</a> | <a href="#english">English</a>
</div>

<a id="简体中文"></a>

<div align="center">

# Hermes Learning Lab

**一套从首次启动到安全生产化的 Hermes Agent 中文交互课程。**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0b0b0a)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Lessons](https://img.shields.io/badge/课程-13%20课-e7a83e)](#学习路线)
[![Phases](https://img.shields.io/badge/路径-4%20阶段-70b58a)](./CURRICULUM.md)
[![Safety](https://img.shields.io/badge/运行模式-模拟%20%2B%20明示只读检测-d56c62)](#安全边界)

[快速开始](#快速开始) · [完整课程](./CURRICULUM.md) · [实验手册](./docs/labs/README.md) · [排错指南](./docs/TROUBLESHOOTING.md) · [资料研究](./RESEARCH.md) · [设计方案](./DESIGN.md)

</div>

![Hermes Learning Lab 三栏课程工作台](./preview.png)

## 目录

- [这是什么](#这是什么)
- [功能亮点](#功能亮点)
- [学习路线](#学习路线)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [安全边界](#安全边界)
- [资料与署名](#资料与署名)

## 这是什么

Hermes Learning Lab 是一个依据 [Hermes Agent 官方文档](https://hermes-agent.nousresearch.com/docs/)、[Nous Hermes 模型资料](https://huggingface.co/NousResearch/Hermes-4.3-36B)和 [AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners) 教学结构制作的中文学习平台。

每课都形成一个可验证闭环：

```text
课前诊断 -> 核心讲解 -> Agent 轨迹 -> 可执行实验 -> 成功标准 -> 课后检查 -> 延伸资料
```

> [!NOTE]
> 本项目是独立社区教学项目，不是 Nous Research 或 Microsoft 的官方产品。

## 功能亮点

| 学习体验 | 工程与安全 |
|---|---|
| 13 课、4 阶段渐进路径 | React + Vite 纯前端架构 |
| macOS、Windows、WSL2 与桌面端安装导航 | 官方命令可复制；真实操作由用户在应用中执行 |
| 官方 Desktop 实景图与可点击界面标注 | 图片本地保存并链接可核验来源 |
| 飞书控制台/客户端逐屏路径 | 覆盖 @提及门、Typing、原生审批卡与 200340 排错 |
| Desktop 与飞书真实回执验收 | 用户点击后才运行最小化本机只读状态检测 |
| 每课包含先修、诊断与实验验收 | Hermes 命令只模拟展示 |
| 单选、多选与配置构建器 | 不读取本机配置或凭据 |
| Agent 轨迹与即时纠错 | localStorage v2，兼容迁移 v1 |
| 阶段进度和掌握度反馈 | 桌面、平板、手机响应式布局 |
| 官方技术资料与模型卡入口 | 无账号、数据库或远程埋点 |

## 学习路线

| 阶段 | 课程 | 能力目标 |
|---|---|---|
| I 启动与基础 | 00 下载与多端接入 · 01 环境与诊断 · 02 Agent Loop · 03 模型与 Profile | 安装并完成桌面/飞书首轮体验，建立可工作的聊天基线 |
| II 可靠交互 | 04 Prompt 契约 · 05 工具/Context/审批 · 06 Session/Memory/SOUL | 让任务可验收、工具可审计、上下文不过度记忆 |
| III 扩展与自动化 | 07 Skills/Plugins/MCP · 08 Gateway/Cron/Hooks/Batch · 09 委派与路由 | 安装能力、构建自动化、拆分并路由独立任务 |
| IV 工程化与进阶 | 10 Sandbox/Egress/ACP · 11 推理/量化/微调 · 12 毕业项目 | 隔离执行、评测模型、交付可恢复生产工作流 |

完整先修关系、实验与成功标准见 [CURRICULUM.md](./CURRICULUM.md)。

## 快速开始

环境要求：Node.js 18+、npm 9+。

```bash
git clone https://github.com/ChrysFu-FndVent/hermes-learning-lab.git
cd hermes-learning-lab
npm install
npm run dev
```

Vite 默认提供 `http://localhost:5173/`。质量检查：

```bash
npm run lint
npm run build
```

## 项目结构

```text
hermes-learning-lab/
├── src/
│   ├── App.jsx                 # 学习引擎、视图与进度迁移
│   ├── data.js                 # 13 课、安装路径、来源和架构数据
│   └── styles.css              # 三栏工作台与响应式设计
├── docs/
│   ├── labs/README.md          # 真实环境实验手册
│   ├── TROUBLESHOOTING.md      # 安装、模型、工具和自动化排错
│   └── adr/                    # 架构决策记录
├── public/ui-reference/        # 官方界面参考图及来源说明
├── CURRICULUM.md               # 课程体系与知识递进
├── DESIGN.md                   # 产品、交互与技术设计
├── RESEARCH.md                 # 资料研究与采用决策
└── preview.png                 # 当前界面预览
```

## 安全边界

浏览器模拟默认不会调用 Shell、读取 `~/.hermes`、写入配置、安装扩展、连接消息平台或上传进度。用户点击“检测本机状态”时，本地 Vite 服务只执行 `which/where hermes`、进程存在性检查和 `hermes gateway status` 三类只读探针，并且只返回布尔状态；不会返回路径、配置、日志、密钥、会话或飞书消息。真实消息回执由学习者主动粘贴并仅在浏览器内判定。

浏览器模拟的取舍见 [ADR 0001](./docs/adr/0001-browser-simulation-first.md)，明示只读检测边界见 [ADR 0002](./docs/adr/0002-explicit-read-only-local-verification.md)。真实实验前请核对 [Hermes 当前官方文档](https://hermes-agent.nousresearch.com/docs/)。

## 资料与署名

- [Hermes Agent](https://github.com/NousResearch/hermes-agent)：运行时与命令事实源
- [Hermes 4.3 model card](https://huggingface.co/NousResearch/Hermes-4.3-36B)：模型、Prompt、Serving 与采样事实源
- [AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners)：课程结构与实验教学参考
- [RESEARCH.md](./RESEARCH.md)：来源、结论与版本注意事项

---

<div align="center"><sub>Learn the boundary. Run the lab. Ship with evidence.</sub></div>

<a id="english"></a>

<div align="center">

# Hermes Learning Lab

**An interactive Chinese curriculum for learning Hermes Agent, from first setup to safe production workflows.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0b0b0a)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Lessons](https://img.shields.io/badge/Lessons-13-e7a83e)](#learning-path)
[![Phases](https://img.shields.io/badge/Phases-4-70b58a)](./CURRICULUM.md)
[![Safety](https://img.shields.io/badge/Runtime-Simulation%20%2B%20Explicit%20Read--only%20Probe-d56c62)](#safety-boundaries)

[Quick Start](#quick-start) · [Curriculum](./CURRICULUM.md) · [Lab Guide](./docs/labs/README.md) · [Troubleshooting](./docs/TROUBLESHOOTING.md) · [Research](./RESEARCH.md) · [Design](./DESIGN.md)

</div>

![Hermes Learning Lab three-column course workspace](./preview.png)

## Table of Contents

- [What It Is](#what-it-is)
- [Highlights](#highlights)
- [Learning Path](#learning-path)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Safety Boundaries](#safety-boundaries)
- [Sources](#sources)

## What It Is

Hermes Learning Lab is a Chinese-language learning platform based on the [official Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/), the [Nous Hermes model card](https://huggingface.co/NousResearch/Hermes-4.3-36B), and the curriculum structure of [AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners).

Every lesson uses the same verifiable loop:

```text
Pre-quiz -> Core concepts -> Agent trace -> Hands-on lab -> Success criteria -> Post-check -> References
```

> [!NOTE]
> This is an independent community education project, not an official product of Nous Research or Microsoft.

## Highlights

| Learning Experience | Engineering and Safety |
|---|---|
| 13 lessons across 4 progressive phases | Pure React + Vite frontend |
| macOS, Windows, WSL2, and Desktop setup guides | Copyable official commands; real actions stay user-controlled |
| Official Desktop UI reference with clickable landmarks | Local image with a verifiable source link |
| Feishu console and client UI routes | Mentions, typing state, native approvals, and error 200340 recovery |
| Desktop and Feishu receipt checks | Minimal local read-only probes run only after an explicit click |
| Prerequisites, diagnostics, and lab acceptance in every lesson | Hermes commands are simulations only |
| Single-choice, multiple-choice, and configuration builders | No access to local configuration or credentials |
| Agent traces and targeted feedback | localStorage v2 with v1 migration |
| Phase progress and mastery tracking | Responsive desktop, tablet, and mobile layouts |
| Direct links to official technical sources | No accounts, database, or remote analytics |

## Learning Path

| Phase | Lessons | Outcome |
|---|---|---|
| I Setup and Foundations | 00 Download and Channels · 01 Environment and Doctor · 02 Agent Loop · 03 Models and Profiles | Install Hermes, rehearse Desktop/Feishu, and establish a working chat baseline |
| II Reliable Interaction | 04 Prompt Contracts · 05 Tools/Context/Approval · 06 Sessions/Memory/SOUL | Make tasks testable, tools auditable, and context appropriately scoped |
| III Extensions and Automation | 07 Skills/Plugins/MCP · 08 Gateway/Cron/Hooks/Batch · 09 Delegation and Routing | Install capabilities, automate safely, and route independent work |
| IV Production Engineering | 10 Sandbox/Egress/ACP · 11 Inference/Quantization/Tuning · 12 Capstone | Isolate execution, evaluate models, and deliver recoverable workflows |

See [CURRICULUM.md](./CURRICULUM.md) for prerequisites, lab deliverables, and mastery criteria.

## Quick Start

Requirements: Node.js 18+ and npm 9+.

```bash
git clone https://github.com/ChrysFu-FndVent/hermes-learning-lab.git
cd hermes-learning-lab
npm install
npm run dev
```

Vite normally serves the app at `http://localhost:5173/`. Quality checks:

```bash
npm run lint
npm run build
```

## Project Structure

```text
hermes-learning-lab/
├── src/                         # React learning engine, curriculum data, styles
├── docs/labs/README.md          # Real-environment lab guide
├── docs/TROUBLESHOOTING.md      # Setup, model, tools, and automation recovery
├── docs/adr/                    # Architecture decisions
├── public/ui-reference/         # Attributed official UI reference assets
├── CURRICULUM.md                # Curriculum map and progression
├── DESIGN.md                    # Product and technical design
├── RESEARCH.md                  # Sources and adoption decisions
└── preview.png                  # Current desktop preview
```

## Safety Boundaries

Browser simulations do not invoke a shell, read `~/.hermes`, change configuration, install extensions, connect to messaging platforms, or upload progress. When the learner explicitly clicks the local status check, the Vite server runs only command discovery, process-presence, and `hermes gateway status` read-only probes and returns booleans. It never returns paths, configuration, logs, secrets, sessions, or messages. Receipt text is submitted explicitly and evaluated in the browser.

See [ADR 0001](./docs/adr/0001-browser-simulation-first.md) for simulation tradeoffs and [ADR 0002](./docs/adr/0002-explicit-read-only-local-verification.md) for the local verification boundary. Verify real commands against the current [Hermes documentation](https://hermes-agent.nousresearch.com/docs/).

## Sources

- [Hermes Agent](https://github.com/NousResearch/hermes-agent): runtime and command source of truth
- [Hermes 4.3 model card](https://huggingface.co/NousResearch/Hermes-4.3-36B): model, prompt, serving, and sampling details
- [AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners): curriculum and lab structure reference
- [RESEARCH.md](./RESEARCH.md): research conclusions and version notes

---

<div align="center"><sub>Learn the boundary. Run the lab. Ship with evidence.</sub></div>

<p align="right"><a href="#简体中文">返回简体中文</a></p>
