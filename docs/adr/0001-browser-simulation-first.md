# 0001. Browser simulation before real Hermes integration

- **Status**: accepted
- **Date**: 2026-07-29
- **Deciders**: Codex, user

## Context

The product must let beginners practise approvals, tool selection, memory decisions, cron configuration, and delegation. Connecting a real Hermes runtime would require provider credentials, local configuration access, shell execution, and potentially external messaging side effects.

## Decision

The first release uses a deterministic browser-side simulation and stores only course progress locally. Commands are rendered for learning but never executed.

## Consequences

- Positive: zero setup, repeatable exercises, no credential handling, no modification of the learner's Hermes environment.
- Negative: cannot validate the learner's real provider, MCP, Gateway, or terminal setup.
- Neutral: a future read-only diagnostics adapter can be added behind a separate explicit connection flow.

## Alternatives considered

- Directly spawn the local Hermes CLI: rejected because a static web app should not gain shell and configuration access by default.
- Require a hosted Hermes account: rejected because it introduces authentication and backend operations unrelated to the initial learning goal.

## References

- Hermes Quickstart and security documentation
- `DESIGN.md`
