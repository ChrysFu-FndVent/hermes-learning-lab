# Hermes Learning Lab 课程体系

## 教学目标

完成课程后，学习者应能独立完成安装诊断、可靠 Prompt、工具与上下文治理、扩展安装、自动化、委派、安全执行、模型推理评测和生产工作流设计。

每课使用同一规范：

1. 先修条件和可验证目标
2. 不计分课前诊断
3. 四个递进概念与四段 Agent 轨迹
4. 实验 Task、Input、Procedure、Success Criteria
5. 可判定课后检查与针对性反馈
6. 核心结论、排错提示和一手资料

## 知识递进

```mermaid
flowchart TD
    A[00 Setup & Doctor] --> B[01 Agent Loop]
    B --> C[02 Models & Profiles]
    C --> D[03 Prompt Contracts]
    D --> E[04 Tools, Context & Approval]
    E --> F[05 Sessions, Memory & SOUL]
    F --> G[06 Skills, Plugins & MCP]
    G --> H[07 Gateway, Cron, Hooks & Batch]
    H --> I[08 Delegation & Routing]
    I --> J[09 Sandbox, Egress & ACP]
    J --> K[10 Inference & Tuning]
    K --> L[11 Evaluation-driven Capstone]
```

## 课程地图

| 课 | 等级 | 核心问题 | 实验交付物 |
|---:|---|---|---|
| 00 | Beginner | 如何证明 Hermes 基础环境可用？ | Setup/首次聊天/Doctor 验收记录 |
| 01 | Beginner | Agent 如何从意图进入行动闭环？ | 只读盘点与单次写入审批记录 |
| 02 | Beginner | Provider、Model、Profile、SOUL 如何分层？ | 隔离研究 Profile 配置 |
| 03 | Beginner | 如何把模糊请求变成可验收契约？ | JSON Schema 仓库报告 Prompt |
| 04 | Intermediate | 如何最小化工具和上下文攻击面？ | README 草稿与权限证据 |
| 05 | Intermediate | 什么信息应进入 Session、Memory 或 SOUL？ | 脱敏调试 Memory |
| 06 | Intermediate | Skill、Plugin、MCP 分别解决什么？ | 隔离 Profile 中的 Skill 冒烟测试 |
| 07 | Intermediate | 自动化如何做到幂等和可追踪？ | 工作日早报与失败历史 |
| 08 | Intermediate | 如何安全并行并选择模型？ | 发布前并行检查设计 |
| 09 | Advanced | 如何隔离文件、进程、网络和秘密？ | Docker + Egress 负向测试 |
| 10 | Advanced | 何时使用量化、LoRA 或 RL？ | 20 条结构化工具调用评测 |
| 11 | Advanced | 如何交付可审计生产工作流？ | PR 审查 Agent 运行手册与评测报告 |

## 掌握标准

- 课前诊断只记录 `correct` 或 `review`，不锁定内容。
- 课后检查通过后课程计入总掌握度。
- 浏览器通过只证明关键判断正确；真实实验还需满足每课 Success Criteria。
- 毕业标准建议为：12 个课后检查通过、12 个实验记录完成、毕业项目评测与回滚演练通过。

## 内容维护规范

- 命令和配置键必须指向当前官方资料。
- 模型参数必须注明来源和“评测后调整”。
- 示例不包含真实 Token、个人路径或生产消息目标。
- 每个副作用步骤要有权限范围、成功证据和恢复方式。
- 新增课程时同步更新 `src/data.js`、本文件、README 路线和链接检查。
