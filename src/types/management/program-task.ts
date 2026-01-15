export interface ProgramTask {
  id: number;
  program_id: number;
  program_strategic_initiative_id: number;
  title: string;
  description: string;
  due_date: string;
  status: boolean | number; // Handle boolean (true/false) or number (1/0)
  created_at: string;
  updated_at: string;
  document?: string;

  // Relations (Optional, for display purposes if backend sends them)
  program_reference?: string;
  initiative_reference?: string;
}

export interface CreateProgramTaskPayload {
  program_id: number | string;
  program_strategic_initiative_id: number | string;
  title: string;
  description: string;
  due_date: string;
  status: boolean | number | string;
  document?: File | string;
}