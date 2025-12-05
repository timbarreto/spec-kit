export interface ValidationResult { valid: boolean; errors: string[] }

export function validateUI(model: any): ValidationResult {
  const errors: string[] = [];
  if (typeof model !== "object" || model === null) {
    errors.push("root must be an object");
  }
  // Support both root-level components and screen.components structure
  const components = model?.components ?? model?.screen?.components;
  if (!Array.isArray(components)) {
    errors.push("components must be an array");
  }
  // Minimal validation for MVP; extend later per data-model
  return { valid: errors.length === 0, errors };
}
