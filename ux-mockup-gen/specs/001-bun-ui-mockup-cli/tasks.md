---

description: "Task list generated for Bun UI Mockup CLI feature"
---

# Tasks: Bun UI Mockup CLI

**Input**: Design documents from `/specs/001-bun-ui-mockup-cli/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include only if requested. This feature will include core contract tests aligned with the Constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Bun project with minimal deps; create `package.json` in `./`
- [ ] T002 [P] Add `@google/generative-ai` dependency in `package.json`
- [ ] T003 Configure basic scripts: `bun run ui-mockup`, `bun test` in `package.json`
- [ ] T004 [P] Create source layout per plan in `src/` and `tests/`
- [ ] T005 Add `README.md` CLI principles quick reference in `./README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T006 Implement CLI entry `src/cli/index.ts` handling args/stdin and stdout/stderr separation
- [ ] T007 [P] Add help/version `src/cli/help.ts` and version flag wiring
- [ ] T008 [P] Implement streaming parser `src/lib/parser.ts` for stdin/file
- [ ] T009 Implement JSON schema and validator `src/lib/schema.ts`
- [ ] T010 [P] Implement output writer `src/lib/output.ts` (PNG/JPEG)
- [ ] T011 Setup test harness config and base tests `tests/contract/generate.contract.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate mockup from JSON (Priority: P1) 🎯 MVP

**Goal**: User can provide UI JSON (file/stdin) and receive a generated mockup image.

**Independent Test**: Provide minimal valid JSON via stdin; verify image saved, stdout clean or structured JSON when `--json`, stderr logs only, exit 0.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Implement `src/cli/commands/generate.ts` to orchestrate parse → validate → render → write
- [ ] T013 [P] [US1] Implement Gemini backend `src/lib/generators/gemini.ts` using `@google/generative-ai`
- [ ] T014 [US1] Wire flags: `--input`, `--output`, `--format`, `--json`, `--force`, `--size`, `--theme` in `src/cli/index.ts`
- [ ] T015 [US1] Ensure deterministic outputs given same inputs/options
- [ ] T016 [US1] Add logging and diagnostics to stderr with standardized exit codes

**Checkpoint**: User Story 1 is fully functional and independently testable

---

## Phase 4: User Story 2 - Validation and helpful errors (Priority: P2)

**Goal**: Provide actionable error messages with non-zero exit codes when validation fails.

**Independent Test**: Provide invalid JSON and confirm stderr field path errors, stdout empty, non-zero exit.

### Implementation for User Story 2

- [ ] T017 [P] [US2] Enhance `src/lib/schema.ts` with detailed path-based validation messages
- [ ] T018 [US2] Add error mapping layer `src/lib/errors.ts` for exit codes and messages
- [ ] T019 [US2] Update `src/cli/commands/generate.ts` to surface validation errors cleanly

**Checkpoint**: User Story 2 independently testable

---

## Phase 5: User Story 3 - Generator selection and options (Priority: P3)

**Goal**: Select generator backend and pass rendering options.

**Independent Test**: Run with `--generator mock` and `--size 1024x768`; confirm image dimensions and backend choice.

### Implementation for User Story 3

- [ ] T020 [P] [US3] Add mock backend `src/lib/generators/mock.ts` for tests/local runs
- [ ] T021 [US3] Implement generator selection in `src/cli/commands/generate.ts` via `--generator`
- [ ] T022 [US3] Parse and validate `--size` (`WxH`) and apply to output

**Checkpoint**: User Story 3 independently testable

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T023 [P] Documentation updates in `README.md`
- [ ] T024 Code cleanup and refactoring across `src/`
- [ ] T025 Performance optimization for large JSON streaming
- [ ] T026 [P] Additional unit tests in `tests/unit/`
- [ ] T027 Security hardening (input sanitization, path validation)
- [ ] T028 Run `quickstart.md` validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies
- Foundational (Phase 2): Depends on Setup completion - BLOCKS all user stories
- User Stories (Phase 3+): Depend on Foundational completion; proceed in priority order
- Polish: Depends on desired stories being complete

### User Story Dependencies

- User Story 1 (P1): No dependencies on other stories
- User Story 2 (P2): Depends on validation infrastructure (Phase 2); independent of US1 outputs
- User Story 3 (P3): Depends on generator selection wiring; independent testable via mock backend

### Within Each User Story

- Models before services (schema/validation)
- Services before endpoints (generator backends)
- Core implementation before integration

### Parallel Opportunities

- [P] marked tasks can run in parallel across separate files:
  - T002, T004, T007, T008, T010, T012, T013, T017, T020, T026

## Parallel Example: User Story 1

- [ ] T012 [P] [US1] Implement `src/cli/commands/generate.ts`
- [ ] T013 [P] [US1] Implement `src/lib/generators/gemini.ts`

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. STOP and VALIDATE: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
