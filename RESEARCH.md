# Hermes 课程资料研究

核验日期：2026-08-02。事实优先级为 Hermes 官方文档与仓库、NousResearch 模型卡、官方工具链；AI-For-Beginners 只用于教学结构；社区资料只提供界面与实践视角。

## AI-For-Beginners 教学启发

[microsoft/AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners) 使用独立环境准备、课前测验、理论阅读、可执行 Notebook、代码挑战、实验任务、课后测验和自学资料形成渐进课程。典型实验明确 Task、Dataset/Input、Execution 和 Expected Result。

本项目采用以下映射：

| AI-For-Beginners | Hermes Learning Lab |
|---|---|
| Course setup | Lesson 00 Download + Channels，Lesson 01 Setup + Doctor |
| Pre-lecture quiz | 每课课前诊断 |
| Theory / readings | 四步核心讲解 + 官方资料 |
| Notebook / code challenge | Agent 轨迹 + 浏览器模拟题 |
| Assignment | 真实实验任务、输入、步骤、成功标准 |
| Post-lecture quiz | 课后检查与掌握度 |

## Hermes Agent 核心结论

Hermes 是可长期运行的 Agent harness：Provider/Model 可替换；工具运行时负责执行；Session 保存事实；Memory 保存压缩经验；Context Files 保存项目规则；Skills 提供渐进披露知识；Plugins/MCP 扩展能力；Gateway、Cron、Hooks 与 Batch 负责入口和触发；Delegation 与 Provider Routing 分配工作；Sandbox、Egress、审批和 Checkpoint 管理副作用。

当前官方学习路径为 Beginner（Installation、Quickstart、CLI、Configuration）、Intermediate（Sessions、Messaging、Tools、Skills、Memory、Cron）和 Advanced（Architecture、扩展、贡献与 RL）。本课程在此基础上补入 Prompt 契约、结构化输出、恢复路径和生产评测。

## 当前配置与恢复路径

安装入口按设备分层：macOS/Linux/WSL2 使用官方 shell 安装器，Windows 原生使用 PowerShell 安装器；初学者可从 Hermes Desktop 安装器开始，已有 CLI 可运行 `hermes desktop`。飞书推荐通过 Gateway 的 WebSocket 长连接接入，无需公网 URL。

```bash
# macOS / Linux / WSL2
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# Windows PowerShell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)

# Desktop 与 Feishu
hermes desktop
hermes gateway setup
hermes gateway
```

最小启动：

```bash
hermes setup
hermes setup --portal
hermes model
hermes doctor
```

先完成一次普通聊天，再添加 Gateway、Cron、Skills、MCP 或路由。推荐恢复顺序：

```text
hermes doctor -> hermes model -> hermes setup -> hermes sessions list -> hermes --continue -> hermes gateway status
```

`~/.hermes/config.yaml` 保存普通设置，`~/.hermes/.env` 保存秘密。配置命令包括 `hermes config get/set/unset/check/migrate`。

## Hermes 4.3 模型要点

[Hermes-4.3-36B](https://huggingface.co/NousResearch/Hermes-4.3-36B) 是 36B 混合推理模型，支持 reasoning/non-reasoning、函数调用、JSON Schema、长上下文和角色扮演。使用 `tokenizer.apply_chat_template(...)`，reasoning 模式使用 `thinking=True`。vLLM 的 Hermes 工具解析器为 `hermes`；SGLang 需按当前模型卡配置解析器。

模型卡建议采样起点：

```python
temperature = 0.6
top_p = 0.95
top_k = 20
```

这些参数不是所有任务的最优值，课程要求用目标任务评测选择。Serving 覆盖 Transformers、vLLM、SGLang、GGUF、llama.cpp、Ollama 和 LM Studio。

## Prompt 与微调决策

推荐升级阶梯：

```text
Prompt contract -> Skill -> SFT / LoRA -> RL with Atropos
```

只有错误模式稳定、数据足够、指标明确且低成本层无法解决时才进入微调。NousResearch 的 [Atropos](https://github.com/NousResearch/atropos) 提供 RL 环境方向；[hermes-agent-self-evolution](https://github.com/NousResearch/hermes-agent-self-evolution) 展示评测驱动的 Skill/Prompt 优化闭环。

## 采用的官方入口

- [Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
- [Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)
- [Windows Native](https://hermes-agent.nousresearch.com/docs/user-guide/windows-native)
- [Windows WSL2](https://hermes-agent.nousresearch.com/docs/user-guide/windows-wsl-quickstart)
- [Feishu](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/feishu)
- [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Learning Path](https://hermes-agent.nousresearch.com/docs/getting-started/learning-path)
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)
- [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Checkpoints](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback)

## 版本注意

Hermes 迭代较快，社区教程和命令可能滞后。课程把稳定心智模型放在正文，把具体命令链接到当前官方资料；发布前需要运行链接检查，并定期复核配置键、工具解析器和模型参数。
