import { Program } from "@/types/management/program"; // Import interface Program
import { Devision } from "@/types/management/devision"; // Import interface Division

export interface ProgramIssue {
  id: number;
  program_id: number;
  division_id: number;
  title: string;
  description: string;
  identified_at: string; // Format: YYYY-MM-DD
  resolved_at: string | null; // Nullable
  due_date: string; // Format: YYYY-MM-DD
  status: number; // 0 = Open, 1 = Resolved, dll (sesuai logika backend)
  created_at: string;
  updated_at: string;

  // Relations (Optional, muncul di get all)
  program?: Program;
  division?: Devision;
}

// Payload untuk Create/Update
export interface CreateProgramIssuePayload {
  program_id: number | string;
  division_id: number | string;
  title: string;
  description: string;
  identified_at: string;
  due_date: string;
  resolved_at?: string | null;
  status?: number | string;
}