# 0002. Explicit read-only local verification

- **Status**: superseded by [ADR 0003](./0003-local-companion-bridge.md)
- **Date**: 2026-08-02
- **Deciders**: Codex, user

## Context

Browser simulation teaches the correct decisions but cannot show whether the learner has launched Hermes Desktop or started the Gateway. A useful transition to real applications needs limited machine evidence without granting the course access to configuration, secrets, sessions, logs, or messages.

## Decision

The original implementation exposed `/api/local-verification` from the local Vite development server. It ran only after the learner clicked **检测本机状态** and returned:

- whether `hermes` is discoverable on `PATH`;
- whether a Hermes Desktop process is present;
- whether `hermes gateway status` reports a running Gateway;
- the check timestamp.

The endpoint returns booleans only. It does not return command output, paths, configuration, logs, credentials, sessions, or message content. It never starts, stops, or changes Hermes. Real message-path verification uses an explicit learner-submitted `DESKTOP_OK` or `FEISHU_OK` receipt evaluated in the browser.

This middleware approach is superseded because GitHub Pages cannot provide the endpoint. The current bridge is documented in [ADR 0003](./0003-local-companion-bridge.md); static builds keep receipt verification and show the companion download instructions.

## Consequences

- Positive: learners receive real-environment feedback while preserving a narrow, explainable boundary.
- Positive: hosted/static builds explicitly disable probing instead of discovering the missing endpoint after a failed request.
- Negative: process-name and CLI-output changes can cause a false negative.
- Neutral: the learner must explicitly initiate each probe; no background polling is used.

## References

- [ADR 0001](./0001-browser-simulation-first.md)
- [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)
- [Hermes Feishu/Lark](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/feishu)
