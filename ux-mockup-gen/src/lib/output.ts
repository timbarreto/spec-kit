import { writeFile } from "node:fs/promises";

export async function writeOutput(bytes: Uint8Array, outputPath?: string, format: "png" | "jpeg" = "png", force = false): Promise<string> {
  const path = outputPath ?? `mock.${format}`;
  // No overwrite protection yet; Bun/Node will overwrite. Implement force check later.
  await writeFile(path, bytes);
  return path;
}
