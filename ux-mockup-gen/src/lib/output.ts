import { writeFile, stat } from "node:fs/promises";

export async function writeOutput(bytes: Uint8Array, outputPath?: string, format: "png" | "jpeg" = "png", force = false): Promise<string> {
  const path = outputPath ?? `mock.${format}`;
  try {
    const s = await stat(path);
    if (s && !force) throw new Error(`Output exists: ${path}. Use --force to overwrite.`);
  } catch {}
  await writeFile(path, bytes);
  return path;
}
