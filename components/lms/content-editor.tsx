"use client";
import { useEffect, useId, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import { TableKit } from "@tiptap/extension-table";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { AssistantMessage } from "./assistant-message";

export function ContentEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const labelId = useId();
  const [preview, setPreview] = useState(false);
  const lastEmitted = useRef(value);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false }, underline: false }),
      TableKit,
      TaskList,
      TaskItem,
      Markdown,
    ],
    content: value,
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelId,
        class: "lms-rich-content",
      },
    },
    onUpdate: ({ editor }) => {
      const next = editor.getMarkdown();
      lastEmitted.current = next;
      onChange(next);
    },
  });
  useEffect(() => {
    if (editor && value !== lastEmitted.current) {
      editor.commands.setContent(value, {
        contentType: "markdown",
        emitUpdate: false,
      });
      lastEmitted.current = value;
    }
  }, [editor, value]);
  return (
    <div className="lms-content-editor">
      <div className="lms-row between">
        <span id={labelId} className="font-semibold">
          {label}
        </span>
        <button
          type="button"
          className="text-sm text-brand"
          onClick={() => setPreview(!preview)}
        >
          {preview ? "Continue editing" : "Learner preview"}
        </button>
      </div>
      <div className="lms-editor-frame">
        {!preview && (
          <div
            role="group"
            aria-label={`${label} formatting`}
            className="lms-editor-toolbar"
          >
            <button
              type="button"
              disabled={!editor}
              onClick={() => editor?.chain().focus().setParagraph().run()}
            >
              Text
            </button>
            <button
              type="button"
              disabled={!editor}
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              Heading
            </button>
            <button
              type="button"
              disabled={!editor}
              aria-label="Bold"
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              disabled={!editor}
              aria-label="Italic"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              Bullets
            </button>
            <button
              type="button"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              Numbered list
            </button>
            <button
              type="button"
              disabled={!editor}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              Quote
            </button>
            <button
              type="button"
              disabled={!editor}
              onClick={() => editor?.chain().focus().undo().run()}
            >
              Undo
            </button>
            <button
              type="button"
              disabled={!editor}
              onClick={() => editor?.chain().focus().redo().run()}
            >
              Redo
            </button>
          </div>
        )}
        {preview ? (
          <div className="p-5">
            <AssistantMessage text={value} />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {preview
          ? "This is how your content will read in the lesson."
          : "Write directly in the content. Use the toolbar to format it."}
      </p>
    </div>
  );
}
