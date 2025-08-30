export interface Note {
  data: any;
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  completed: boolean;
}

export interface NoteCreate {
  title: string;
  description: string;
  completed?: boolean; // Optional, as the server might default it to false.
}

export interface NoteUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}
