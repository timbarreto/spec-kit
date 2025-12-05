#!/usr/bin/env bun
import { argv, stdin } from "bun";
import { printHelp, printVersion } from "./help";
import { generate } from "./commands/generate";

function logErr(msg: string) {
  console.error(msg);
}

function parseArgs(args: string[]) {
  const flags: Record<string, string | boolean> = {};
  for (let i = 2; i < args.length; i++) {
    const a = args[i];
    if (a === "--help" || a === "-h") flags.help = true;
    else if (a === "--version" || a === "-V") flags.version = true;
    else if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      flags[k] = v ?? true;
    } else if (a === "-o") flags.output = args[++i];
    else if (a === "-f") flags.format = args[++i];
    else if (a === "-g") flags.generator = args[++i];
    else if (!flags.input) flags.input = a;
  }
  return flags;
}

async function main() {
  const flags = parseArgs(argv);
  if (flags.help) {
    printHelp();
    return;
  }
  if (flags.version) {
    printVersion();
    return;
  }
  try {
    const result = await generate({
      inputPath: typeof flags.input === "string" ? flags.input : undefined,
      stdin,
      outputPath: typeof flags.output === "string" ? flags.output : undefined,
      format: (typeof flags.format === "string" ? flags.format : "png") as "png" | "jpeg",
      json: !!flags.json,
      force: !!flags.force,
      size: typeof flags.size === "string" ? flags.size : undefined,
      theme: typeof flags.theme === "string" ? flags.theme : undefined,
      generator: typeof flags.generator === "string" ? flags.generator : "gemini",
    });
    if (flags.json) {
      process.stdout.write(JSON.stringify(result) + "\n");
    } else {
      process.stdout.write(result.outputPath + "\n");
    }
  } catch (err) {
    logErr(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main();
