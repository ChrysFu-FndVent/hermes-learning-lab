# Hermes Learning Lab

基于 Hermes Agent 官方仓库、官方文档和已核验社区项目制作的交互式中文入门平台。

## 运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 成品能力

- 八节渐进式课程：Agent loop、模型/Profile、工具与审批、会话/记忆、Skills/MCP、Gateway/Cron、Delegation、安全毕业挑战
- 三种实践题型：单选决策、多选能力组合、配置/命令构建器
- 真实命令预览与模拟执行反馈，不写入真实 Hermes 配置
- 版本化 `localStorage` 进度、掌握度、检查点和重置机制
- GitHub 项目研究视图，明确区分官方与社区来源
- 技术架构视图，解释模块边界、数据流和安全取舍
- 桌面、平板、手机响应式布局和键盘焦点状态

## 内容边界

应用中的命令仅用于教学展示。它不会调用本机 Hermes、读取 `~/.hermes`、写入配置、连接消息平台或安装 Skills/MCP。进入真实环境前，请以当前版本的 [官方文档](https://hermes-agent.nousresearch.com/docs/) 为准。

详细设计见 [DESIGN.md](./DESIGN.md)，研究摘要见 [RESEARCH.md](./RESEARCH.md)。

## 设计资源

- [Figma 概念稿与网页捕获](https://www.figma.com/design/0l0vZa7noe6dyyiOZbakgD?node-id=8-2)
- [桌面预览图](./preview.png)
