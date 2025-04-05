export interface JobChange {
  id: string;
  leadId: string;
  previousCompany: string;
  previousTitle: string;
  newCompany: string;
  newTitle: string;
  changeDate: string;
  source: "LinkedIn" | "Manual";
  status: "Pending" | "Verified" | "False Positive";
}

export type LeadStatus = string;
export type LeadCategory = string;
export type LeadIndustry = string;
export type LeadSource = string;
export type LeadTimeline = string;

export interface Lead {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  status: LeadStatus;
  category?: LeadCategory;
  industry?: LeadIndustry;
  source?: LeadSource;
  score?: number;
  notes?: string;
  nextFollowUp?: string;
  lastContact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadConfiguration {
  statuses: LeadStatus[];
  categories: LeadCategory[];
  industries: LeadIndustry[];
  sources: LeadSource[];
  timelines: LeadTimeline[];
}
