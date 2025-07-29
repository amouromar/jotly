import React from "react";
import { Sidebar } from "./ui/Sidebar";
import { NoteList } from "./ui/NoteList";
import { NoteEditor } from "./ui/NoteEditor";
import { NotesProvider } from "./context/NotesContext";

export default function NotesPage() {
  return (
    <NotesProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Message - Only shows on small screens */}
        <div className="md:hidden flex flex-col items-center justify-center w-full p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Desktop Experience Required</h2>
          <p className="text-gray-600 mb-4">Please use a desktop or laptop computer for the best experience.</p>
          <p className="text-sm text-gray-500">This application is not optimized for mobile devices.</p>
        </div>

        {/* Main Content - Hidden on small screens */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

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
