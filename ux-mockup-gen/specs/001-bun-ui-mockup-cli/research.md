# Research: Bun UI Mockup CLI

## Decisions

- Backend: Gemini via `@google/generative-ai` (cloud provider)
  - Rationale: Official SDK, stable auth, faster start.
  - Alternatives: Raw REST; local models; other providers.
- Schema: Project-defined simplified component tree
  - Rationale: Tailored to MVP; extend incrementally.
  - Alternatives: Adopt external UI schema; heavier.
- Formats: PNG, JPEG
  - Rationale: Common formats; predictable quality.
  - Alternatives: Add SVG later if backend supports vector.

## Best Practices: Bun CLI

- Use Bun test for speed; keep dependencies minimal.
- Parse args with lightweight approach (no heavy CLI frameworks).
- Stream stdin and large files to avoid memory spikes.
- Separate stdout (data) from stderr (logs/errors).
- Provide `--help`, `--version`, `--json` outputs; consistent flags.
- Config precedence: flags → env → project → user; env `GEMINI_API_KEY`.
- Determinism: ensure same inputs/options yield same outputs.

## Patterns: Gemini API

- Use API key from env `GEMINI_API_KEY`.
- Prefer official SDK; handle network errors with bounded retries.
- Timeouts and backoff: exponential with cap; user-friendly messages.
- Consider regional endpoints and quotas; surface diagnostics.

## Open Questions Resolved

- Backend: Gemini SDK (cloud provider) — resolved.
- Schema: Simplified project schema — resolved.
- Output: PNG + JPEG — resolved.
