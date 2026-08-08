# Contributing to Hermes Learning Lab

感谢你帮助改进课程。提交内容应优先提高可操作性、结果可验证性和失败恢复能力。

## 先选择合适入口

- [学习打卡与一般交流](https://github.com/ChrysFu/hermes-learning-lab/discussions/categories/general)
- [环境排错与使用问题](https://github.com/ChrysFu/hermes-learning-lab/discussions/categories/q-a)
- [课程纠错与改进建议](https://github.com/ChrysFu/hermes-learning-lab/discussions/categories/ideas)
- [毕业项目展示](https://github.com/ChrysFu/hermes-learning-lab/discussions/categories/show-and-tell)

确认需要修改仓库内容后再提交 Pull Request。

## 内容标准

1. 具体 Hermes 命令、配置键和安全行为必须链接官方文档、官方仓库或官方 Release。
2. 社区教程可以帮助发现场景，但不能单独证明命令有效。
3. 每个新实验应包含 Task、Input、Procedure、Success Criteria、Evidence 和 Recovery。
4. 示例不得包含 Token、App Secret、用户 ID、聊天记录或个人绝对路径。
5. 界面截图必须标注来源、核验版本和可能的版本差异。
6. 不要为每节课添加学习时长估计。

## 本地检查

```bash
npm ci
npm run lint
npm run build
npm run test:e2e
```

验证 GitHub Pages 子路径：

```bash
npm run build:pages
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173/hermes-learning-lab/ npm run test:e2e
```

## Pull Request

- 使用短分支名并保持改动聚焦。
- 说明学习者会看到什么变化以及如何验收。
- 列出运行过的检查和没有覆盖的风险。
- 修改课程时同步更新 `src/data.js`、`CURRICULUM.md` 和相关资料索引。

## 授权

提交代码即表示你同意按 MIT License 提供该代码。提交原创课程内容即表示你同意按 CC BY-NC-SA 4.0 提供该内容。不要提交无权再分发的全文、字幕、PDF 或图片；详见 [LICENSE](./LICENSE)。
