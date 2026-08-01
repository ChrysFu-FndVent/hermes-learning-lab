# Hermes 学习与实验排错

## 通用原则

一次只改变一个层级，并保留上一个可工作基线。推荐恢复顺序：

```text
hermes doctor
hermes model
hermes setup
hermes sessions list
hermes --continue
hermes gateway status
```

## 安装或首次聊天失败

macOS/Linux/WSL2 使用 `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`；Windows 原生 PowerShell 使用 `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`。执行安装器前应核对当前[官方安装文档](https://hermes-agent.nousresearch.com/docs/getting-started/installation)。

1. 运行 `hermes doctor`，先处理阻断性检查。
2. 用 `hermes model` 核对 Provider、模型名称和凭据。
3. 用 `hermes config check` 检查普通配置。
4. 仍失败时重新运行 `hermes setup`，不要同时启用扩展。
5. 只有普通聊天通过后才恢复 Skills、MCP、Gateway 或 Cron。

### macOS

- `git` 不可用时先安装 Xcode Command Line Tools。
- 安装后找不到 `hermes`，新开 Terminal 或运行 `source ~/.zshrc`。
- Desktop 与 CLI 会共享配置；已有 CLI 可运行 `hermes desktop`。

### Windows 原生与 WSL2

- 原生安装脚本默认写入 `%LOCALAPPDATA%\hermes` 和用户 PATH；安装后重新打开 PowerShell。
- WSL2 用 `wsl --list --verbose` 确认发行版 `VERSION` 为 `2`。
- WSL 项目优先放在 Linux 文件系统（如 `~/code`），避免 `/mnt/c` 的跨文件系统开销。

## Desktop 无法启动或没有会话

1. 运行 `hermes doctor`，确认 CLI 基线可用。
2. 用 `hermes desktop` 从同一套安装启动桌面端。
3. 检查 Desktop 选择的 Profile/Model 是否与 CLI 一致。
4. 新建会话后先完成无工具聊天，再测试 File 或 Terminal 审批。

## 飞书机器人不回复

1. 运行 `hermes gateway status`，必要时重新运行 `hermes gateway setup` 并选择 Feishu/Lark。
2. 确认飞书应用已启用机器人能力，并添加 `im:message`、`im:message:send_as_bot`、`im:resource`、`im:chat`、`im:chat:readonly` 权限。
3. 确认已订阅 `im.message.receive_v1`，连接方式为 WebSocket，并已发布应用版本。
4. 群聊测试必须 `@Hermes`；私聊再单独验证。
5. 生产环境设置 `FEISHU_ALLOWED_USERS`，并检查用户或群组是否在允许范围。
6. 不要在日志、截图或聊天中暴露 App Secret。

## 配置混乱

- 普通设置位于 `~/.hermes/config.yaml`，秘密位于 `~/.hermes/.env`。
- 使用 `hermes config get KEY` 查当前值，`set/unset` 做最小修改。
- 修改后运行 `hermes config check`；版本迁移使用 `hermes config migrate`。
- 多个任务互相污染时，为研究、编码和个人助理建立独立 Profile。

## 工具反复调用或越界

- 在 Prompt 中写明允许工具、路径、最大尝试次数和停止条件。
- 先只读输出计划，再单独批准目标写入。
- 要求最终报告列出实际命令、变更、测试和未覆盖项。
- 对陌生输入使用 Sandbox，不要永久放宽审批。

## Skill、Plugin 或 MCP 不工作

- Skill：检查触发描述、适用边界、依赖和 Verification。
- Plugin：核对版本、来源、加载范围和包含的扩展。
- MCP：核对启动命令、环境变量、transport 和工具白名单。
- 先用无副作用冒烟任务验证工具发现，再测试审批和错误路径。

## Cron 或消息未送达

1. 确认同一个 Prompt 在普通聊天中可以完成。
2. 检查 `hermes gateway status`。
3. 查看 Cron 的触发与运行历史。
4. 区分未触发、执行失败、验证失败和 Delivery 失败。
5. 重跑前检查幂等键，避免重复发送。

## Sandbox 或 Egress 异常

- Docker：检查 daemon、镜像、用户、挂载目录和资源限制。
- SSH：检查目标主机、工作目录、密钥范围和远端清理策略。
- Egress：只添加任务所需域名，并同时测试允许和禁止请求。
- 不要把主机秘密、广泛目录或 Docker socket 默认暴露给容器。

## 模型结构化输出失败

- 使用模型官方 Chat Template，不手拼特殊 Token。
- 核对 vLLM/SGLang 的工具解析器是否匹配当前模型卡。
- 先缩小 JSON Schema 并加入合法示例，再调整采样参数。
- 保存失败样例进入评测集；不要用更大模型替代错误定位。
