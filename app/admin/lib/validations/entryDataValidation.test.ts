import { describe, expect, it } from "vitest";
import { coerceEntryData, validateEntryData } from "./entryDataValidation";
import type { IField } from "~/admin/interfaces";

describe("validateEntryData", () => {
  it("passes when there are no fields", () => {
    const result = validateEntryData([], {});
    expect(result.success).toBe(true);
  });

  it("rejects a missing required field", () => {
    const fields: IField[] = [{ type: "text", name: "title", label: "Título", required: true }];
    const result = validateEntryData(fields, {});
    expect(result.success).toBe(false);
    expect(result.errors[0].field).toBe("title");
  });

  it("accepts a valid required text field", () => {
    const fields: IField[] = [{ type: "text", name: "title", label: "Título", required: true }];
    const result = validateEntryData(fields, { title: "Hola" });
    expect(result.success).toBe(true);
  });

  it("rejects text longer than maxLength", () => {
    const fields: IField[] = [{ type: "text", name: "title", label: "Título", maxLength: 3 }];
    const result = validateEntryData(fields, { title: "demasiado largo" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-numeric value for a number field", () => {
    const fields: IField[] = [{ type: "number", name: "price", label: "Precio" }];
    const result = validateEntryData(fields, { price: "not-a-number" });
    expect(result.success).toBe(false);
  });

  it("rejects a number outside min/max", () => {
    const fields: IField[] = [{ type: "number", name: "price", label: "Precio", min: 10, max: 20 }];
    expect(validateEntryData(fields, { price: 5 }).success).toBe(false);
    expect(validateEntryData(fields, { price: 25 }).success).toBe(false);
    expect(validateEntryData(fields, { price: 15 }).success).toBe(true);
  });

  it("rejects a select value outside the declared options", () => {
    const fields: IField[] = [
      {
        type: "select",
        name: "status",
        label: "Estado",
        options: [{ value: "draft", label: "Borrador" }, { value: "published", label: "Publicado" }],
      },
    ];
    expect(validateEntryData(fields, { status: "archived" }).success).toBe(false);
    expect(validateEntryData(fields, { status: "draft" }).success).toBe(true);
  });

  it("leaves optional empty fields alone", () => {
    const fields: IField[] = [{ type: "text", name: "subtitle", label: "Subtítulo" }];
    const result = validateEntryData(fields, {});
    expect(result.success).toBe(true);
  });

  it("validates nested group fields recursively", () => {
    const fields: IField[] = [
      {
        type: "group",
        name: "seo",
        label: "SEO",
        fields: [{ type: "text", name: "metaTitle", label: "Meta título", required: true }],
      },
    ];
    expect(validateEntryData(fields, { seo: {} }).success).toBe(false);
    expect(validateEntryData(fields, { seo: { metaTitle: "ok" } }).success).toBe(true);
  });

  it("validates array items recursively and enforces minItems", () => {
    const fields: IField[] = [
      {
        type: "array",
        name: "items",
        label: "Items",
        minItems: 1,
        fields: [{ type: "text", name: "name", label: "Nombre", required: true }],
      },
    ];
    expect(validateEntryData(fields, { items: [] }).success).toBe(false);
    expect(validateEntryData(fields, { items: [{ name: "" }] }).success).toBe(false);
    expect(validateEntryData(fields, { items: [{ name: "ok" }] }).success).toBe(true);
  });
});

describe("coerceEntryData", () => {
  it("converts a numeric string coming from an HTML input into a real number", () => {
    const fields: IField[] = [{ type: "number", name: "price", label: "Precio" }];
    const result = coerceEntryData(fields, { price: "900" });
    expect(result.price).toBe(900);
    expect(typeof result.price).toBe("number");
  });

  it("leaves a non-numeric string as-is so validation still rejects it", () => {
    const fields: IField[] = [{ type: "number", name: "price", label: "Precio" }];
    const result = coerceEntryData(fields, { price: "not-a-number" });
    expect(result.price).toBe("not-a-number");
  });

  it("makes a numeric-string value pass validation end-to-end", () => {
    const fields: IField[] = [{ type: "number", name: "price", label: "Precio", min: 0 }];
    const coerced = coerceEntryData(fields, { price: "900" });
    expect(validateEntryData(fields, coerced).success).toBe(true);
  });

  it("leaves non-number fields untouched", () => {
    const fields: IField[] = [{ type: "text", name: "title", label: "Título" }];
    const result = coerceEntryData(fields, { title: "900" });
    expect(result.title).toBe("900");
  });

  it("coerces number fields nested inside group and array", () => {
    const fields: IField[] = [
      {
        type: "group",
        name: "specs",
        label: "Specs",
        fields: [{ type: "number", name: "area", label: "Área" }],
      },
      {
        type: "array",
        name: "rooms",
        label: "Rooms",
        fields: [{ type: "number", name: "size", label: "Tamaño" }],
      },
    ];
    const result = coerceEntryData(fields, {
      specs: { area: "120" },
      rooms: [{ size: "15" }, { size: "20" }],
    });
    expect(result.specs.area).toBe(120);
    expect(result.rooms[0].size).toBe(15);
    expect(result.rooms[1].size).toBe(20);
  });
});
