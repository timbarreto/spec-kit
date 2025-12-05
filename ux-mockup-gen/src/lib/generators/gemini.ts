import { GoogleGenAI } from "@google/genai";

interface RenderOpts { size?: string; theme?: string; format: "png" | "jpeg" }

export async function renderWithGemini(uiModel: any, opts: RenderOpts): Promise<Uint8Array> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const ai = new GoogleGenAI({ apiKey });

  const sizeStr = opts.size ?? "auto";
  const themeStr = opts.theme ?? "default";
  const prompt =
    `Generate a UI mockup image for a mobile/web application based on this UI specification. ` +
    `Create a realistic, polished mockup showing the described interface elements. ` +
    `Size=${sizeStr}, theme=${themeStr}.\n\n` +
    `UI JSON:\n` + JSON.stringify(uiModel, null, 2);

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
