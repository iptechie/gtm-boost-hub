export type MailActivityStatus =
  | "Completed"
  | "In Progress"
  | "Planned"
  | "Draft";
export type ViewType = "list" | "calendar" | "compose";

export interface MailActivity {
  id: string;
  name: string;
  type: string;
  date: string;
  assignedUser: string;
  status: MailActivityStatus;
  description: string;
  targetAudience?: string;
  template?: string;
  content?: string;
  metrics?: {
    openRate?: number;
    clickRate?: number;
    conversionRate?: number;
  };
}

export interface GTMStrategyItem {
  id: string;
  title: string;
  type: string;
  status: "Completed" | "In Progress" | "Not Started";
  description: string;
  dueDate: string;
  assignedTo: string;
  progress: number;
  notes?: string;
  template?: string;
  metrics?: {
    marketSize?: number;
    growthRate?: number;
  };
}

export interface GTMStrategy {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Draft" | "Archived";
  items: GTMStrategyItem[];
  createdAt: string;
  updatedAt: string;
}
