"use client";

import { useState, useEffect } from "react";
import { useNotes, type Note } from "../context/NotesContext";
import { NoteFolderContextMenu } from "./ContextMenu";

// Mock folders for the move to folder menu
const mockFolders = [
  { id: "work", name: "Work" },
  { id: "personal", name: "Personal" },
  { id: "ideas", name: "Ideas" },
];

export function NoteList() {
  const {
    activeItem,
    selectedNote,
    setSelectedNote,
    notes,
    updateNote,
    deleteNote,
  } = useNotes();
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    if (!activeItem || activeItem === "all") {
      setFilteredNotes(notes.filter((note) => !note.isTrash));
    } else if (activeItem === "favorites") {
      setFilteredNotes(
        notes.filter((note) => note.isFavorite && !note.isTrash),
      );
    } else if (activeItem === "drafts") {
      setFilteredNotes(notes.filter((note) => note.isDraft && !note.isTrash));
    } else if (activeItem === "trash") {
      setFilteredNotes(notes.filter((note) => note.isTrash));
    } else {
      // Handle folder filtering if needed
      setFilteredNotes(notes.filter((note) => !note.isTrash));
    }
  }, [activeItem, notes]);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const handleRenameNote = async (noteId: string, newTitle: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      await updateNote({
        ...note,
        title: newTitle,
      });
    }
    setEditingNoteId(null);
  };

  const handleToggleFavorite = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      await updateNote({
        ...note,
        isFavorite: !note.isFavorite,
      });
    }
  };

  const handleEmptyTrash = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete all notes in the trash? This action cannot be undone.",
      )
    ) {
      const trashNotes = notes.filter((note) => note.isTrash);
      for (const note of trashNotes) {
        await deleteNote(note.id);
      }
    }
  };

  const handleRestoreNote = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      await updateNote({
        ...note,
        isTrash: false,
        isDraft: true, // Optionally mark as draft when restoring
      });
    }
  };

  const handleTrashOrDelete = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    if (activeItem === "trash") {
      // Delete permanently if in trash view
      if (
        window.confirm(
          "Are you sure you want to permanently delete this note? This action cannot be undone.",
        )
      ) {
        await deleteNote(noteId);
      }
    } else {
      // Move to trash if not in trash view
      await updateNote({
        ...note,
        isTrash: true,
      });
    }
  };

  const handleMoveToDrafts = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      await updateNote({
        ...note,
        isDraft: true,
        isTrash: false,
      });
    }
  };

  const startEditing = (note: Note, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNoteId(note.id);
    setEditedTitle(note.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent, noteId: string) => {
    if (e.key === "Enter") {
      handleRenameNote(noteId, editedTitle);
    } else if (e.key === "Escape") {
      setEditingNoteId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          {activeItem === "all"
            ? "All Notes"
            : activeItem === "favorites"
              ? "Favorites"
              : activeItem === "drafts"
                ? "Drafts"
                : activeItem === "trash"
                  ? "Trash"
                  : "Folder Notes"}
        </h2>
        {activeItem === "trash" && filteredNotes.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
          >
            Empty Trash
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {filteredNotes.map((note) => (
              <NoteFolderContextMenu
                key={note.id}
                type="note"
                id={note.id}
                name={note.title}
                onRename={() => setEditingNoteId(note.id)}
                onFavorite={() => handleToggleFavorite(note.id)}
                onMoveToTrash={() => handleTrashOrDelete(note.id)}
                onMoveToDrafts={() => handleMoveToDrafts(note.id)}
                folders={mockFolders}
                isFavorite={note.isFavorite}
                isDraft={note.isDraft}
                isInTrash={note.isTrash}
              >
                <li
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedNote?.id === note.id ? "bg-blue-50" : ""}`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flex items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {editingNoteId === note.id ? (
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, note.id)}
                              onBlur={() =>
                                handleRenameNote(note.id, editedTitle)
                              }
                              className="w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <h3
                              className="text-sm font-medium text-gray-900 truncate"
                              onDoubleClick={(e) => startEditing(note, e)}
                            >
                              {note.title}
                            </h3>
                          )}
                          {note.isPinned && (
                            <span className="ml-2 text-yellow-500">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                        {note.isTrash && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreNote(note.id);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {note.preview}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {note.updatedAt}
                      </p>
                    </div>
                  </div>
                </li>
              </NoteFolderContextMenu>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-gray-500">No notes found</p>
            <p className="text-sm text-gray-400 mt-1">
              {activeItem === "favorites"
                ? "No favorite notes yet"
                : activeItem === "drafts"
                  ? "No drafts yet"
                  : activeItem === "trash"
                    ? "Trash is empty"
                    : "Create a new note to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
