# Data Model: Bun UI Mockup CLI

## Entities

- UIModel
  - fields: components[], layout, styles, metadata
  - relationships: components contain children; layout defines positioning
  - validation: required fields present; types correct per schema

- RenderOptions
  - fields: size (WxH), theme, background, generator, quality, format (png|jpeg)
  - validation: size parseable; format supported; generator in {gemini,mock}

- ResultSummary
  - fields: status (success|error), outputPath, generator, durationMs, warnings[]
  - validation: outputPath required on success; errors surfaced with codes

## State Transitions

- Input → Validated → Rendered → OutputWritten → SummaryEmitted
- Failure can occur during: parse, validate, render, write
