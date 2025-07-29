"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NoteListProps {
  initialNotes: Note[];
}

export default function NoteList({ initialNotes }: NoteListProps) {
  if (initialNotes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500">No notes yet</h3>
        <p className="mt-2 text-sm text-gray-400">
          Get started by creating a new note.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {initialNotes.map((note) => (
        <div
          key={note.id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg truncate">{note.title}</h3>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/notes/${note.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {note.content}
          </p>
          <p className="text-xs text-gray-400">
            Updated {format(new Date(note.updated_at), "MMM d, yyyy")}
          </p>
        </div>
      ))}
    </div>
  );
}
