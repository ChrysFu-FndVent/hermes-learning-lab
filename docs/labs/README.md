# Hermes 真实环境实验手册

网页中的练习是无副作用模拟。真实实验应在练习目录、隔离 Profile 或 Sandbox 中执行，不要直接使用生产凭据和工作区。

## 通用实验记录

每次实验记录以下内容：

```text
实验编号：
Hermes 版本：
Profile / Model：
输入与允许范围：
执行命令：
预期成功标准：
实际证据：
失败与恢复：
结论：
```

## 安全准备

1. 使用专用练习 Profile 和临时目录。
2. 只配置本实验需要的 Provider、Toolset 和网络目标。
3. 秘密写入 `~/.hermes/.env`，实验记录中只保留变量名。
4. 写入前创建 Git 或 Hermes Checkpoint。
5. 陌生代码使用 Docker/受控 SSH，并限制挂载、环境变量与 Egress。

## Lesson 00：从教程切换到真实界面

### Hermes Desktop

1. 运行 `hermes desktop`，等待底部状态栏显示可用连接。
2. 对照课程中的官方实景图，定位左侧 **New session**、**Skills & Tools**、**Messaging**、底部 Composer 和连接/模型状态。
3. 点击 **New session**，确认会话出现在 Sessions 列表。
4. 发送 `请只回复 DESKTOP_OK，不要调用任何工具。`，把 Agent 的完整回复粘贴回课程验收器。
5. 再发送一个只读文件任务；确认工具摘要中的路径正确，首次审批只选 **Allow Once / 仅允许一次**。

### 飞书开发者控制台

1. 在 **权限管理** 中确认 `im:message`、`im:message:send_as_bot`、`im:resource`、`im:chat` 和 `im:chat:readonly`。
2. 在 **事件与回调** 中选择 WebSocket 长连接，订阅 `im.message.receive_v1` 和 `card.action.trigger`。
3. 在 **应用功能 → 机器人** 中启用交互式卡片。
4. 在 **版本管理** 中创建并发布版本；企业应用可能需要管理员审批。

### 飞书客户端

1. 先在机器人私聊发送回执 Prompt，排除群聊策略干扰。
2. 进入测试群，输入 `@Hermes 请只回复 FEISHU_OK，不要调用任何工具。`；确认 `@Hermes` 是可点击的蓝色提及实体。
3. 观察消息上的 Typing 表情及机器人回复，把完整回复粘贴回课程验收器。
4. 触发一次测试审批卡，核对工具与范围后选择 **允许一次**。
5. 记录成功证据，但不要截入 App Secret、Token、Open ID、聊天历史或个人路径。

本地课程中的 **检测本机状态** 只在点击时检查 Hermes CLI、Desktop 进程与 Gateway 状态；它不能也不会读取飞书消息。真实消息链路以主动回执为证据。

## 阶段验收

### 阶段 I：启动与基础

- 已记录所用安装路径和官方文档版本，且没有把 App Secret 写入实验记录。
- `hermes doctor` 无阻断错误。
- 能在目标 Profile 完成一次无工具聊天。
- Desktop 能创建会话、选择模型，并对一次 File 读取使用单次授权。
- 能在官方实景图和当前版本之间识别 New session、Messaging、Composer 与状态栏等稳定地标。
- 飞书 Gateway 通过 WebSocket 连接；群聊未 `@Hermes` 时不触发，提及后可响应。
- 飞书应用已发布，订阅 `im.message.receive_v1`，生产环境配置 `FEISHU_ALLOWED_USERS`。
- 飞书审批卡已订阅 `card.action.trigger`、启用交互式卡片，点击时不出现 `200340`。
- 能解释一次工具回合中的意图、工具、审批和验证。
- 能证明凭据和普通配置分离。

### 阶段 II：可靠交互

- Prompt 包含目标、上下文、边界、输出格式和成功标准。
- 项目规则进入 Context，秘密和临时状态不进入。
- 工具集为任务最小集合，写入有明确审批。
- 能从 Session 找回证据，并只把脱敏结论写入 Memory。

### 阶段 III：扩展与自动化

- Skill/Plugin/MCP 的来源、权限和验证均有记录。
- 自动化区分触发、执行、验证和交付状态。
- 重试不会产生重复副作用。
- 并行子任务自包含且不写共享文件，主 Agent 完成最终复核。

### 阶段 IV：工程化与进阶

- Sandbox 和 Egress 都通过允许与拒绝两类测试。
- 结构化输出评测报告包含正确率、延迟和失败样例。
- 微调决策遵循 Prompt → Skill → SFT/LoRA → RL 阶梯。
- 毕业项目包含权限矩阵、评测基线、失败策略和回滚演练。

## 提交物建议

不要提交 `.env`、真实 Token、用户会话、消息平台 ID 或生产日志。推荐只提交脱敏 Markdown 报告、测试样例、Schema、配置键清单和截图证据。
