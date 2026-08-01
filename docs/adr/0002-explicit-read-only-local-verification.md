# 0002. Explicit read-only local verification

- **Status**: accepted
- **Date**: 2026-08-02
- **Deciders**: Codex, user

## Context

Browser simulation teaches the correct decisions but cannot show whether the learner has launched Hermes Desktop or started the Gateway. A useful transition to real applications needs limited machine evidence without granting the course access to configuration, secrets, sessions, logs, or messages.

## Decision

The local Vite server exposes `/api/local-verification`. It runs only after the learner clicks **检测本机状态** and returns:

- whether `hermes` is discoverable on `PATH`;
- whether a Hermes Desktop process is present;
- whether `hermes gateway status` reports a running Gateway;
- the check timestamp.

The endpoint returns booleans only. It does not return command output, paths, configuration, logs, credentials, sessions, or message content. It never starts, stops, or changes Hermes. Real message-path verification uses an explicit learner-submitted `DESKTOP_OK` or `FEISHU_OK` receipt evaluated in the browser.

## Consequences

- Positive: learners receive real-environment feedback while preserving a narrow, explainable boundary.
- Positive: hosted/static builds degrade safely to receipt verification when the local endpoint is unavailable.
- Negative: process-name and CLI-output changes can cause a false negative.
- Neutral: the learner must explicitly initiate each probe; no background polling is used.

## References

- [ADR 0001](./0001-browser-simulation-first.md)
- [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)
- [Hermes Feishu/Lark](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/feishu)
