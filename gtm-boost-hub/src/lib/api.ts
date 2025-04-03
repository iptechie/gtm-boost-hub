import type { Lead } from "@/components/LeadTable";

// --- Define Types ---
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color?: string;
}

// Define Activity Log Type
export interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO 8601 format string
  type: "Call" | "Email" | "Note" | "Meeting" | "StageChange";
  details: string;
  userId?: string; // Optional: ID of the user who performed the action
}

// Helper function for fetching data and handling errors
async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    // Attempt to read error body for more context
    let errorBody = "";
    try {
      errorBody = await response.text();
    } catch (e) {
      // Ignore if reading body fails
    }
    throw new Error(
      `HTTP error! status: ${response.status}${
        errorBody ? `, body: ${errorBody}` : ""
      }`
    );
  }
  // Handle 204 No Content specifically for DELETE requests
  if (response.status === 204) {
    return undefined as T; // Or handle as appropriate for the calling function
  }
  return response.json() as Promise<T>;
}

// --- API Fetching Functions ---

// Fetch Leads
export const fetchLeads = (): Promise<Lead[]> => {
  return fetchData<Lead[]>("/api/leads");
};

// --- Pipeline Stage API Functions ---

// Fetch Pipeline Stages
export const fetchPipelineStages = (): Promise<PipelineStage[]> => {
  return fetchData<PipelineStage[]>("/api/pipeline-stages");
};

// Add Pipeline Stage
export const addPipelineStage = (stageData: {
  name: string;
  color?: string;
}): Promise<PipelineStage> => {
  return fetchData<PipelineStage>("/api/pipeline-stages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stageData),
  });
};

// Update Pipeline Stage (Name/Color)
export const updatePipelineStage = (
  id: string,
  stageData: { name?: string; color?: string }
): Promise<PipelineStage> => {
  return fetchData<PipelineStage>(`/api/pipeline-stages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stageData),
  });
};

// Update Pipeline Stage Order (Batch)
export const updatePipelineStageOrder = (
  updates: { id: string; order: number }[]
): Promise<PipelineStage[]> => {
  return fetchData<PipelineStage[]>("/api/pipeline-stages", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

// Delete Pipeline Stage
export const deletePipelineStage = (id: string): Promise<void> => {
  // fetchData handles the 204 No Content response correctly now
  return fetchData<void>(`/api/pipeline-stages/${id}`, {
    method: "DELETE",
  });
};

// --- Other API Functions ---

// Fetch Lead Statistics (for LeadsPage)
// Define a type for the expected stats structure
interface LeadStats {
  total: number;
  growth: string;
  new: { count: number; growth: string };
  qualified: { count: number; growth: string };
  opportunities: { count: number; growth: string };
}
export const fetchLeadStats = (): Promise<LeadStats> => {
  return fetchData<LeadStats>("/api/stats/leads");
};

// Fetch Dashboard Statistics
// Define a type for the expected dashboard stats structure
interface DashboardStatValue {
  value: number | string;
  change: { value: string; positive: boolean };
}
interface DashboardStats {
  totalLeads: DashboardStatValue;
  conversionRate: DashboardStatValue;
  meetingsBooked: DashboardStatValue;
  dealsClosed: DashboardStatValue;
}
export const fetchDashboardStats = (): Promise<DashboardStats> => {
  return fetchData<DashboardStats>("/api/stats/dashboard");
};

// Fetch Subscription Information
// Define a type for the expected subscription info structure
type PlanType = "Free" | "Starter" | "Growth" | "Pro";
interface SubscriptionInfo {
  plan: PlanType;
  daysRemaining: number;
  usedLeads: number;
  maxLeads: number;
}
export const fetchSubscriptionInfo = (): Promise<SubscriptionInfo> => {
  return fetchData<SubscriptionInfo>("/api/subscription");
};

// Add more fetching functions as needed (e.g., for POST, PUT, DELETE)

// Add Lead
export const addLead = async (newLeadData: Omit<Lead, "id">): Promise<Lead> => {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newLeadData),
  });
  if (!response.ok) {
    // Consider more specific error handling based on status code
    const errorBody = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorBody}`
    );
  }
  return response.json() as Promise<Lead>;
};

// Import Leads
export interface ImportResult {
  // Added export keyword
  importedCount: number;
  skippedCount: number;
}

export const importLeads = async (
  leadsToImport: Omit<Lead, "id">[]
): Promise<ImportResult> => {
  const response = await fetch("/api/leads/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leadsToImport),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorBody}`
    );
  }
  return response.json() as Promise<ImportResult>;
};

// Update Lead
export const updateLead = async (
  leadData: Partial<Lead> & { id: string }
): Promise<Lead> => {
  const { id, ...updateData } = leadData;
  // Use the enhanced fetchData helper
  return fetchData<Lead>(`/api/leads/${id}`, {
    method: "PUT", // Changed to PUT as per mock handler
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
};

// Delete Lead
export const deleteLead = (leadId: string): Promise<void> => {
  // Use the enhanced fetchData helper which handles 204 No Content
  return fetchData<void>(`/api/leads/${leadId}`, {
    method: "DELETE",
  });
};

// Fetch Lead Activity
export const fetchLeadActivity = (
  leadId: string
): Promise<ActivityLogEntry[]> => {
  return fetchData<ActivityLogEntry[]>(`/api/leads/${leadId}/activity`);
};

// Add Lead Activity
export const addLeadActivity = (
  leadId: string,
  activityData: { type: ActivityLogEntry["type"]; details: string }
): Promise<ActivityLogEntry> => {
  return fetchData<ActivityLogEntry>(`/api/leads/${leadId}/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activityData),
  });
};

// --- Lead Scoring Configuration ---

// Define types based on handlers.ts
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

// Fetch Scoring Configuration
export const fetchScoringConfig = (): Promise<ScoringConfig> => {
  return fetchData<ScoringConfig>("/api/scoring-config");
};

// Update Scoring Configuration
export const updateScoringConfig = (
  config: ScoringConfig
): Promise<ScoringConfig> => {
  return fetchData<ScoringConfig>("/api/scoring-config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
};
