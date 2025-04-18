import { Prisma } from "@prisma/client";
import { IEntry } from "./entry";

type JsonValue =
  | string
  | number
  | boolean
  | Prisma.JsonObject
  | Prisma.JsonArray
  | null;

export interface ICollection {
  id: string;
  slug: string; // "products", "sellers"
  name: string;
  isMedia: boolean;
  fields?: IField[]; // Definición de campos (como en Payload)
  createdAt?: string;
  entries?: IEntry[];
}
export interface ICollectionCreate {
  slug: string; // "products", "sellers"
  name: string;
  fields: IField[]; // Definición de campos (como en Payload)
  isMedia?: boolean;
  entries?: IEntry[];
}

export interface ICollectionError {
  slug?: string;
  name?: string;
  fields?: string;
  createdAt?: string;
  entries?: IEntry[];
}
export interface FieldBase {
  type:
    | "text"
    | "textarea"
    | "richText"
    | "number"
    | "boolean"
    | "date"
    | "upload"
    | "select"
    | "relationship"
    | "group"
    | "repeater"
    | "json"
    | "code"
    | "radio"
    | "point"
    | "hidden";
  label: string;
  name: string; // Clave única del campo
  required?: boolean;
  defaultValue?: any;
}

/** Campos básicos */
export interface TextField extends FieldBase {
  type: "text" | "textarea";
  maxLength?: number;
}
export interface RichTextField extends FieldBase {
  type: "richText";
}
export interface NumberField extends FieldBase {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface BooleanField extends FieldBase {
  type: "boolean";
}

export interface DateField extends FieldBase {
  type: "date";
  format?: "date" | "datetime";
}

export interface SelectField extends FieldBase {
  type: "select" | "radio";
  options: string[]; // ["Opción 1", "Opción 2"]
}

export interface RelationshipField extends FieldBase {
  type: "relationship";
  relationTo: string; // "users", "posts", etc.
  multiple?: boolean;
}

export interface UploadField extends FieldBase {
  type: "upload";
  allowedTypes?: string[]; // Ej: ["image/*", "application/pdf"]
  maxSize?: number; // En bytes
}

/** Campos avanzados */
export interface GroupField extends FieldBase {
  type: "group";
  fields: IField[];
}

export interface RepeaterField extends FieldBase {
  type: "repeater";
  fields: IField[];
  minItems?: number;
  maxItems?: number;
}

export type IField =
  | TextField
  | RichTextField
  | NumberField
  | BooleanField
  | DateField
  | SelectField
  | RelationshipField
  | UploadField
  | GroupField
  | RepeaterField;
