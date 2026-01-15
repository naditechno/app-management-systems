import { Devision } from "@/types/management/devision"; // Import interface Division jika sudah ada

export interface Program {
  id: number;
  division_id: number;
  reference: string;
  ref_number: number;
  objective: string;
  strategy_number: string;
  action_plan: string;
  strategy: string;
  start_date: string;
  end_date: string;
  description: string;
  progress: number;
  budget_realization: number;
  status: number;
  created_at: string;
  updated_at: string;
  document?: string; // Optional field (ada di get by id)

  // Relasi (Optional karena mungkin tidak selalu ada di semua response)
  division?: Devision;
}

// Payload untuk Create/Update (Sesuaikan dengan field yang bisa diinput user)
export interface CreateProgramPayload {
  division_id: number | string;
  objective: string;
  strategy_number: string;
  action_plan: string;
  strategy: string;
  start_date: string; // Format YYYY-MM-DD
  end_date: string; // Format YYYY-MM-DD
  description: string;
  status?: number;
  document?: File | string; // Jika ada upload file
}