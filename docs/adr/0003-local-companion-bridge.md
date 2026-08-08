# 0003. GitHub Pages 本机伴随服务桥接

- **Status**: accepted
- **Date**: 2026-08-08
- **Deciders**: Codex, user

## Context

GitHub Pages 是静态托管，浏览器不能直接执行学习者电脑上的 Hermes 命令。旧的 Vite 开发服务器 middleware 只在本地开发存在，部署到 Pages 后会变成不可用接口，造成“无法访问”或探针失败。

## Decision

提供一个用户主动启动的 Node 本机伴随服务：

- 只监听 `127.0.0.1:43127`，正式 Pages Origin 和 localhost 开发 Origin 才能跨源访问。
- `GET /v1/health` 只发现服务；`POST /v1/pair` 用一次性配对码换取令牌。
- 令牌只以 SHA-256 哈希持久保存，配对持续到用户点击解除配对。
- `POST /v1/check` 每次都要求本机终端确认，之后才执行最小只读探针。
- 响应只包含 CLI/Desktop/Gateway 布尔状态、版本、Doctor 摘要和时间戳；不返回路径、配置、密钥、日志、会话或消息。
- 页面提供可审查的 macOS `.command`、Windows `.ps1` 下载脚本和 `npm run local:bridge` 命令；不会静默安装或执行。

## Consequences

- Hosted 页面可以在不获得远程执行能力的前提下连接学习者自己的伴随服务。
- 服务未启动、配对失败、终端拒绝和超时都有明确反馈，静态课程与回执验收始终可用。
- 学习者需要额外启动一个终端并完成一次配对；服务端口或进程名变化可能需要更新脚本和探针。

## References

- [ADR 0002](./0002-explicit-read-only-local-verification.md)
- [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)
- [Hermes Feishu/Lark](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/feishu)
