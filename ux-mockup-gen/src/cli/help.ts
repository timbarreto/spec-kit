export function printHelp() {
  console.error(`\nUsage: ui-mockup [options] [--input <file>]\n\nOptions:\n  --input <file>         Path to UI JSON (or provide via stdin)\n  -o, --output <file>    Output image path\n  -f, --format <fmt>     Output format: png|jpeg (default: png)\n  -g, --generator <gen>  Backend: gemini|mock (default: gemini)\n  --size <WxH>           Image size, e.g., 1024x768\n  --theme <name>         Theme name\n  --json                 Emit structured JSON summary to stdout\n  --force                Overwrite output file if it exists\n  --verbose              Emit diagnostics to stderr (Gemini requests)\n  -h, --help             Show help\n  -V, --version          Show version\n\nExamples:\n  ui-mockup --input ui.json --output mock.png\n  cat ui.json | ui-mockup --output mock.jpeg --format jpeg --json\n  ui-mockup --input ui.json --output mock.png --generator gemini\n`);
}

export function printVersion() {
  console.error("ui-mockup version 0.1.0");
}
