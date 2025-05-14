import React, { useCallback, useMemo } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';

// Define custom types for Slate elements and text
type CustomElementType = 'paragraph' | 'heading-one' | 'heading-two' | 'block-quote' | 'numbered-list' | 'bulleted-list' | 'list-item';
type AlignType = 'left' | 'center' | 'right' | 'justify';
type CustomTextKey = 'bold' | 'italic' | 'underline' | 'code';

interface CustomElement extends SlateElement {
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

type CustomEditor = Editor;

// Hotkeys for text formatting
const HOTKEYS: Record<string, CustomTextKey> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

// Toolbar button component
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
        format as CustomElementType | AlignType,
        TEXT_ALIGN_TYPES.includes(format as AlignType) ? 'align' : 'type'
      );

  return (
    <button
      type="button"
      style={{
        padding: '8px',
        border: 'none',
        background: isActive ? '#ddd' : 'transparent',
        cursor: 'pointer',
      }}
      onMouseDown={(event) => {
        event.preventDefault();
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

// Slate.js editor component
interface RichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  name?: string; // Para el nombre del campo en el formulario
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, name }) => {
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <div
        style={{
          border: '1px solid #ddd',
          padding: '8px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid #ddd',
            paddingBottom: '8px',
            marginBottom: '8px',
          }}
        >
          <ToolbarButton format="bold" icon="B" isMark />
          <ToolbarButton format="italic" icon="I" isMark />
          <ToolbarButton format="underline" icon="U" isMark />
          <ToolbarButton format="code" icon="</>" isMark />
          <ToolbarButton format="heading-one" icon="H1" />
          <ToolbarButton format="heading-two" icon="H2" />
          <ToolbarButton format="block-quote" icon="“”" />
          <ToolbarButton format="numbered-list" icon="1." />
          <ToolbarButton format="bulleted-list" icon="•" />
          <ToolbarButton format="left" icon="←" />
          <ToolbarButton format="center" icon="↔" />
          <ToolbarButton format="right" icon="→" />
          <ToolbarButton format="justify" icon="⇔" />
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Escribe tu contenido aquí..."
          spellCheck
          autoFocus
          onKeyDown={handleKeyDown}
          style={{
            minHeight: '150px',
            padding: '8px',
          }}
        />
        {/* Campo oculto para enviar el valor como JSON */}
        {name && (
          <input type="hidden" name={name} value={JSON.stringify(value)} />
        )}
      </div>
    </Slate>
  );
};

// Element rendering
const Element = ({ attributes, children, element }: any) => {
  const style: React.CSSProperties = element.align ? { textAlign: element.align } : {};
  switch (element.type) {
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

// Leaf rendering
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.code) children = <code>{children}</code>;
  return <span {...attributes}>{children}</span>;
};

// Helper functions for toggling blocks and marks
const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const;
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const;

const toggleBlock = (editor: CustomEditor, format: CustomElementType | AlignType) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format as any);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as any) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  const newProperties: Partial<SlateElement> = TEXT_ALIGN_TYPES.includes(format)
    ? { align: isActive ? undefined : format }
    : { type: isActive ? 'paragraph' : isList ? 'list-item' : format };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: CustomEditor, format: string, blockType: 'type' | 'align' = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (blockType === 'align' ? (n as any).align === format : n.type === format),
    })
  );

  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export default RichTextEditor;