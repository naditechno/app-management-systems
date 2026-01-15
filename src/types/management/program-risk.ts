import { Program } from "@/types/management/program"; // Import interface Program parent

export interface ProgramRisk {
  id: number;
  program_id: number;
  title: string;
  description: string;
  identified_at: string; // Format: YYYY-MM-DD
  likelihood: "Low" | "Medium" | "High"; // Asumsi enum berdasarkan data
  impact: "Minor" | "Moderate" | "Major" | "Critical"; // Asumsi enum
  score: number;
  status: boolean | number; // 1/true = Active, 0/false = Resolved
  created_at: string;
  updated_at: string;

  // Relations
  program?: Program;
}

// Payload untuk Create/Update
export interface CreateProgramRiskPayload {
  program_id: number | string;
  title: string;
  description: string;
  identified_at: string;
  likelihood: string;
  impact: string;
  score: number;
  status: boolean | number | string;
}
