import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Transforms,
  Element as SlateElement,
  BaseEditor,
  Text,
} from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import isHotkey from "is-hotkey";
import styles from "./richTextEditor.module.css";

// ─── Custom Slate types ───────────────────────────────────────────────────────
type CustomElementType =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "block-quote"
  | "numbered-list"
  | "bulleted-list"
  | "list-item";

type AlignType = "left" | "center" | "right" | "justify";
type CustomTextKey = "bold" | "italic" | "underline" | "code";

interface CustomElement {
  type: CustomElementType;
  align?: AlignType;
  children: Descendant[];
}

interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// ─── Hotkeys ─────────────────────────────────────────────────────────────────
const HOTKEYS: Record<string, CustomTextKey> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES: CustomElementType[] = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES: AlignType[] = ["left", "center", "right", "justify"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toggleBlock = (editor: Editor, format: CustomElementType | AlignType) => {
  const isAlign = (TEXT_ALIGN_TYPES as string[]).includes(format);
  const isActive = isBlockActive(editor, format, isAlign ? "align" : "type");
  const isList = (LIST_TYPES as string[]).includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (LIST_TYPES as string[]).includes(n.type) &&
      !(TEXT_ALIGN_TYPES as string[]).includes(format),
    split: true,
  });

  const newProps: Partial<CustomElement> = isAlign
    ? { align: isActive ? undefined : (format as AlignType) }
    : {
        type: isActive
          ? "paragraph"
          : isList
          ? "list-item"
          : (format as CustomElementType),
      };

  Transforms.setNodes<CustomElement>(editor, newProps);

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: format as CustomElementType,
      children: [],
    });
  }
};

const toggleMark = (editor: Editor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: Editor,
  format: string,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (blockType === "align"
          ? (n as CustomElement).align === format
          : (n as CustomElement).type === format),
    })
  );
  return !!match;
};

const isMarkActive = (editor: Editor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// ─── ToolbarButton ────────────────────────────────────────────────────────────
const ToolbarButton = ({
  format,
  icon,
  isMark = false,
}: {
  format: CustomElementType | AlignType | CustomTextKey;
  icon: string;
  isMark?: boolean;
}) => {
  const editor = useSlate();
  const isActive = isMark
    ? isMarkActive(editor, format as CustomTextKey)
    : isBlockActive(
        editor,
        format,
        (TEXT_ALIGN_TYPES as string[]).includes(format) ? "align" : "type"
      );

  return (
    <button
      type="button"
      className={`${styles.toolbarButton} ${isActive ? styles.toolbarButtonActive : ""}`}
      onMouseDown={(e) => {
        e.preventDefault();
        if (isMark) {
          toggleMark(editor, format as CustomTextKey);
        } else {
          toggleBlock(editor, format as CustomElementType | AlignType);
        }
      }}
    >
      {icon}
    </button>
  );
};

// ─── Element & Leaf ──────────────────────────────────────────────────────────
const Element = ({ attributes, children, element }: any) => {
  const style: React.CSSProperties = element.align
    ? { textAlign: element.align }
    : {};
  switch (element.type) {
    case "heading-one":
      return <h1 style={style} {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 style={style} {...attributes}>{children}</h2>;
    case "block-quote":
      return <blockquote style={style} {...attributes}>{children}</blockquote>;
    case "numbered-list":
      return <ol style={style} {...attributes}>{children}</ol>;
    case "bulleted-list":
      return <ul style={style} {...attributes}>{children}</ul>;
    case "list-item":
      return <li style={style} {...attributes}>{children}</li>;
    default:
      return <p style={style} {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.code) children = <code>{children}</code>;
  return <span {...attributes}>{children}</span>;
};

// ─── Main component ──────────────────────────────────────────────────────────
interface RichTextEditorProps {
  value?: Descendant[];
  onChange: (value: Descendant[]) => void;
  name?: string;
}

const DEFAULT_VALUE: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  name,
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const initialValue =
    Array.isArray(value) && value.length > 0 ? value : DEFAULT_VALUE;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        toggleMark(editor, HOTKEYS[hotkey]);
      }
    }
  };

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onValueChange={onChange}
    >
      <div className={styles.wrapper}>
        <div className={styles.toolbar}>
          <ToolbarButton format="bold" icon="B" isMark />
          <ToolbarButton format="italic" icon="I" isMark />
          <ToolbarButton format="underline" icon="U" isMark />
          <ToolbarButton format="code" icon="</>" isMark />
          <ToolbarButton format="heading-one" icon="H1" />
          <ToolbarButton format="heading-two" icon="H2" />
          <ToolbarButton format="block-quote" icon="❝" />
          <ToolbarButton format="numbered-list" icon="1." />
          <ToolbarButton format="bulleted-list" icon="•" />
          <ToolbarButton format="left" icon="←" />
          <ToolbarButton format="center" icon="↔" />
          <ToolbarButton format="right" icon="→" />
          <ToolbarButton format="justify" icon="⇔" />
        </div>
        <Editable
          className={styles.editable}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Escribe tu contenido aquí..."
          spellCheck
          autoFocus
          onKeyDown={handleKeyDown}
        />
        {name && (
          <input type="hidden" name={name} value={JSON.stringify(value)} readOnly />
        )}
      </div>
    </Slate>
  );
};

export default RichTextEditor;
