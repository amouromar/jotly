"use client";

import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function QuillEditor({
  value,
  onChange,
  placeholder,
  className = "",
}: QuillEditorProps) {
  const [quill, setQuill] = useState<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize Quill
  useEffect(() => {
    if (!editorRef.current) return;

    // Clear the container
    while (editorRef.current.firstChild) {
      editorRef.current.removeChild(editorRef.current.firstChild);
    }

    const editor = document.createElement("div");
    editorRef.current.appendChild(editor);

    const q = new Quill(editor, {
      theme: "snow",
      placeholder,
      modules: {
        keyboard: {
          bindings: {
            // Remove default tab key binding that might affect formatting
            tab: {
              key: 9,
              handler: function () {
                // Just insert a tab character
                const range = q.getSelection();
                if (range) {
                  q.insertText(range.index, "\t");
                }
                return false;
              },
            },
            "remove format": {
              key: "Backspace",
              collapsed: true,
              format: [],
              // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
              handler: function (range: any, context: any) {
                // Allow normal backspace behavior
                return true;
              },
            },
          },
        },
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ header: [1, 2, 3, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: ["monospace"] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image", "video"],
        ],
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "list",
        "bullet",
        "script",
        "indent",
        "direction",
        "color",
        "background",
        "font",
        "align",
        "link",
        "image",
        "video",
      ],
    });

    // Set initial content
    if (value) {
      q.clipboard.dangerouslyPasteHTML(value);
    }

    // Handle content changes
    q.on("text-change", () => {
      const content = q.root.innerHTML;
      onChange(content);
    });

    setQuill(q);

    return () => {
      if (editorRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const editor = editorRef.current;
        while (editor.firstChild) {
          editor.removeChild(editor.firstChild);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder]);

  // Update content when value prop changes
  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value, quill, onChange, placeholder]);

  // Cleanup Quill instance
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const editor = editorRef.current;
        while (editor.firstChild) {
          editor.removeChild(editor.firstChild);
        }
      }
    };
  }, []);

  return (
    <div className={`quill-container ${className}`}>
      <style jsx global>{`
        .quill-container .ql-toolbar,
        .quill-container .ql-container,
        .quill-container .ql-editor {
          font-family: poppins !important;
        }
        .quill-container .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #e5e7eb;
        }
        .quill-container .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #e5e7eb;
          font-size: 1rem;
          min-height: 200px;
        }
      `}</style>
      <div ref={editorRef} className={`h-full ${poppins.variable}`} />
    </div>
  );
}
