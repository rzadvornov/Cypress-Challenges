export interface Note {
  user_id?: string;
  category?: "Home" | "Work" | "Personal";
  data: any;
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  completed: boolean;
}
