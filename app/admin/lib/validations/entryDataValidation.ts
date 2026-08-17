import { IField } from "~/admin/interfaces";
import { slateToPlainText } from "../richText";

export interface EntryValidationError {
  field: string;
  message: string;
}

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

function validateField(
  field: IField,
  value: unknown,
  path: string,
  errors: EntryValidationError[]
) {
  if (field.required && isEmpty(value)) {
    errors.push({ field: path, message: `"${field.label}" es requerido` });
    return;
  }

  // Un array vacío/ausente igual debe respetar minItems aunque el campo no
  // esté marcado como "required" (minItems es en sí mismo una restricción).
  const skipWhenEmpty = !(field.type === "array" && field.minItems);
  if (isEmpty(value) && skipWhenEmpty) return;

  switch (field.type) {
    case "text":
    case "textarea": {
      if (typeof value !== "string") {
        errors.push({ field: path, message: `"${field.label}" debe ser texto` });
      } else if (field.maxLength && value.length > field.maxLength) {
        errors.push({
          field: path,
          message: `"${field.label}" supera el largo máximo (${field.maxLength})`,
        });
      }
      break;
    }
    case "richText": {
      if (!Array.isArray(value)) {
        errors.push({ field: path, message: `"${field.label}" debe ser contenido de texto enriquecido válido` });
        break;
      }
      if (field.required && slateToPlainText(value) === "") {
        errors.push({ field: path, message: `"${field.label}" es requerido` });
      }
      break;
    }
    case "number": {
      if (typeof value !== "number" || Number.isNaN(value)) {
        errors.push({ field: path, message: `"${field.label}" debe ser numérico` });
        break;
      }
      if (field.min !== undefined && value < field.min) {
        errors.push({ field: path, message: `"${field.label}" debe ser mayor o igual a ${field.min}` });
      }
      if (field.max !== undefined && value > field.max) {
        errors.push({ field: path, message: `"${field.label}" debe ser menor o igual a ${field.max}` });
      }
      break;
    }
    case "checkbox":
    case "toggle": {
      if (typeof value !== "boolean") {
        errors.push({ field: path, message: `"${field.label}" debe ser verdadero/falso` });
      }
      break;
    }
    case "date": {
      if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
        errors.push({ field: path, message: `"${field.label}" debe ser una fecha válida` });
      }
      break;
    }
    case "select": {
      const options = field.options?.map((o) => o.value) ?? [];
      const values = field.hasMany ? (Array.isArray(value) ? value : [value]) : [value];
      for (const v of values) {
        if (!options.includes(v as string)) {
          errors.push({ field: path, message: `"${field.label}" tiene un valor no permitido: ${v}` });
        }
      }
      break;
    }
    case "radio": {
      const options = field.options?.map((o) => o.value) ?? [];
      if (!options.includes(value as string)) {
        errors.push({ field: path, message: `"${field.label}" tiene un valor no permitido` });
      }
      break;
    }
    case "relationship": {
      const values = field.multiple ? (Array.isArray(value) ? value : [value]) : [value];
      for (const v of values) {
        if (typeof v !== "string") {
          errors.push({ field: path, message: `"${field.label}" debe referenciar un id válido` });
        }
      }
      break;
    }
    case "upload": {
      if (typeof value !== "string") {
        errors.push({ field: path, message: `"${field.label}" debe referenciar un archivo válido` });
      }
      break;
    }
    case "group": {
      if (typeof value !== "object" || Array.isArray(value)) {
        errors.push({ field: path, message: `"${field.label}" debe ser un objeto` });
        break;
      }
      for (const sub of field.fields ?? []) {
        validateField(sub, (value as Record<string, unknown>)[sub.name], `${path}.${sub.name}`, errors);
      }
      break;
    }
    case "array": {
      if (value !== undefined && value !== null && !Array.isArray(value)) {
        errors.push({ field: path, message: `"${field.label}" debe ser una lista` });
        break;
      }
      const arrValue = Array.isArray(value) ? value : [];
      if (field.minItems !== undefined && arrValue.length < field.minItems) {
        errors.push({
          field: path,
          message: `"${field.label}" requiere al menos ${field.minItems} elemento(s)`,
        });
      }
      if (field.maxItems !== undefined && arrValue.length > field.maxItems) {
        errors.push({
          field: path,
          message: `"${field.label}" permite máximo ${field.maxItems} elemento(s)`,
        });
      }
      arrValue.forEach((item, idx) => {
        for (const sub of field.fields ?? []) {
          validateField(sub, item?.[sub.name], `${path}[${idx}].${sub.name}`, errors);
        }
      });
      break;
    }
    default:
      // Tipo de campo no reconocido: ya se validó "required" arriba, no se
      // valida más para no rechazar campos legítimos de tipos futuros.
      break;
  }
}

export function validateEntryData(
  fields: IField[] | undefined | null,
  data: Record<string, unknown> | undefined | null
): { success: boolean; errors: EntryValidationError[] } {
  const errors: EntryValidationError[] = [];
  for (const field of fields ?? []) {
    validateField(field, data?.[field.name], field.name, errors);
  }
  return { success: errors.length === 0, errors };
}

/**
 * Los inputs HTML (incluso type="number") siempre entregan strings, nunca
 * un number real. Antes de validar/guardar, convierte los valores de campos
 * "number" que llegaron como string numérico ("900") a su forma real (900),
 * recursivamente dentro de group/array. Deja todo lo demás intacto.
 */
export function coerceEntryData(
  fields: IField[] | undefined | null,
  data: Record<string, any> | undefined | null
): Record<string, any> {
  const result: Record<string, any> = { ...(data ?? {}) };

  for (const field of fields ?? []) {
    const raw = result[field.name];
    if (raw === undefined || raw === null) continue;

    if (field.type === "number" && typeof raw === "string" && raw.trim() !== "") {
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) result[field.name] = parsed;
    } else if (field.type === "group" && raw && typeof raw === "object" && !Array.isArray(raw)) {
      result[field.name] = coerceEntryData(field.fields, raw);
    } else if (field.type === "array" && Array.isArray(raw)) {
      result[field.name] = raw.map((item) => coerceEntryData(field.fields, item));
    }
  }

  return result;
}
