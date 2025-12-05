import { Readable } from "node:stream";

export async function parseInput(inputPath: string | undefined, stdin: Readable): Promise<any> {
  let jsonStr: string;
  if (inputPath) {
    jsonStr = await Bun.file(inputPath).text();
  } else {
    jsonStr = await new Response(stdin as any).text();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("Invalid JSON: parse error");
  }
}
