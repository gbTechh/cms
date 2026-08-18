import { PrismaSingleton } from "~/admin/infraestructure";
import { IField } from "~/admin/interfaces";
import { coerceEntryData, validateEntryData } from "~/admin/lib";

const prisma = PrismaSingleton.getInstance();

export interface SubmitFormResult {
  success: boolean;
  errors?: { field: string; message: string }[];
}

// Campo oculto de honeypot: si un bot lo rellena, respondemos éxito sin
// guardar nada (no delatamos la trampa).
const HONEYPOT_FIELD = "_gotcha";

// Campo oculto con Date.now() del momento en que se renderizó el formulario
// (renderizarlo en el servidor, sin JS, alcanza — no hace falta fetch). Un
// bot que auto-rellena y envía en milisegundos no llega a este mínimo; un
// humano tarda al menos un par de segundos en escribir.
const TIMESTAMP_FIELD = "_ts";
const MIN_ELAPSED_MS = 1500;
const MAX_ELAPSED_MS = 6 * 60 * 60 * 1000; // 6h: más que eso, es un timestamp reciclado/viejo

// Cota defensiva por campo y por formulario, independiente de los `maxLength`
// que cada colección defina (o no) — evita que alguien mande megabytes de
// texto en un campo sin límite configurado.
const MAX_FIELD_LENGTH = 5000;
const MAX_FIELDS = 50;

const isSpamByTiming = (rawData: Record<string, any>): boolean => {
  const ts = Number(rawData[TIMESTAMP_FIELD]);
  if (!ts || Number.isNaN(ts)) return true; // sin timestamp válido, se trata como sospechoso
  const elapsed = Date.now() - ts;
  return elapsed < MIN_ELAPSED_MS || elapsed > MAX_ELAPSED_MS;
};

const isPayloadReasonable = (rawData: Record<string, any>): boolean => {
  const entries = Object.entries(rawData);
  if (entries.length > MAX_FIELDS) return false;
  return entries.every(([, value]) => typeof value !== "string" || value.length <= MAX_FIELD_LENGTH);
};

// Solo guardamos las claves que la colección realmente define — descarta
// `_ts`/`_gotcha` (bookkeeping anti-spam) y cualquier otra clave extra que
// un cliente hostil intente colar en el payload.
const pickKnownFields = (fields: IField[], rawData: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const field of fields) {
    if (field.name in rawData) result[field.name] = rawData[field.name];
  }
  return result;
};

/**
 * Valida y guarda el envío de un formulario público (contacto, newsletter,
 * etc.) contra los `fields` definidos en la colección `type: "form"` con
 * ese slug. Sirve para CUALQUIER formulario — no hace falta tocar esta
 * función al crear uno nuevo, solo definir su colección.
 */
export async function submitPublicForm(
  slug: string,
  rawData: Record<string, any>
): Promise<SubmitFormResult> {
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection || collection.deletedAt || collection.type !== "form") {
    return { success: false, errors: [{ field: "_form", message: "Formulario no encontrado" }] };
  }

  if (!isPayloadReasonable(rawData)) {
    return { success: false, errors: [{ field: "_form", message: "Envío inválido" }] };
  }

  if (rawData[HONEYPOT_FIELD] || isSpamByTiming(rawData)) {
    // Fingimos éxito para no delatar qué trampa lo detectó.
    return { success: true };
  }

  const fields = collection.fields as unknown as IField[];
  const data = coerceEntryData(fields, pickKnownFields(fields, rawData));

  const validation = validateEntryData(fields, data);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.errors.map((e) => ({ field: e.field, message: e.message })),
    };
  }

  await prisma.formSubmission.create({
    data: { collectionId: collection.id, data },
  });

  return { success: true };
}
