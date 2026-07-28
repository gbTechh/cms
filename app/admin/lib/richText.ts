// Extrae el texto plano de un árbol de nodos de Slate (usado por RichTextEditor),
// para previsualizarlo en tablas o validar si el contenido está vacío.
export function slateToPlainText(nodes: unknown): string {
  if (!Array.isArray(nodes)) return "";
  return nodes
    .map((node: any) => {
      if (typeof node?.text === "string") return node.text;
      if (Array.isArray(node?.children)) return slateToPlainText(node.children);
      return "";
    })
    .join(" ")
    .trim();
}
