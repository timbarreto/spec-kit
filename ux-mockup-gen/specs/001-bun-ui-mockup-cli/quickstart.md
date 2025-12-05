# Quickstart: Bun UI Mockup CLI

## Prerequisites

- Bun installed
- Gemini API key in env: `GEMINI_API_KEY`

## Install

```bash
bun install
```

## Usage

```bash
# From file
bun run ui-mockup --input ui.json --output mock.png --format png

# From stdin
cat ui.json | bun run ui-mockup --output mock.jpeg --format jpeg

# JSON summary output
bun run ui-mockup --input ui.json --output mock.png --json

# Select generator
bun run ui-mockup --input ui.json --output mock.png --generator gemini

# Help and version
bun run ui-mockup --help
bun run ui-mockup --version
```

## Notes

- stdout prints data (paths/JSON); logs/errors on stderr.
- Use `--force` to overwrite output files.
- Config precedence: flags → env → project → user.
