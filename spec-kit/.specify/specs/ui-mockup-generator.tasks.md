# Tasks: UI Mockup Generator CLI

**Input**: Design documents from `.specify/specs/`
**Prerequisites**: ui-mockup-generator.plan.md (required), ui-mockup-generator.spec.md (required)

**Tests**: Included per spec requirement for test coverage (constitution 2.1)

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: Project initialization and TypeScript/Bun configuration

- [ ] T001 Initialize Bun project with `bun init` in project root
- [ ] T002 Create `package.json` with name, bin, scripts configuration
- [ ] T003 [P] Create `tsconfig.json` with strict TypeScript settings
- [ ] T004 [P] Install `@google/genai` dependency via `bun add @google/genai`
- [ ] T005 [P] Install dev dependencies via `bun add -d @types/bun typescript`
- [ ] T006 Create directory structure: `src/cli/`, `src/core/`, `src/services/`, `src/utils/`, `tests/unit/`, `tests/integration/`, `tests/fixtures/`

**Checkpoint**: Project scaffolding complete, TypeScript compiles

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, utilities, and error handling that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create TypeScript interfaces for UI specification in `src/core/types.ts`
  - `UISpecification`, `UIComponent`, `ComponentType`, `UIMetadata`
- [ ] T008 [P] Create custom error types in `src/utils/errors.ts`
  - `MockupError` class with code, message, suggestion
  - Error codes: `JSON_PARSE_ERROR`, `VALIDATION_ERROR`, `API_KEY_MISSING`, `API_ERROR`, `FILE_NOT_FOUND`, `FILE_WRITE_ERROR`
- [ ] T009 [P] Create file I/O utilities in `src/utils/file.ts`
  - `readJsonFile(path)`, `saveImage(buffer, path)`, `fileExists(path)`
- [ ] T010 [P] Create console output formatting in `src/cli/output.ts`
  - `printError(error)`, `printSuccess(message)`, `printProgress(message)`

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Generate Mockup from JSON File (Priority: P1) 🎯 MVP

**Goal**: Accept a JSON file path and generate a mockup image saved to disk

**Independent Test**: Run `mockup generate login.json` → image file created

### Tests for User Story 1

- [ ] T011 [P] [US1] Create test fixture `tests/fixtures/valid-login.json` with login form UI spec
- [ ] T012 [P] [US1] Create test fixture `tests/fixtures/valid-minimal.json` with simplest valid spec
- [ ] T013 [P] [US1] Unit test for validator in `tests/unit/validator.test.ts`
  - Test valid spec passes
  - Test missing root fails
  - Test invalid component type fails
- [ ] T014 [P] [US1] Unit test for prompt builder in `tests/unit/prompt-builder.test.ts`
  - Test simple component generates expected prompt
  - Test nested layout generates expected prompt
- [ ] T015 [P] [US1] Unit test for argument parser in `tests/unit/args.test.ts`
  - Test parse file path
  - Test parse output flag
  - Test missing required args

### Implementation for User Story 1

- [ ] T016 [US1] Implement JSON schema validator in `src/core/validator.ts`
  - `validateUISpec(json): ValidationResult`
  - Recursive component validation
  - Collect all errors with paths
- [ ] T017 [US1] Implement prompt builder in `src/core/prompt-builder.ts`
  - `buildPrompt(spec, options): string`
  - Transform component tree to natural language description
  - Include meta information (platform, theme)
- [ ] T018 [US1] Implement Gemini API service in `src/services/gemini.ts`
  - `generateMockup(prompt): Promise<GenerationResult>`
  - Check for API key in environment
  - Handle API errors gracefully
- [ ] T019 [US1] Implement basic argument parsing in `src/cli/args.ts`
  - `parseArgs(argv): ParsedArgs`
  - Support: `generate <file>` and `-o <output>`
- [ ] T020 [US1] Implement generate command logic in `src/cli/commands.ts`
  - `executeGenerate(args): Promise<void>`
  - Orchestrate: read file → validate → build prompt → generate → save
- [ ] T021 [US1] Implement CLI entry point in `src/index.ts`
  - Parse args, route to command, handle errors, set exit code
- [ ] T022 [US1] Integration test in `tests/integration/cli.test.ts`
  - Test full flow with mocked Gemini API
  - Verify image file created

**Checkpoint**: MVP complete - can generate mockups from JSON files

---

## Phase 4: User Story 2 - Generate Mockup from Inline JSON (Priority: P2)

**Goal**: Accept JSON directly via `--json` flag or stdin

**Independent Test**: Run `mockup generate --json '{...}'` → image file created

### Tests for User Story 2

- [ ] T023 [P] [US2] Unit test for inline JSON parsing in `tests/unit/args.test.ts`
  - Test `--json` flag parsing
  - Test stdin indicator `-` parsing

### Implementation for User Story 2

- [ ] T024 [US2] Extend argument parsing in `src/cli/args.ts`
  - Add `--json <string>` flag support
  - Add `-` stdin indicator support
