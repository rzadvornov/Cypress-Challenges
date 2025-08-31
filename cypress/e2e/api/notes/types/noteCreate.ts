export interface NoteCreate {
  title: string;
  description: string;
  category: "Home" | "Work" | "Personal";
  completed?: boolean; // Optional, as the server might default it to false.
}
