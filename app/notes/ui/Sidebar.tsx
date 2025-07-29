"use client";

import { FileText, Star, Trash2, Plus, Upload, Download } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import Link from "next/link";
import { useRef } from "react";

export function Sidebar() {
  const { setActiveItem, createNote, exportNotes, importNotes } = useNotes();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNote = async () => {
    try {
      await createNote({
        title: "Untitled Note",
        content: "",
      });
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importNotes(file);
      // Reset the input so the same file can be imported again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      alert("Notes imported successfully!");
    } catch (error) {
      console.error("Import failed:", error);
      alert(
        `Failed to import notes: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <div className="w-64 h-full border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/">
          <h2 className="text-[#ff7d52] text-4xl font-bold">Jotly</h2>
        </Link>
      </div>
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={handleCreateNote}
          className="w-full flex items-center justify-center space-x-2 bg-[#ff7d52] text-white px-4 py-2 rounded-md hover:bg-[#d3603a]/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <button
            onClick={() => setActiveItem("all")}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-700"
          >
            <FileText className="h-4 w-4" />
            <span>All Notes</span>
          </button>
          <button
            onClick={() => setActiveItem("favorites")}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-700"
          >
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </button>
          <button
            onClick={() => setActiveItem("trash")}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-700"
          >
            <Trash2 className="h-4 w-4" />
            <span>Trash</span>
          </button>
        </div>

        {/* Import/Export Section */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Data Management
          </p>
          <div className="space-y-1">
            <button
              onClick={exportNotes}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-700"
            >
              <Download className="h-4 w-4" />
              <span>Export Notes</span>
            </button>
            <button
              onClick={handleImportClick}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-700"
            >
              <Upload className="h-4 w-4" />
              <span>Import Notes</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
