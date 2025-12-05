import { spawn } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";

test("stdin valid JSON outputs path on stdout", async () => {
  const ui = { components: [{ type: "div", props: {} }] };
  const proc = spawn(process.execPath, ["./src/cli/index.ts", "--output=contract.png"], {
    env: { ...process.env, GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "test-key" },
    stdio: ["pipe", "pipe", "pipe"],
  });
  proc.stdin.write(JSON.stringify(ui));
  proc.stdin.end();
  const out = await new Promise<string>((resolve) => {
    let data = "";
    proc.stdout.on("data", (b) => (data += b.toString()));
    proc.on("close", () => resolve(data.trim()));
  });
  expect(out.endsWith("contract.png")).toBe(true);
  rmSync("contract.png", { force: true });
});
