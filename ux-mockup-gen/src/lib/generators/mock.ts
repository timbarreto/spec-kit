interface RenderOpts { size?: string; theme?: string; format: "png" | "jpeg" }

// Minimal 1x1 pixel images for testing (black)
const PNG_1x1 = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
    "base64"
  )
);
const JPEG_1x1 = Uint8Array.from(
  Buffer.from(
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEB...", // truncated placeholder
    "base64"
  )
);

export async function renderWithMock(_uiModel: any, opts: RenderOpts): Promise<Uint8Array> {
  return opts.format === "png" ? PNG_1x1 : JPEG_1x1;
}