- [ ] T025 [US2] Implement stdin reading in `src/utils/file.ts`
  - `readStdin(): Promise<string>`
- [ ] T026 [US2] Update generate command in `src/cli/commands.ts`
  - Handle inline JSON input
  - Handle stdin input
- [ ] T027 [US2] Integration test for inline JSON in `tests/integration/cli.test.ts`
  - Test `--json` flag generates image

**Checkpoint**: CLI supports file, inline JSON, and stdin input

---

## Phase 5: User Story 3 - Validate JSON Schema (Priority: P2)

**Goal**: Provide clear, actionable error messages for invalid JSON

**Independent Test**: Run with invalid JSON → helpful error message displayed

### Tests for User Story 3

- [ ] T028 [P] [US3] Create test fixture `tests/fixtures/invalid-syntax.json` with malformed JSON
- [ ] T029 [P] [US3] Create test fixture `tests/fixtures/invalid-schema.json` with valid JSON but invalid spec
- [ ] T030 [P] [US3] Create test fixture `tests/fixtures/invalid-type.json` with unknown component type
- [ ] T031 [P] [US3] Unit test for error messages in `tests/unit/validator.test.ts`
  - Test syntax error includes line/position
  - Test schema error lists missing fields
  - Test unknown type suggests valid types

### Implementation for User Story 3

- [ ] T032 [US3] Enhance validator error messages in `src/core/validator.ts`
  - Include JSON path in error (e.g., `root.children[0].type`)
  - Add suggestions for common mistakes
  - Suggest similar valid component types for typos
- [ ] T033 [US3] Improve JSON parse error handling in `src/cli/commands.ts`
  - Catch JSON.parse errors
  - Extract line/column from error message
  - Format user-friendly error output
- [ ] T034 [US3] Integration test for error messages in `tests/integration/cli.test.ts`
  - Test invalid syntax shows helpful error
  - Test invalid schema shows field-specific errors

**Checkpoint**: Users can self-diagnose JSON issues from error messages

---

## Phase 6: User Story 4 - Configure Image Settings (Priority: P3)

**Goal**: Allow custom dimensions and style presets

**Independent Test**: Run with `--width 1920 --height 1080 --style wireframe` → styled image created

### Tests for User Story 4

- [ ] T035 [P] [US4] Unit test for dimension/style parsing in `tests/unit/args.test.ts`
  - Test `--width` and `--height` parsing
  - Test `--style` parsing with valid values
  - Test invalid style value error

### Implementation for User Story 4

- [ ] T036 [US4] Extend argument parsing in `src/cli/args.ts`
  - Add `--width <number>` flag
  - Add `--height <number>` flag
  - Add `--style <wireframe|polished|minimal>` flag
- [ ] T037 [US4] Update prompt builder in `src/core/prompt-builder.ts`
  - Incorporate dimensions into prompt
  - Add style-specific prompt modifiers
  - `wireframe`: "simple black and white wireframe style"
  - `polished`: "modern, professional UI with shadows and gradients"
  - `minimal`: "clean, minimalist design with ample whitespace"
- [ ] T038 [US4] Update generate command in `src/cli/commands.ts`
  - Pass style/dimension options to prompt builder
- [ ] T039 [US4] Integration test for customization in `tests/integration/cli.test.ts`
  - Test style flag modifies prompt correctly

**Checkpoint**: CLI supports output customization

---

## Phase 7: User Story 5 - Manage API Configuration (Priority: P3)

**Goal**: Clear guidance for API key setup; secure handling

**Independent Test**: Run without API key → helpful setup instructions displayed

### Tests for User Story 5

- [ ] T040 [P] [US5] Unit test for API key error in `tests/unit/gemini.test.ts`
  - Test missing key returns appropriate error
  - Test error includes setup URL

### Implementation for User Story 5

- [ ] T041 [US5] Enhance API key error handling in `src/services/gemini.ts`
  - Clear error message when `GEMINI_API_KEY` not set
  - Include URL: https://aistudio.google.com/apikey
  - Suggest: `export GEMINI_API_KEY=your-key-here`
- [ ] T042 [US5] Add API key validation in `src/cli/commands.ts`
  - Check for API key before expensive operations
  - Fail fast with helpful message

**Checkpoint**: Users can easily configure and troubleshoot API access

---

## Phase 8: User Story 6 - Batch Processing (Priority: P4)

**Goal**: Process multiple JSON files with glob patterns

**Independent Test**: Run `mockup generate ./specs/*.json` → multiple images created

### Tests for User Story 6

- [ ] T043 [P] [US6] Create additional test fixtures for batch testing
  - `tests/fixtures/batch/ui-1.json`
  - `tests/fixtures/batch/ui-2.json`
- [ ] T044 [P] [US6] Unit test for glob pattern handling in `tests/unit/args.test.ts`
  - Test wildcard pattern detection
  - Test output directory parsing

### Implementation for User Story 6

