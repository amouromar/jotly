import React from "react";
import { Sidebar } from "./ui/Sidebar";
import { NoteList } from "./ui/NoteList";
import { NoteEditor } from "./ui/NoteEditor";
import { NotesProvider } from "./context/NotesContext";

export default function NotesPage() {
  return (
    <NotesProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Two-column layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Note List */}
            <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
              <NoteList />
            </aside>

            {/* Note Editor */}
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <NoteEditor />
            </main>
          </div>
        </div>
      </div>
    </NotesProvider>
  );
}
