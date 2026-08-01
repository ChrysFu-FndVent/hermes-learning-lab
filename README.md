<div align="right">
  <a href="#简体中文">简体中文</a> | <a href="#english">English</a>
</div>

<a id="简体中文"></a>

<div align="center">

# Hermes Learning Lab

**一套从首次启动到安全生产化的 Hermes Agent 中文交互课程。**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0b0b0a)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Lessons](https://img.shields.io/badge/课程-12%20课-e7a83e)](#学习路线)
[![Phases](https://img.shields.io/badge/路径-4%20阶段-70b58a)](./CURRICULUM.md)
[![Safety](https://img.shields.io/badge/运行模式-浏览器模拟-d56c62)](#安全边界)

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
| 12 课、4 阶段渐进路径 | React + Vite 纯前端架构 |
| 每课包含先修、诊断与实验验收 | Hermes 命令只模拟展示 |
| 单选、多选与配置构建器 | 不读取本机配置或凭据 |
| Agent 轨迹与即时纠错 | localStorage v2，兼容迁移 v1 |
| 阶段进度和掌握度反馈 | 桌面、平板、手机响应式布局 |
| 官方技术资料与模型卡入口 | 无账号、数据库或远程埋点 |

## 学习路线

| 阶段 | 课程 | 能力目标 |
|---|---|---|
| I 启动与基础 | 00 环境与诊断 · 01 Agent Loop · 02 模型与 Profile | 建立可工作的聊天基线，理解运行循环和配置分层 |
| II 可靠交互 | 03 Prompt 契约 · 04 工具/Context/审批 · 05 Session/Memory/SOUL | 让任务可验收、工具可审计、上下文不过度记忆 |
| III 扩展与自动化 | 06 Skills/Plugins/MCP · 07 Gateway/Cron/Hooks/Batch · 08 委派与路由 | 安装能力、构建自动化、拆分并路由独立任务 |
| IV 工程化与进阶 | 09 Sandbox/Egress/ACP · 10 推理/量化/微调 · 11 毕业项目 | 隔离执行、评测模型、交付可恢复生产工作流 |

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
│   ├── data.js                 # 12 课、来源和架构数据
│   └── styles.css              # 三栏工作台与响应式设计
├── docs/
│   ├── labs/README.md          # 真实环境实验手册
│   ├── TROUBLESHOOTING.md      # 安装、模型、工具和自动化排错
│   └── adr/                    # 架构决策记录
├── CURRICULUM.md               # 课程体系与知识递进
├── DESIGN.md                   # 产品、交互与技术设计
├── RESEARCH.md                 # 资料研究与采用决策
└── preview.png                 # 当前界面预览
```

## 安全边界

当前应用不会调用 Shell、读取 `~/.hermes`、写入配置、安装扩展、连接消息平台或上传进度。实验中的命令仅供学习；进入真实环境时应使用隔离 Profile、测试目录和最小权限。

浏览器模拟的取舍见 [ADR 0001](./docs/adr/0001-browser-simulation-first.md)，真实实验前请核对 [Hermes 当前官方文档](https://hermes-agent.nousresearch.com/docs/)。

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
[![Lessons](https://img.shields.io/badge/Lessons-12-e7a83e)](#learning-path)
[![Phases](https://img.shields.io/badge/Phases-4-70b58a)](./CURRICULUM.md)
[![Safety](https://img.shields.io/badge/Runtime-Browser%20Simulation-d56c62)](#safety-boundaries)

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
| 12 lessons across 4 progressive phases | Pure React + Vite frontend |
| Prerequisites, diagnostics, and lab acceptance in every lesson | Hermes commands are simulations only |
| Single-choice, multiple-choice, and configuration builders | No access to local configuration or credentials |
| Agent traces and targeted feedback | localStorage v2 with v1 migration |
| Phase progress and mastery tracking | Responsive desktop, tablet, and mobile layouts |
| Direct links to official technical sources | No accounts, database, or remote analytics |

## Learning Path

| Phase | Lessons | Outcome |
|---|---|---|
| I Setup and Foundations | 00 Environment and Doctor · 01 Agent Loop · 02 Models and Profiles | Establish a working chat baseline and understand runtime/configuration layers |
| II Reliable Interaction | 03 Prompt Contracts · 04 Tools/Context/Approval · 05 Sessions/Memory/SOUL | Make tasks testable, tools auditable, and context appropriately scoped |
| III Extensions and Automation | 06 Skills/Plugins/MCP · 07 Gateway/Cron/Hooks/Batch · 08 Delegation and Routing | Install capabilities, automate safely, and route independent work |
| IV Production Engineering | 09 Sandbox/Egress/ACP · 10 Inference/Quantization/Tuning · 11 Capstone | Isolate execution, evaluate models, and deliver recoverable workflows |

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
├── CURRICULUM.md                # Curriculum map and progression
├── DESIGN.md                    # Product and technical design
├── RESEARCH.md                  # Sources and adoption decisions
└── preview.png                  # Current desktop preview
```

## Safety Boundaries

The app does not invoke a shell, read `~/.hermes`, change configuration, install extensions, connect to messaging platforms, or upload progress. Commands are teaching examples. Real labs should use an isolated profile, test directory, and minimum permissions.

See [ADR 0001](./docs/adr/0001-browser-simulation-first.md) for the browser-simulation tradeoff and verify real commands against the current [Hermes documentation](https://hermes-agent.nousresearch.com/docs/).

## Sources

- [Hermes Agent](https://github.com/NousResearch/hermes-agent): runtime and command source of truth
- [Hermes 4.3 model card](https://huggingface.co/NousResearch/Hermes-4.3-36B): model, prompt, serving, and sampling details
- [AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners): curriculum and lab structure reference
- [RESEARCH.md](./RESEARCH.md): research conclusions and version notes

---

<div align="center"><sub>Learn the boundary. Run the lab. Ship with evidence.</sub></div>

<p align="right"><a href="#简体中文">返回简体中文</a></p>
