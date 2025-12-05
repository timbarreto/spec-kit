# UX Mockup Gen Constitution
<!-- Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- Modified principles: N/A (template placeholders replaced with defined principles)
- Added sections: Additional Constraints, Development Workflow
- Removed sections: None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md (Constitution Check aligned)
	- ✅ .specify/templates/spec-template.md (no conflicting references)
	- ✅ .specify/templates/tasks-template.md (no conflicting references)
	- ⚠ pending: README.md (add quick reference to CLI principles)
- Deferred TODOs: TODO(RATIFICATION_DATE): original adoption date unknown
-->

## Core Principles

### I. Text I/O CLI Contract (NON-NEGOTIABLE)
The CLI MUST accept inputs via `stdin` or explicit args and produce
deterministic outputs to `stdout`; errors MUST go to `stderr` with
non‑zero exit codes. Support both human‑readable text and `--json` for
machine output. Commands MUST be idempotent where applicable.

Rationale: Text I/O ensures interoperability, testability, and composability
with other tools and scripts without coupling to specific environments.

### II. Single‑Responsibility Commands
Each command MUST do one thing well, with clear flags for scope. Avoid
side effects beyond declared outputs. Subcommands SHOULD group related
operations without overlapping responsibilities.

Rationale: Simplifies usage, documentation, and maintenance; improves
pipeline reliability.

### III. Test‑First Discipline
Write tests before implementation for command behaviors, covering
contract tests (args, exit codes, stdout/stderr), unit tests for core
logic, and integration tests for external interactions. Red‑Green‑Refactor
MUST be followed.

Rationale: Prevents regressions and enforces stable CLI contracts.

### IV. Discoverability & UX Consistency
Provide `--help` on all commands and subcommands with examples. Use
consistent flag naming (`--input`, `--output`, `--format`, `--verbose`),
short flags where useful (`-o`, `-v`), and sensible defaults. Autocomplete
support SHOULD be provided where feasible.

Rationale: Predictable UX reduces cognitive load and support burden.

### V. Observability & Error Hygiene
Structured logs (when `--verbose` or `--log-level` is set) MUST be
emitted to `stderr` and never pollute `stdout`. Errors MUST be actionable
with clear messages and standardized exit codes. Include `--version` and
`--diagnostics` for environment introspection when relevant.

Rationale: Clean separation of concerns enables reliable piping and
debugging.

### VI. Configuration & Reproducibility
Prefer explicit CLI flags over implicit env; when using env vars, document
them and allow override via flags. Support config files with deterministic
resolution order: flags → env → project config → user config.

Rationale: Reproducible runs across environments and CI pipelines.

### VII. Backward Compatibility & Versioning
Follow semantic versioning. Breaking changes to CLI flags, outputs, or
exit codes REQUIRE a MAJOR bump, migration notes, and deprecation windows
where feasible. Additive flags or outputs are MINOR. Non‑semantic docs or
text clarifications are PATCH.

Rationale: Stability anchors automation and user trust.

## Additional Constraints

Security: Commands MUST avoid executing untrusted input; validate file
paths and sanitize external calls. Performance: Commands SHOULD process
large inputs in streams; avoid loading entire files when possible.
Portability: Commands MUST work on Windows, macOS, and Linux; avoid
platform‑specific assumptions.

## Development Workflow

Quality Gates: Every PR MUST demonstrate passing contract tests and include
updated `--help` examples for changed commands. Reviews MUST check that
`stdout` remains pure data/output and that logs/errors stay on `stderr`.
Documentation: Update usage docs and examples on each MINOR/MAJOR change.

## Governance

This constitution supersedes other practices for CLI behavior. Amendments
REQUIRE documentation, approval, and a migration plan when changes affect
users. Compliance reviews MUST verify adherence to contracts, error
handling, logging separation, and versioning policy. Use project runtime
guidance in `README.md` for quick references.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2025-12-05
# [PROJECT_NAME] Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### [PRINCIPLE_1_NAME]
<!-- Example: I. Library-First -->
[PRINCIPLE_1_DESCRIPTION]
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### [PRINCIPLE_2_NAME]
<!-- Example: II. CLI Interface -->
[PRINCIPLE_2_DESCRIPTION]
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### [PRINCIPLE_3_NAME]
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
[PRINCIPLE_3_DESCRIPTION]
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### [PRINCIPLE_4_NAME]
<!-- Example: IV. Integration Testing -->
[PRINCIPLE_4_DESCRIPTION]
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### [PRINCIPLE_5_NAME]
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
[PRINCIPLE_5_DESCRIPTION]
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## [SECTION_2_NAME]
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

[SECTION_2_CONTENT]
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## [SECTION_3_NAME]
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

[SECTION_3_CONTENT]
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

[GOVERNANCE_RULES]
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
