import { Readable } from "node:stream";

async function readNodeReadable(stream: NodeJS.ReadableStream): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    let data = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });
}

export async function parseInput(
  inputPath: string | undefined,
  stdin: NodeJS.ReadableStream | ReadableStream<any>
): Promise<any> {
  let jsonStr: string;
  if (inputPath) {
    jsonStr = await Bun.file(inputPath).text();
  } else if (typeof (stdin as any).getReader === "function") {
    // Web ReadableStream
    jsonStr = await new Response(stdin as any).text();
  } else {
    // NodeJS.ReadableStream
    jsonStr = await readNodeReadable(stdin as NodeJS.ReadableStream);
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("Invalid JSON: parse error");
  }
}
