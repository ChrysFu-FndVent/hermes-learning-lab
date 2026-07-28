# Hermes Agent GitHub 研究摘要

检索日期：2026-07-29。事实主线来自 `NousResearch/hermes-agent` 的当前 `main` 分支、仓库内网站文档与 TUI README；社区项目只用于补充界面、生态和实践视角。

## 核心结论

Hermes 的核心不是一个新的聊天 UI，而是一套长期运行的 Agent harness：模型可替换，工具运行时负责执行，Session 保存事实记录，Memory 保存压缩经验，Skills 保存渐进披露的操作知识，MCP/Plugins 扩展外部能力，Gateway 把同一个 Agent 暴露到多个消息平台，Cron 与 Delegation 让它能够离线和并行工作。

其设计理念可以归纳为五点：

1. **闭环学习**：复杂任务可沉淀成 Skills，长期事实进入 Memory，过去会话可搜索。
2. **界面与核心解耦**：CLI、React/Ink TUI、Desktop、Web 和消息平台共享会话与运行时。
3. **Provider 无锁定**：通过统一配置切换 Nous Portal、OpenRouter、OpenAI、Anthropic 或兼容端点。
4. **能力按需披露**：Toolsets、Skills、MCP 白名单减少提示长度、选择成本与攻击面。
5. **副作用显式治理**：写入审批、Checkpoint、网络隔离、Skill 安全扫描和可恢复执行。

## 已核验项目

| 项目 | 类型 | 学习价值 |
|---|---|---|
| [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | 官方核心 | 运行时、TUI、Memory、Skills、MCP、Gateway、Cron、Delegation 的事实源 |
| [fathah/hermes-desktop](https://github.com/fathah/hermes-desktop) | 社区桌面端 | 展示如何把安装、Profiles、Memory、Skills、Schedules 与 Gateway 组织成 GUI |
| [nesquena/hermes-webui](https://github.com/nesquena/hermes-webui) | 社区 Web UI | 三栏会话/聊天/工作区和轻量远程访问范式 |
| [outsourc-e/hermes-workspace](https://github.com/outsourc-e/hermes-workspace) | 社区工作区 | 将 Chat、Terminal、Memory、Skills 与 Inspector 组合成操作空间 |
| [NousResearch/hermes-agent-self-evolution](https://github.com/NousResearch/hermes-agent-self-evolution) | 官方实验 | 用 DSPy + GEPA 将 Skill 改进变成评测驱动优化 |
| [0xNyk/awesome-hermes-agent](https://github.com/0xNyk/awesome-hermes-agent) | 社区索引 | 观察 Skills、Plugins、Memory providers 与 surfaces 生态 |
| [alchaincyf/hermes-agent-orange-book](https://github.com/alchaincyf/hermes-agent-orange-book) | 中文指南 | 从自改进、记忆、多 Agent 与安全角度建立整体心智模型 |
| [Yonkoo11/hermes-dojo](https://github.com/Yonkoo11/hermes-dojo) | 示例 Skill | 展示 measure → weakness → evolve → measure → report 的具体闭环 |

## 官方文档入口

- [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Learning Path](https://hermes-agent.nousresearch.com/docs/getting-started/learning-path)
- [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [Cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)
- [Delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation)
- [Developer architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)

## 版本注意

Hermes 迭代速度很快。社区教程可能基于旧版本，功能数量和命令也会变化。学习平台因此优先教授稳定概念与边界，并把具体命令链接回当前官方文档。
