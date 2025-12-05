import { GoogleGenerativeAI } from "@google/generative-ai";

interface RenderOpts { size?: string; theme?: string; format: "png" | "jpeg" }

// NOTE: The Gemini JavaScript SDK currently focuses on text/vision. For image
// generation, use the appropriate model/endpoint when available. Here we send
// a structured prompt and expect a base64 image string in the response.
export async function renderWithGemini(uiModel: any, opts: RenderOpts): Promise<Uint8Array> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");
  const genai = new GoogleGenerativeAI(apiKey);
  
  // Choose a fast multimodal model; adjust per latest docs.
  const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = [
    {
      role: "user",
      parts: [
        {
          text:
            `Create a UI mockup image encoded in base64 (${opts.format}) representing this UI JSON. ` +
            `Size=${opts.size ?? "auto"}, theme=${opts.theme ?? "default"}.\n\n` +
            `UI JSON:\n${JSON.stringify(uiModel)}`,
        },
      ],
    },
  ];

  // Timeout handling
  const controller = new AbortController();
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS ?? 5000);
  const t = setTimeout(() => controller.abort(), timeoutMs);
  let response: any;
  try {
    const result = await model.generateContent({ contents: prompt, signal: controller.signal as any });
    response = result.response;
  } catch (err) {
    clearTimeout(t);
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = controller.signal.aborted;
    const isAuth = /unauthorized|permission|auth|401/i.test(msg);
    if (isTimeout) {
      throw new Error(`Gemini request failed (timeout after ${timeoutMs}ms)`);
    }
    if (isAuth) {
      throw new Error("Gemini request failed: unauthorized or invalid GEMINI_API_KEY");
    }
    throw new Error(`Gemini request failed: ${msg}`);
  }
  clearTimeout(t);

  // Prefer structured parts with inlineData (per SDK docs)
  // response.candidates[0].content.parts may contain inlineData with base64
  const candidate = response?.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];
  for (const p of parts as any[]) {
    if (p.inlineData?.mimeType?.includes("image/")) {
      const base64 = p.inlineData.data as string;
      if (base64) return Uint8Array.from(Buffer.from(base64, "base64"));
    }
    if (p.fileData?.mimeType?.includes("image/")) {
      const base64 = p.fileData.data as string;
      if (base64) return Uint8Array.from(Buffer.from(base64, "base64"));
    }
    if (typeof p.text === "string") {
      const match = (p.text as string).match(/base64\s*:\s*([A-Za-z0-9+/=]+)/);
      if (match) return Uint8Array.from(Buffer.from(match[1], "base64"));
    }
  }

  // Fallback: try response.text()
  const text = response?.text?.() ?? (typeof response?.text === "function" ? response.text() : undefined);
  if (typeof text === "string") {
    const match = text.match(/base64\s*:\s*([A-Za-z0-9+/=]+)/);
    if (match) return Uint8Array.from(Buffer.from(match[1], "base64"));
    return new TextEncoder().encode(text);
  }
  throw new Error("Gemini did not return an image payload");
}
