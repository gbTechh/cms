import { Prisma } from "@prisma/client";
import { IEntry } from "./entry";
import { OptionDropdownSelect } from "~/admin/components";

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
  label: string;
  name: string; // Clave única del campo
  required?: boolean;
  defaultValue?: any;
}

/** Campos básicos */
export interface TextField extends FieldBase {
  type: "text" | "textarea";
  maxLength?: number;
  defaultValue?: string;
}
export interface RichTextField extends FieldBase {
  type: "richText";
  defaultValue?: string;
}
export interface NumberField extends FieldBase {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}

export interface CheckBox extends FieldBase {
  type: "checkbox";
  defaultValue?: boolean;
}
export interface Toggle extends FieldBase {
  type: "toggle";
  defaultValue?: boolean;
}

export interface DateField extends FieldBase {
  type: "date";
  format?: "date" | "datetime";
  defaultValue?: string;
}

export interface SelectField extends FieldBase {
  type: "select";
  hasMany?: boolean;
  options: OptionDropdownSelect[]; // ["Opción 1", "Opción 2"]
  defaultValue?: string;
}
export interface RadioButton extends FieldBase {
  type: "radio";
  options: OptionDropdownSelect[]; // ["Opción 1", "Opción 2"]
  defaultValue?: string;
}

export interface RelationshipField extends FieldBase {
  type: "relationship";
  relationTo: string; // "users", "posts", etc.
  multiple?: boolean;
  defaultValue?: string;
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

export interface ArrayField extends FieldBase {
  type: "array";
  fields: IField[];
  minItems?: number;
  maxItems?: number;
}

export type IField =
  | TextField
  | RichTextField
  | NumberField
  | CheckBox
  | RadioButton
  | DateField
  | SelectField
  | RelationshipField
  | UploadField
  | GroupField
  | Toggle
  | ArrayField;
