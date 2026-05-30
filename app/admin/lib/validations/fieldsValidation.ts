import { z } from "zod";

// Esquema base para todos los campos (sin definir `type` aquí)
const BaseFieldSchema = z.object({
  name: z.string().min(1, "El nombre del campo es requerido"),
  label: z.string().min(1, "La etiqueta del campo es requerida"),
  required: z.boolean().optional(),
  defaultValue: z.any().optional(),
});

// Esquemas específicos para cada tipo de campo
const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal("text"),
  maxLength: z.number().optional(),
  defaultValue: z.string().optional(),
});

const TextareaFieldSchema = BaseFieldSchema.extend({
  type: z.literal("textarea"),
  maxLength: z.number().optional(),
});

const RichTextFieldSchema = BaseFieldSchema.extend({
  type: z.literal("richText"),
  editor: z.enum(["slate", "quill"]).optional(),
});

const NumberFieldSchema = BaseFieldSchema.extend({
  type: z.literal("number"),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  defaultValue: z.number().optional(),
});

const CheckboxFieldSchema = BaseFieldSchema.extend({
  type: z.literal("checkbox"),
  defaultValue: z.boolean().optional(),
});
const ToggleFieldSchema = BaseFieldSchema.extend({
  type: z.literal("toggle"),
  defaultValue: z.boolean().optional(),
});

const DateFieldSchema = BaseFieldSchema.extend({
  type: z.literal("date"),
  format: z.enum(["date", "datetime"]).optional(),
});

const OptionDropdownSelectSchema = z.object({
  value: z.string(),
  label: z.string(),
  // Agrega otras propiedades si las tienes en tu interfaz
});

const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal("select"),
  hasMany: z.boolean().optional().default(false),
  options: z
    .array(OptionDropdownSelectSchema)
    .min(1, "Se requiere al menos una opción"),
  defaultValue: z
    .unknown()
    .optional()
    .transform((val, ctx) => {
      const hasMany = (ctx as any).hasMany;

      if (hasMany) {
        return Array.isArray(val) ? val : val !== undefined ? [val] : undefined;
      }
      return Array.isArray(val) ? val[0] : val;
    }),
});

const RadioFieldSchema = BaseFieldSchema.extend({
  type: z.literal("radio"),
  options: z
    .array(OptionDropdownSelectSchema)
    .min(1, "Se requiere al menos una opción"),
  defaultValue: z.string().optional(),
});

const RelationshipFieldSchema = BaseFieldSchema.extend({
  type: z.literal("relationship"),
  collection: z.string().min(1, "Se requiere un slug de colección"),
  multiple: z.boolean().optional(),
});

const UploadFieldSchema = BaseFieldSchema.extend({
  type: z.literal("upload"),
  allowedTypes: z.array(z.string()).optional(),
  maxSize: z.number().optional(),
});

const JsonFieldSchema = BaseFieldSchema.extend({
  type: z.literal("json"),
});

const CodeFieldSchema = BaseFieldSchema.extend({
  type: z.literal("code"),
  language: z.string().optional(),
});

// Esquema recursivo para array y group (definidos después de FieldSchema)
let ArrayFieldSchema: z.ZodObject<any>;
let GroupFieldSchema: z.ZodObject<any>;

// Unión de todos los tipos de campos (excluyendo array y group por ahora)
const NonRecursiveFieldSchema = z.discriminatedUnion("type", [
  TextFieldSchema,
  TextareaFieldSchema,
  RichTextFieldSchema,
  NumberFieldSchema,
  CheckboxFieldSchema,
  DateFieldSchema,
  SelectFieldSchema,
  RelationshipFieldSchema,
  UploadFieldSchema,
  JsonFieldSchema,
  CodeFieldSchema,
]);

// Definimos FieldSchema como una unión que incluirá los esquemas recursivos
const FieldSchema: z.ZodType = z.lazy(() =>
  z.discriminatedUnion("type", [
    TextFieldSchema,
    TextareaFieldSchema,
    RichTextFieldSchema,
    NumberFieldSchema,
    CheckboxFieldSchema,
    RadioFieldSchema,
    ToggleFieldSchema,
    DateFieldSchema,
    SelectFieldSchema,
    RelationshipFieldSchema,
    UploadFieldSchema,
    JsonFieldSchema,
    CodeFieldSchema,
    ArrayFieldSchema,
    GroupFieldSchema,
  ])
);

// Ahora definimos ArrayFieldSchema y GroupFieldSchema
ArrayFieldSchema = BaseFieldSchema.extend({
  type: z.literal("array"),
  fields: z.array(FieldSchema),
  maxItems: z.number().optional(),
  minItems: z.number().optional(),
});

GroupFieldSchema = BaseFieldSchema.extend({
  type: z.literal("group"),
  fields: z.array(FieldSchema),
});

// Esquema para la colección
const CollectionSchema = z.object({
  name: z.string().min(1, "El nombre de la colección es requerido"),
  slug: z.string().min(1, "El slug de la colección es requerido"),
  fields: z.array(FieldSchema),
  isMedia: z.boolean().optional(),
});

// Función para validar una colección
export function validateCollection(collection: unknown) {
  return CollectionSchema.safeParse(collection);
}
