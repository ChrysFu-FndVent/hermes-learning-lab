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
- Negative: simulation alone cannot validate the learner's real provider, MCP, Gateway, or terminal setup.
- Neutral: [ADR 0002](./0002-explicit-read-only-local-verification.md) adds a separate, explicit read-only check for CLI/Desktop/Gateway presence without changing the simulation default.

## Alternatives considered

- Directly spawn the local Hermes CLI: rejected because a static web app should not gain shell and configuration access by default.
- Require a hosted Hermes account: rejected because it introduces authentication and backend operations unrelated to the initial learning goal.

## References

- Hermes Quickstart and security documentation
- `DESIGN.md`
