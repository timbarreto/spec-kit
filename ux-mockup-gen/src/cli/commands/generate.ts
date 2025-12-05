import { parseInput } from "../../lib/parser";
import { validateUI } from "../../lib/schema";
import { renderWithGemini } from "../../lib/generators/gemini";
import { renderWithMock } from "../../lib/generators/mock";
import { writeOutput } from "../../lib/output";

export interface GenerateOptions {
  inputPath?: string;
  stdin: NodeJS.ReadableStream | ReadableStream<any>;
  outputPath?: string;
  format: "png" | "jpeg";
  json: boolean;
  force: boolean;
  size?: string;
  theme?: string;
  generator: "gemini" | "mock";
}

export async function generate(opts: GenerateOptions) {
  const uiModel = await parseInput(opts.inputPath, opts.stdin);
  const validation = validateUI(uiModel);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }
  const start = Date.now();
  const imageBytes = await (opts.generator === "mock"
    ? renderWithMock(uiModel, { size: opts.size, theme: opts.theme, format: opts.format })
    : renderWithGemini(uiModel, { size: opts.size, theme: opts.theme, format: opts.format }));
  const outputPath = await writeOutput(imageBytes, opts.outputPath, opts.format, opts.force);
  const durationMs = Date.now() - start;
  return {
    status: "success",
    outputPath,
    generator: opts.generator,
    durationMs,
    warnings: [],
  };
}
