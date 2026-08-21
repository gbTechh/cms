import React from "react";
import { cn } from "./cn";

interface LeafNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}

interface ElementNode {
  type?: string;
  align?: "left" | "center" | "right" | "justify";
  children: SlateNode[];
}

type SlateNode = LeafNode | ElementNode;

const isLeaf = (node: SlateNode): node is LeafNode => typeof (node as LeafNode).text === "string";

function renderLeaf(node: LeafNode, key: React.Key): React.ReactNode {
  let content: React.ReactNode = node.text;
  if (node.code) content = <code>{content}</code>;
  if (node.underline) content = <u>{content}</u>;
  if (node.italic) content = <em>{content}</em>;
  if (node.bold) content = <strong>{content}</strong>;
  return <React.Fragment key={key}>{content}</React.Fragment>;
}

function renderElement(node: ElementNode, key: React.Key): React.ReactNode {
  const style = node.align ? { textAlign: node.align } : undefined;
  const children = node.children.map(renderNode);

  switch (node.type) {
    case "heading-one":
      return <h1 key={key} style={style}>{children}</h1>;
    case "heading-two":
      return <h2 key={key} style={style}>{children}</h2>;
    case "block-quote":
      return <blockquote key={key} style={style}>{children}</blockquote>;
    case "numbered-list":
      return <ol key={key} style={style}>{children}</ol>;
    case "bulleted-list":
      return <ul key={key} style={style}>{children}</ul>;
    case "list-item":
      return <li key={key} style={style}>{children}</li>;
    default:
      return <p key={key} style={style}>{children}</p>;
  }
}

function renderNode(node: SlateNode, key: React.Key): React.ReactNode {
  return isLeaf(node) ? renderLeaf(node, key) : renderElement(node, key);
}

export interface RichTextProps {
  value: unknown;
  className?: string;
}

/**
 * Renderiza el árbol de nodos de Slate (guardado por el editor del admin)
 * como HTML real, con la tipografía de `@tailwindcss/typography` (`prose`,
 * configurada con los tokens del tema en app/frontend/theme.css).
 */
export function RichText({ value, className }: RichTextProps) {
  if (!Array.isArray(value)) return null;
  return (
    <div className={cn("prose max-w-none text-[1.45rem] leading-relaxed", className)}>
      {value.map((node, i) => renderNode(node, i))}
    </div>
  );
}
