"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";

export type Note = {
  id: string;
  title: string;
  preview: string;
  content: string;
  updatedAt: string;
  isPinned: boolean;
  isFavorite?: boolean;
  isDraft?: boolean;
  isTrash?: boolean;
};

type CreateNoteData = {
  title: string;
  content?: string;
};

type NotesContextType = {
  activeItem: string | null;
  setActiveItem: (id: string) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  notes: Note[];
  createNote: (data: CreateNoteData) => Promise<Note>;
  updateNote: (updatedNote: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNote: (id: string) => Note | undefined;
  exportNotes: () => void;
  importNotes: (file: File) => Promise<void>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>(() => {
    // Load notes from localStorage on initial render
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem("jotly-notes");
      return savedNotes ? JSON.parse(savedNotes) : [];
    }
    return [];
  });

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jotly-notes", JSON.stringify(notes));
    }
  }, [notes]);

  // Create a new note
  const createNote = useCallback(
    async (data: CreateNoteData): Promise<Note> => {
      const newNote: Note = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content || "",
        preview: data.content?.substring(0, 100) || "",
        updatedAt: "Just now",
        isPinned: false,
        isFavorite: false,
        isDraft: true,
        isTrash: false,
      };

      setNotes((prevNotes) => {
        const updatedNotes = [...prevNotes, newNote];
        return updatedNotes;
      });

      setSelectedNote(newNote);
      setActiveItem("drafts"); // Set to 'drafts' since new notes are drafts by default

      return newNote;
    },
    [],
  );

  // Update an existing note
  const updateNote = useCallback(
    async (updatedNote: Note): Promise<void> => {
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.map((note) => {
          if (note.id === updatedNote.id) {
            // Create a new object with all existing properties and the updated ones
            return {
              ...note, // Keep all existing properties
              ...updatedNote, // Apply updates
              // Ensure we have a proper preview by stripping HTML tags
              preview: updatedNote.content
                ? updatedNote.content.replace(/<[^>]*>/g, "").substring(0, 100)
                : note.preview,
              // Ensure these boolean flags are always defined
              isFavorite: updatedNote.isFavorite ?? note.isFavorite ?? false,
              isTrash: updatedNote.isTrash ?? note.isTrash ?? false,
              isDraft: updatedNote.isDraft ?? note.isDraft ?? false,
              isPinned: updatedNote.isPinned ?? note.isPinned ?? false,
              // Always update the updatedAt timestamp
              updatedAt: (() => {
                const now = new Date();
                const mins = (Date.now() - now.getTime()) / 60000;
                return mins < 1
                  ? "Just now"
                  : mins < 60
                    ? `${Math.round(mins)} min ago`
                    : mins < 1440
                      ? `${Math.round(mins / 60)} hr ago`
                      : mins < 10080
                        ? Math.round(mins / 1440) === 1
                          ? "Yesterday"
                          : `${Math.round(mins / 1440)} days ago`
                        : `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
              })(),
            };
          }
          return note;
        });
        return updatedNotes;
      });

      if (selectedNote?.id === updatedNote.id) {
        setSelectedNote(updatedNote);
      }
    },
    [selectedNote],
  );

  // Delete a note
  const deleteNote = useCallback(
    async (id: string): Promise<void> => {
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.filter((note) => note.id !== id);
        return updatedNotes;
      });

      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setActiveItem(null);
      }
    },
    [selectedNote],
  );

  // Get a single note by ID
  const getNote = useCallback(
    (id: string): Note | undefined => {
      return notes.find((note) => note.id === id);
    },
    [notes],
  );

  // Export notes to a JSON file
  const exportNotes = useCallback(() => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notes: notes,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jotly-notes-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [notes]);

  // Import notes from a JSON file
  const importNotes = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result !== "string") {
            throw new Error("Invalid file content");
          }

          const data = JSON.parse(result);

          // Validate the imported data
          if (!Array.isArray(data.notes)) {
            throw new Error("Invalid notes format");
          }

          // Add imported notes to existing ones
          setNotes((prevNotes) => {
            // Create a map to avoid duplicates
            const notesMap = new Map(prevNotes.map((note) => [note.id, note]));

            // Add or update notes from import
            data.notes.forEach((importedNote: Note) => {
              // You might want to add more validation here
              if (importedNote.id && importedNote.title) {
                notesMap.set(importedNote.id, {
                  ...importedNote,
                  // Ensure required fields have defaults if missing
                  preview:
                    importedNote.preview ||
                    (importedNote.content
                      ? importedNote.content
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 100)
                      : ""),
                  updatedAt: importedNote.updatedAt || "Imported",
                  isPinned: importedNote.isPinned || false,
                  isFavorite: importedNote.isFavorite || false,
                  isDraft: importedNote.isDraft || false,
                  isTrash: importedNote.isTrash || false,
                });
              }
            });

            return Array.from(notesMap.values());
          });

          resolve();
        } catch (error) {
          console.error("Error importing notes:", error);
          reject(
            error instanceof Error
              ? error
              : new Error("Failed to import notes"),
          );
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  }, []);

  return (
    <NotesContext.Provider
      value={{
        activeItem,
        setActiveItem,
        selectedNote,
        setSelectedNote,
        notes,
        createNote,
        updateNote,
        deleteNote,
        getNote,
        exportNotes,
        importNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
