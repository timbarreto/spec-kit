import { GoogleGenAI } from "@google/genai";

interface RenderOpts { size?: string; theme?: string; format: "png" | "jpeg" }

export async function renderWithGemini(uiModel: any, opts: RenderOpts): Promise<Uint8Array> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const ai = new GoogleGenAI({ apiKey });

  const sizeStr = opts.size ?? "1080x1920";
  const themeStr = opts.theme ?? "default";
  const prompt = `Generate a UI mockup image. Follow these rules EXACTLY:

RENDERING RULES:
- Render as a flat 2D screen capture, NO device frame or bezels
- Use exact dimensions: ${sizeStr} pixels
- Use EXACTLY the colors specified in the JSON (backgroundColor, etc.)
- Render components in EXACT order listed, top to bottom
- Use system default sans-serif font (SF Pro, Roboto, or similar)
- Match spacing/padding values from JSON precisely in pixels
- Style: clean, minimal, production-ready UI screenshot

COMPONENT RENDERING:
- textInput: rounded rectangle with label above, placeholder text inside
- button[style=primary]: solid filled rounded rectangle
- button[style=outline]: transparent with border
- checkbox: small square with checkmark when checked
- link: underlined text
- divider: thin horizontal line with centered label
- row/column: flex container with specified spacing

Theme: ${themeStr}

UI JSON:
` + JSON.stringify(uiModel, null, 2);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const base64 = part.inlineData.data;
        return Uint8Array.from(Buffer.from(base64, "base64"));
      }
    }

    throw new Error("Gemini did not return an image in the response");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isAuth = /unauthorized|permission|auth|401|API.?key/i.test(msg);
    if (isAuth) {
      throw new Error("Gemini request failed: unauthorized or invalid GEMINI_API_KEY");
    }
    throw new Error(`Gemini request failed: ` + msg);
  }
}
