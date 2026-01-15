import { Program } from "@/types/management/program"; // Import Program type if available

export interface StrategicInitiative {
  id: number;
  program_id: number;
  reference: string;
  ref_number: number;
  perspective: string;
  problem: string;
  strategy: string;
  action_plan: string;
  budget_type: "opex" | "capex" | string;
  budget: number;
  realization: number;
  progress: number;
  budget_realization: number;
  created_at: string;
  updated_at: string;
  document?: string;
  program?: Program;
}

export interface CreateStrategicInitiativePayload {
  program_id: number | string;
  perspective: string;
  problem: string;
  strategy: string;
  action_plan: string;
  budget_type: string;
  budget: number;
  document?: File | string;
}