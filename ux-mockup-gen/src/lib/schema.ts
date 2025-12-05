export interface ValidationResult { valid: boolean; errors: string[] }

export function validateUI(model: any): ValidationResult {
  const errors: string[] = [];
  if (typeof model !== "object" || model === null) {
    errors.push("root must be an object");
  }
  if (!Array.isArray(model?.components)) {
    errors.push("components must be an array");
  }
  // Minimal validation for MVP; extend later per data-model
  return { valid: errors.length === 0, errors };
}
