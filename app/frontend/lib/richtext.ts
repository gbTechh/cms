/** Extrae el texto plano de un valor richText (árbol de nodos Slate) — para
 * usarlo donde hace falta texto simple (ej. adentro de un <summary> de FAQ,
 * que no puede contener bloques). Para renderizar el richText completo con
 * formato, usar <RichText> de ~/frontend/ui en vez de esto. */
export const richTextToPlain = (value: unknown): string =>
  Array.isArray(value)
    ? value.map((block: any) => block.children?.map((c: any) => c.text).join("")).join(" ")
    : String(value ?? "");
