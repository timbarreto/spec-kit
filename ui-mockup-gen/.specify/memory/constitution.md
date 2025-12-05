# [PROJECT_NAME] Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Modified principles: N/A → Concrete Bun CLI standards
- Added sections: Additional Constraints; Development Workflow
- Removed sections: None
- Templates requiring updates:
	✅ .specify/templates/plan-template.md (Constitution Check aligns with Bun CLI gates)
	✅ .specify/templates/spec-template.md (User scenarios remain independently testable)
	✅ .specify/templates/tasks-template.md (Phases and independence align; no agent-specific refs)
- Follow-up TODOs:
	- TODO(RATIFICATION_DATE): Original adoption date unknown — provide when known
-->

# UI Mockup Gen Constitution

## Core Principles

### Library-First, CLI-First (NON-NEGOTIABLE)
The project MUST prioritize small, self-contained libraries that expose their
capabilities through a Bun-based CLI. All features begin as standalone modules
with a clear purpose, documented contracts, and tests. The CLI is the primary
interface, using text/JSON input via args/stdin and emitting results to stdout;
errors go to stderr.

Rationale: A library-first, CLI-first posture ensures modularity, testability,
and automation-friendly tooling that integrates cleanly with pipelines.

### Deterministic I/O Contracts
CLI commands MUST define stable, versioned contracts. Input/Output schemas MUST
be explicitly documented, with JSON as the canonical machine interface and a
human-readable output mode for interactive use. Commands MUST be non-interactive
by default (no prompts) and support `--help` and `--version` consistently.

Rationale: Deterministic contracts enable reliable scripting, integration, and
future refactors without breaking downstream consumers.

### Test-First Discipline
Tests MUST be authored before implementation for any new command, option, or
module. Follow Red–Green–Refactor: write failing tests, implement minimal code
to pass, then refactor. Unit tests validate pure logic; contract tests validate
CLI I/O; integration tests validate cross-module interactions.

Rationale: Test-first development improves design quality and prevents regressions.

### Integration & Contract Testing
Any change to CLI flags, JSON schemas, or cross-module behavior MUST include
updated contract and integration tests. Shared schemas MUST have compatibility
tests across versions, and breaking changes MUST be accompanied by migration
notes.

Rationale: Contract tests protect users and downstream automation from breaking
changes.

### Observability, Versioning, Simplicity
- Logging: Structured logs with levels; default to warnings+errors on stderr.
- Versioning: Semantic Versioning (MAJOR.MINOR.PATCH) across CLI and schemas.
- Simplicity: Prefer minimal dependencies; avoid premature abstraction.
- Performance: CLIs MUST be fast to start; avoid unnecessary I/O.

Rationale: Clear telemetry and versioning support maintainability; simplicity
and performance improve user experience.

## Additional Constraints

- Runtime: Bun (current stable) is the required runtime for CLI tools.
- Packaging: Commands MUST be runnable via `bun` and optionally distributed via
	`bun install` scripts; entry points defined with `bin` mappings.
- Cross-Platform: Commands MUST run on Windows, macOS, and Linux. Avoid
	platform-specific path assumptions; normalize file paths.
- Configuration: Prefer explicit CLI flags and environment variables over
	implicit config files; if config files are used, define location priority and
	schema.
- Security: Validate all inputs; avoid executing untrusted code; sanitize file
	system operations.

## Development Workflow

- Specs → Plan → Tasks: Each feature flows from a specification to an
	implementation plan to tasks, maintaining independent deliverability for each
	user story.
- Constitution Check: Plans MUST document gates derived from this constitution
	(library-first, deterministic I/O, test-first, contract coverage).
- Reviews: PRs MUST verify tests, schema docs, `--help` output accuracy, and
	adherence to SemVer for changes.
- Release Notes: Each release MUST include change summaries and migration notes
	for any deprecations or breaking changes.

## Governance

This constitution supersedes other practices. Amendments require documentation,
maintainer approval, and an explicit migration plan where contracts change. All
PRs/reviews MUST verify compliance. Complexity MUST be justified in plan docs.
Runtime development guidance follows project README and templates.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original date unknown | **Last Amended**: 2025-12-04

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
