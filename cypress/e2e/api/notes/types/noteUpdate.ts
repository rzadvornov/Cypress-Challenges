export interface NoteUpdate {
  title?: string;
  description?: string;
  category?: "Home" | "Work" | "Personal";
  completed?: boolean;
}
