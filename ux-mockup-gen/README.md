# Bun UI Mockup CLI

CLI tool (Bun) to generate UI mockup images from a JSON UI description.

## Usage

- Inputs: `--input <file>` or via stdin
- Outputs: image path to stdout; logs/errors on stderr
- Flags: `--output`, `--format png|jpeg`, `--generator gemini|mock`, `--size WxH`, `--theme`, `--json`, `--force`, `--help`, `--version`

## Examples

```bash
bun run ui-mockup --input ui.json --output mock.png
cat ui.json | bun run ui-mockup --output mock.jpeg --format jpeg --json
bun run ui-mockup --input ui.json --output mock.png --generator gemini
```

## Config Precedence

flags → env → project → user. Requires `GEMINI_API_KEY` for Gemini backend.

## Constitution Alignment

- Text I/O contract respected
- Single-responsibility command (`generate`)
- Tests-first with contract/unit/integration
- Discoverability via `--help`/`--version`
- Observability to stderr
- Versioning policy for breaking changes
