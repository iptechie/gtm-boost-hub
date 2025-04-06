export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "multiselect"
  | "boolean"
  | "url"
  | "phone"
  | "email";

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select/multiselect fields
  defaultValue?: any;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface DashboardWidget {
  id: string;
  name: string;
  type:
    | "leadStats"
    | "conversionFunnel"
    | "revenueChart"
    | "activityTimeline"
    | "topLeads"
    | "customChart";
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: {
    [key: string]: any;
  };
  isActive: boolean;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
}

export interface LeadCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface IndustrySettings {
  scoringRules: Array<{
    field: string;
    operator: string;
    value: string[];
    score: number;
  }>;
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
}

export interface OrganizationConfig {
  customFields: CustomField[];
  dashboardLayouts: DashboardLayout[];
  pipelineStages: PipelineStage[];
  leadCategories: LeadCategory[];
  industrySpecificSettings: IndustrySettings;
}
