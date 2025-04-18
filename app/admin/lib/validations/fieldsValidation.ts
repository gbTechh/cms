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
});

const CheckboxFieldSchema = BaseFieldSchema.extend({
  type: z.literal("checkbox"),
});

const DateFieldSchema = BaseFieldSchema.extend({
  type: z.literal("date"),
  format: z.enum(["date", "datetime"]).optional(),
});

const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal("select"),
  options: z.array(z.string()).min(1, "Se requiere al menos una opción"),
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
