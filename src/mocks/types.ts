import type { Lead } from "@/components/LeadTable";

// --- Define Activity Log Type ---
export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: "Call" | "Email" | "Note" | "Meeting" | "StageChange";
  details: string;
  userId?: string;
}

// --- Scoring Configuration Types ---
export interface ScoringRule {
  id: string;
  condition: "equals" | "contains" | "isOneOf" | "isNotEmpty";
  value: string | string[];
  points: number;
}

export type ScorableLeadField =
  | "category"
  | "location"
  | "designation"
  | "status"
  | "industry";

export interface ScoringFieldConfig {
  fieldName: ScorableLeadField;
  label: string;
  isActive: boolean;
  weight: number;
  rules: ScoringRule[];
}

export interface ScoringConfig {
  fields: ScoringFieldConfig[];
}

// --- Mock Data Types ---
export interface DashboardStats {
  totalLeads: { value: number; change: { value: string; positive: boolean } };
  conversionRate: {
    value: string;
    change: { value: string; positive: boolean };
  };
  meetingsBooked: {
    value: number;
    change: { value: string; positive: boolean };
  };
  dealsClosed: { value: number; change: { value: string; positive: boolean } };
}

export interface SubscriptionInfo {
  plan: string;
  daysRemaining: number;
  usedLeads: number;
  maxLeads: number;
}

// --- Mock State Types ---
export interface MockState {
  leads: Lead[];
  pipelineStages: PipelineStage[];
  leadActivity: Map<string, ActivityLogEntry[]>;
  scoringConfig: ScoringConfig;
}
