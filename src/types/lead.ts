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
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: string;
  website?: string;
  source?: string;
  status:
    | "New"
    | "Contacted"
    | "Qualified"
    | "Proposal"
    | "Negotiation"
    | "Closed";
  score: number;
  value?: number;
  createdAt: string;
  updatedAt: string;
  lastContact: string;
  notes?: string;
  tags?: string[];
  isStarred: boolean;
  interactions?: number;
}

export interface LeadConfiguration {
  statuses: LeadStatus[];
  categories: LeadCategory[];
  industries: LeadIndustry[];
  sources: LeadSource[];
  timelines: LeadTimeline[];
}