- [ ] T045 [US6] Add glob pattern expansion in `src/utils/file.ts`
  - `expandGlob(pattern): Promise<string[]>`
  - Use Bun's glob support
- [ ] T046 [US6] Extend argument parsing in `src/cli/args.ts`
  - Add `--output-dir <path>` flag for batch output
- [ ] T047 [US6] Implement batch processing in `src/cli/commands.ts`
  - Process files sequentially
  - Continue on single file failure
  - Report summary at end
- [ ] T048 [US6] Integration test for batch in `tests/integration/cli.test.ts`
  - Test multiple files processed
  - Test partial failure handling

**Checkpoint**: CLI supports batch processing

---

## Phase 9: Polish & Cross-Cutting

**Purpose**: Help system, version, progress feedback, final cleanup

- [ ] T049 [P] Implement `--help` flag in `src/cli/commands.ts`
  - Comprehensive usage documentation
  - Examples for each input method
- [ ] T050 [P] Implement `--version` flag in `src/cli/commands.ts`
  - Read version from package.json
- [ ] T051 Add progress feedback in `src/cli/output.ts`
  - "Reading JSON file..."
  - "Validating specification..."
  - "Generating mockup..." (with spinner if terminal supports)
  - "Saved to: <path>"
- [ ] T052 [P] Add `--force` flag for overwrite without prompt in `src/cli/args.ts`
- [ ] T053 Implement overwrite confirmation in `src/cli/commands.ts`
  - Check if output file exists
  - Prompt user unless `--force` provided
- [ ] T054 Run full test suite and fix any failures
- [ ] T055 Manual testing of all user stories end-to-end
- [ ] T056 Code cleanup: remove dead code, ensure consistent style

**Checkpoint**: Production-ready CLI with excellent UX

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational ──────────────────────────────────────┐
    ↓                                                        │
Phase 3: US1 (P1) MVP ◄─────────────────────────────────────┤
    ↓                                                        │
Phase 4: US2 (P2) ◄─── depends on US1 args infrastructure   │
    ↓                                                        │
Phase 5: US3 (P2) ◄─── enhances US1 validator               │
    ↓                                                        │
Phase 6: US4 (P3) ◄─── extends US1 prompt builder           │
    ↓                                                        │
Phase 7: US5 (P3) ◄─── enhances US1 Gemini service          │
    ↓                                                        │
Phase 8: US6 (P4) ◄─── extends US1 command handling         │
    ↓                                                        │
Phase 9: Polish ◄────── requires all user stories complete  │
```

### Within Each User Story

1. Create test fixtures first (parallel)
2. Write tests that will fail (parallel)
3. Implement code to make tests pass (sequential where dependent)
4. Run tests to verify

### Parallel Opportunities

**Phase 1 (parallel)**:
- T003, T004, T005 can run together

**Phase 2 (parallel)**:
- T008, T009, T010 can run together (after T007)

**Each user story tests (parallel)**:
- All test fixture creation tasks
- All unit test writing tasks

**Phase 9 (parallel)**:
- T049, T050, T052 can run together

---

## Implementation Strategy

### MVP First (Phase 1-3)

1. Complete Setup (T001-T006)
2. Complete Foundational (T007-T010)
3. Complete US1 tests (T011-T015)
4. Complete US1 implementation (T016-T022)
5. **VALIDATE**: `bun run src/index.ts generate tests/fixtures/valid-login.json`
6. Deploy/demo MVP

### Incremental Delivery

After MVP:
- Add US2 → Test → Can now use inline JSON
- Add US3 → Test → Better error messages
- Add US4 → Test → Style customization
- Add US5 → Test → Better onboarding
- Add US6 → Test → Batch processing
- Polish → Ship

---

## Quick Reference: File → Task Mapping

| File | Tasks |
|------|-------|
| `src/core/types.ts` | T007 |
| `src/core/validator.ts` | T016, T032 |
| `src/core/prompt-builder.ts` | T017, T037 |
| `src/services/gemini.ts` | T018, T041 |
| `src/cli/args.ts` | T019, T024, T036, T046, T052 |
| `src/cli/commands.ts` | T020, T026, T033, T038, T042, T047, T049, T050, T053 |
| `src/cli/output.ts` | T010, T051 |
| `src/utils/errors.ts` | T008 |
| `src/utils/file.ts` | T009, T025, T045 |
| `src/index.ts` | T021 |
| `tests/unit/validator.test.ts` | T013, T031 |
| `tests/unit/prompt-builder.test.ts` | T014 |
| `tests/unit/args.test.ts` | T015, T023, T035, T044 |
| `tests/unit/gemini.test.ts` | T040 |
| `tests/integration/cli.test.ts` | T022, T027, T034, T039, T048 |

---

## Notes

- Tests use `bun:test` built-in framework
- Mock Gemini API in tests to avoid actual API calls
- Each checkpoint is a deployable/demonstrable state
- Commit after each task or logical group
- Run `bun test` before marking phase complete
