# Implementation Plan: UI Mockup Generator CLI

**Branch**: `ui-mockup-generator` | **Date**: 2025-12-04 | **Spec**: `.specify/specs/ui-mockup-generator.spec.md`

---

## Summary

Build a Bun-based CLI tool that accepts UI specifications in JSON format and generates visual mockup images using the Gemini API. The tool uses minimal dependencies (only `@google/genai` SDK) and transforms structured UI definitions into natural language prompts for image generation.

---

## Technical Context

**Language/Version**: TypeScript with Bun runtime (latest stable)
**Primary Dependencies**: `@google/genai` (Gemini SDK - only external dependency)
**Storage**: Local filesystem for generated images; no database required
**Testing**: `bun:test` (Bun's built-in test runner)
**Target Platform**: Cross-platform CLI (Windows, macOS, Linux)
**Project Type**: Single CLI application
**Performance Goals**: CLI startup < 100ms; JSON validation < 500ms
**Constraints**: Minimal dependencies; API key via environment variable only
**Scale/Scope**: Single-user CLI tool; handles one request at a time (batch via sequential processing)

---

## Constitution Check

*GATE: Must pass before implementation. All items verified against `speckit.constitution`.*

| Principle | Status | Notes |
|-----------|--------|-------|
| 1.1 Clarity Over Cleverness | ✅ Pass | Simple, explicit code structure |
| 1.2 Consistency | ✅ Pass | Single patterns throughout |
| 1.3 Maintainability | ✅ Pass | Minimal dependencies, clear module boundaries |
| 1.4 Type Safety | ✅ Pass | Full TypeScript with strict mode |
| 2.1 Test Coverage | ✅ Plan | Unit tests for all modules; integration tests for CLI |
| 2.2 Test Quality | ✅ Plan | Deterministic tests with mocked API calls |
| 3.1 Predictable Behavior | ✅ Plan | Consistent CLI interface |
| 3.4 Error Handling | ✅ Plan | Clear, actionable error messages |
| 4.2 Resource Management | ✅ Plan | Proper cleanup of file handles |

---

## Project Structure

### Documentation

```text
.specify/specs/
├── ui-mockup-generator.spec.md    # Feature specification
├── ui-mockup-generator.plan.md    # This file
└── ui-mockup-generator.tasks.md   # Tasks (created by /speckit.tasks)
```

### Source Code

```text
src/
├── index.ts              # CLI entry point
├── cli/
│   ├── commands.ts       # Command definitions (generate, help)
│   ├── args.ts           # Argument parsing (no external lib)
│   └── output.ts         # Console output formatting
├── core/
│   ├── types.ts          # TypeScript interfaces for UI spec
│   ├── validator.ts      # JSON schema validation
│   └── prompt-builder.ts # Transforms UI spec to Gemini prompt
├── services/
│   └── gemini.ts         # Gemini API client wrapper
└── utils/
    ├── file.ts           # File I/O utilities
    └── errors.ts         # Custom error types

tests/
├── unit/
│   ├── validator.test.ts
│   ├── prompt-builder.test.ts
│   └── args.test.ts
├── integration/
│   └── cli.test.ts
└── fixtures/
    ├── valid-ui.json
    ├── invalid-ui.json
    └── complex-ui.json
```

**Structure Decision**: Single project structure - this is a focused CLI tool with no frontend/backend split needed.

---

## Technical Design

### 1. CLI Argument Parsing (No External Library)

Bun provides `process.argv`. Implement minimal argument parsing:

```typescript
// src/cli/args.ts
interface ParsedArgs {
  command: 'generate' | 'help' | 'version';
  inputFile?: string;
  inlineJson?: string;
  outputPath?: string;
  width?: number;
  height?: number;
  style?: 'wireframe' | 'polished' | 'minimal';
  force?: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  // Parse: mockup generate <file> [-o output] [--json '{}'] [--width N] [--height N] [--style S] [--force]
}
```

### 2. UI Specification Schema

```typescript
// src/core/types.ts
interface UISpecification {
  meta?: {
    title?: string;
    platform?: 'web' | 'mobile' | 'desktop';
    theme?: 'light' | 'dark';
  };
  root: UIComponent;
}

interface UIComponent {
  type: ComponentType;
  children?: UIComponent[];
  // Type-specific properties
  label?: string;
  content?: string;
  placeholder?: string;
  variant?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  // Layout hints
  width?: string | number;
  height?: string | number;
  spacing?: string | number;
}

type ComponentType =
  | 'container'
  | 'text'
  | 'button'
  | 'input'
  | 'image'
  | 'card'
  | 'list'
  | 'header'
  | 'footer'
  | 'navbar'
  | 'sidebar';
```

### 3. JSON Validation

Implement validation without external schema library:

```typescript
// src/core/validator.ts
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  path: string;
  message: string;
  suggestion?: string;
}

function validateUISpec(json: unknown): ValidationResult {
  // 1. Check root object structure
  // 2. Validate component types recursively
  // 3. Check required properties per component type
  // 4. Return helpful error messages
}
```

### 4. Prompt Builder

Transform UI specification into natural language prompt for Gemini:

```typescript
// src/core/prompt-builder.ts
interface PromptOptions {
  style: 'wireframe' | 'polished' | 'minimal';
  width?: number;
  height?: number;
}

function buildPrompt(spec: UISpecification, options: PromptOptions): string {
  // Example output for a login form:
  // "Create a polished UI mockup of a web application with light theme.
  //  The screen shows a login form with:
  //  - A heading that says 'Welcome Back'
  //  - An email input field with placeholder 'you@example.com'
  //  - A password input field
  //  - A primary 'Sign In' button
  //  Style: Modern, clean design with appropriate spacing and visual hierarchy.
  //  Dimensions: 1920x1080 pixels."
}
```

### 5. Gemini API Integration

```typescript
// src/services/gemini.ts
import { GoogleGenAI } from "@google/genai";

interface GenerationResult {
  success: boolean;
  imageData?: Buffer;
  error?: string;
}

async function generateMockup(prompt: string): Promise<GenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: 'GEMINI_API_KEY environment variable not set. Get your key at https://aistudio.google.com/apikey'
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  // Extract image from response
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      return { success: true, imageData: buffer };
    }
  }

  return { success: false, error: 'No image generated in response' };
}
```

### 6. File I/O

```typescript
// src/utils/file.ts
import { readFile, writeFile, exists, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

async function readJsonFile(path: string): Promise<unknown> {
  const content = await Bun.file(path).text();
  return JSON.parse(content);
}

async function saveImage(buffer: Buffer, outputPath: string): Promise<void> {
  const dir = dirname(outputPath);
  if (!(await exists(dir))) {
    await mkdir(dir, { recursive: true });
  }
  await Bun.write(outputPath, buffer);
}
```

### 7. Error Handling

```typescript
// src/utils/errors.ts
class MockupError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestion?: string
  ) {
    super(message);
    this.name = 'MockupError';
  }
}

// Error codes:
// - JSON_PARSE_ERROR: Invalid JSON syntax
// - VALIDATION_ERROR: Schema validation failed
// - API_KEY_MISSING: No API key configured
// - API_ERROR: Gemini API returned error
// - FILE_NOT_FOUND: Input file doesn't exist
// - FILE_WRITE_ERROR: Cannot write output file
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (P1 - MVP)

1. Set up Bun project with TypeScript
2. Implement argument parsing (`src/cli/args.ts`)
3. Implement UI spec types (`src/core/types.ts`)
4. Implement JSON validation (`src/core/validator.ts`)
5. Implement prompt builder (`src/core/prompt-builder.ts`)
6. Implement Gemini service (`src/services/gemini.ts`)
7. Implement file utilities (`src/utils/file.ts`)
8. Implement main CLI entry point (`src/index.ts`)
9. Add unit tests for validator and prompt builder
10. Add integration test for full CLI flow (with mocked API)

**Deliverable**: Working CLI that generates mockups from JSON files

### Phase 2: Enhanced Input Options (P2)

1. Add inline JSON support (`--json` flag)
2. Add stdin support (`-` argument)
3. Improve validation error messages with suggestions
4. Add unit tests for new input methods

**Deliverable**: CLI supports file, inline, and stdin input

### Phase 3: Customization (P3)

1. Add dimension options (`--width`, `--height`)
2. Add style presets (`--style wireframe|polished|minimal`)
3. Add `--force` flag for overwrite without prompt
4. Update prompt builder to incorporate style/dimension options
5. Add tests for customization options

**Deliverable**: CLI supports output customization

### Phase 4: Polish (P3-P4)

1. Add `--help` with comprehensive usage docs
2. Add `--version` flag
3. Add progress feedback during generation
4. Improve error messages with recovery suggestions
5. Add batch processing for glob patterns (if time permits)

**Deliverable**: Production-ready CLI with excellent UX

---

## Dependencies

| Package | Purpose | Justification |
|---------|---------|---------------|
| `@google/genai` | Gemini API client | Required for image generation; official SDK |

**Total external dependencies**: 1

All other functionality uses:
- Bun built-in APIs (`Bun.file`, `Bun.write`, `process.argv`)
- Node.js built-in modules (`node:fs/promises`, `node:path`)
- `bun:test` for testing

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | API key from https://aistudio.google.com/apikey |

### package.json

```json
{
  "name": "ui-mockup-generator",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "mockup": "./src/index.ts"
  },
  "scripts": {
    "start": "bun run src/index.ts",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.0.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["bun-types"]
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

---

## Testing Strategy

### Unit Tests

| Module | Test Cases |
|--------|------------|
| `args.ts` | Parse file path, parse flags, handle missing args, handle invalid flags |
| `validator.ts` | Valid spec, missing root, invalid component type, nested validation |
| `prompt-builder.ts` | Simple component, nested layout, style variations, dimension handling |
| `errors.ts` | Error formatting, suggestion generation |

### Integration Tests

| Scenario | Approach |
|----------|----------|
| Full CLI flow | Mock Gemini API, verify file output |
| Error handling | Test each error code path |
| Stdin input | Pipe JSON to CLI process |

### Test Fixtures

```text
tests/fixtures/
├── valid-login.json       # Complete login form
├── valid-dashboard.json   # Complex multi-section layout
├── valid-minimal.json     # Simplest valid spec
├── invalid-syntax.json    # Malformed JSON
├── invalid-schema.json    # Valid JSON, invalid spec
└── invalid-type.json      # Unknown component type
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Gemini API changes | Pin SDK version; wrap API calls in service layer |
| Image quality varies | Iterate on prompt engineering; provide style presets |
| Rate limiting | Clear error message with retry suggestion |
| Large JSON specs | Validate size limits; truncate prompt if needed |
| Cross-platform path handling | Use `node:path` for all path operations |

---

## Success Metrics

From specification, verified by:

- **SC-001**: Time from command to image < 30s (excluding API) → Measure in integration tests
- **SC-002**: Validation before API call → Unit test validator runs before generateMockup
- **SC-004**: Self-resolving error messages → Manual review of all error paths
- **SC-005**: Works on fresh Bun install → CI test on clean environment
- **SC-006**: P1-P3 acceptance criteria → Integration tests per acceptance scenario

---

## Open Items Resolved

| Original Question | Resolution |
|-------------------|------------|
| Image Generation API | Gemini API via `@google/genai` SDK |
| Prompt Engineering | Natural language description built from UI spec (see prompt-builder) |
| Output Formats | PNG only (Gemini returns PNG by default) |
| Caching | Deferred to future enhancement (not in initial scope) |
| Cost Management | Deferred; use Gemini free tier initially |
