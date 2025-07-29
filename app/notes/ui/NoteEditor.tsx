"use client";

import { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";

// Font setup
export const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(
  () => import("@/components/ui/quill-editor").then((mod) => mod.QuillEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
    ),
  },
);

export function NoteEditor() {
  const { selectedNote, updateNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState("Just now");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content || "");
    } else {
      setTitle("Select a note to edit");
      setContent("");
    }
  }, [selectedNote]);

  const updateLastSaved = useCallback(() => {
    const now = new Date();
    const mins = (Date.now() - now.getTime()) / 60000;
    setLastSaved(
      mins < 1
        ? "Just now"
        : mins < 60
          ? `${Math.round(mins)} min ago`
          : mins < 1440
            ? `${Math.round(mins / 60)} hr ago`
            : mins < 10080
              ? Math.round(mins / 1440) === 1
                ? "Yesterday"
                : `${Math.round(mins / 1440)} days ago`
              : `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`,
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedNote) return;

    try {
      setIsSaving(true);
      await updateNote({
        ...selectedNote,
        title,
        content,
        // Create a text-only preview by stripping HTML tags
        preview: content.replace(/<[^>]*>/g, "").substring(0, 100),
        updatedAt: new Date().toISOString(),
        // Ensure these boolean flags are always defined
        isFavorite: selectedNote.isFavorite || false,
        isTrash: selectedNote.isTrash || false,
        isDraft: selectedNote.isDraft || false,
        isPinned: selectedNote.isPinned || false,
      });
      updateLastSaved();
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  }, [selectedNote, title, content, updateNote, updateLastSaved]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // Auto-save after content changes (with debounce)
  useEffect(() => {
    if (!selectedNote) return;

    const timer = setTimeout(() => {
      if (title !== selectedNote.title || content !== selectedNote.content) {
        handleSave();
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [title, content, selectedNote, handleSave]);

  if (!selectedNote) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold mb-2">No Note Selected</h2>
          <p>
            Select a note from the list to view or edit its content, or create a
            new note to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex flex-row justify-between p-4">
          <input
            type="text"
            className="w-full text-2xl font-bold focus:outline-none"
            value={title}
            onChange={handleTitleChange}
            placeholder="Note Title"
          />
          <div className="flex justify-end items-center gap-4">
            <div className="flex flex-col text-xs text-gray-500 whitespace-nowrap">
              {isSaving ? "Saving..." : `Last saved: ${lastSaved}`}
            </div>
            <button
              className={`px-3 py-2 ${isSaving ? "bg-gray-400" : "bg-[#ff7d52] hover:bg-[#d3603a]/90"} text-white text-sm rounded-lg flex items-center`}
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className={`flex-1 overflow-hidden ${poppins.variable}`}>
        <QuillEditor
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your note here..."
          className="h-full flex flex-col"
        />
      </div>
    </div>
  );
}
