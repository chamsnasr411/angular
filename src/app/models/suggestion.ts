export interface Suggestion {
  id: number;
    suggestion: string;   // ✅ obligatoire
  title: string;
  description: string;
  category: string;
  date: string;   // ✅ IMPORTANT : string et pas Date
  status: string;
  nbLikes: number;
}