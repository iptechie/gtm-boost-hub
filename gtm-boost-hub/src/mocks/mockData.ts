import type { Lead, JobChange } from "@/types/lead"; // Use the primary Lead type
import type {
  CustomField,
  DashboardLayout,
  LeadCategory,
  OrganizationConfig,
  IndustrySettings,
  PipelineStage,
} from "@/types/config";
import type {
  ActivityLogEntry,
  ScoringRule,
  ScorableLeadField,
  ScoringFieldConfig,
  ScoringConfig,
  DashboardStats,
  SubscriptionInfo,
  MockState,
} from "./types";
import type { MailActivity, GTMStrategy } from "@/types/strategy"; // Import from correct file

// --- Mock Data ---
const getInitialScoringConfig = (): ScoringConfig => {
  const storedConfig = sessionStorage.getItem("mockScoringConfig");
  if (storedConfig) {
    try {
      const parsed = JSON.parse(storedConfig);
      if (Array.isArray(parsed?.fields)) {
        return parsed;
      }
      console.warn("Stored scoring config is invalid, using default.");
    } catch (e) {
      console.error("Failed to parse stored scoring config, using default.", e);
    }
  }
  const defaultConfig: ScoringConfig = {
    fields: [
      {
        fieldName: "category",
        label: "Category",
        isActive: true,
        weight: 20,
        rules: [
          { id: "cat1", condition: "equals", value: "MNC", points: 10 },
          { id: "cat2", condition: "equals", value: "Regional", points: 7 },
          { id: "cat3", condition: "equals", value: "Local", points: 3 },
        ],
      },
      {
        fieldName: "location",
        label: "Location",
        isActive: true,
        weight: 15,
        rules: [
          { id: "loc1", condition: "contains", value: "New York", points: 10 },
          { id: "loc2", condition: "contains", value: "London", points: 10 },
          { id: "loc3", condition: "contains", value: "India", points: 5 },
        ],
      },
      {
        fieldName: "designation",
        label: "Job Title",
        isActive: true,
        weight: 30,
        rules: [
          { id: "des1", condition: "equals", value: "CEO", points: 15 },
          { id: "des2", condition: "equals", value: "CTO", points: 12 },
          { id: "des3", condition: "contains", value: "VP", points: 10 },
          { id: "des4", condition: "contains", value: "Director", points: 8 },
          { id: "des5", condition: "contains", value: "Manager", points: 5 },
        ],
      },
      {
        fieldName: "status",
        label: "Stage",
        isActive: true,
        weight: 15,
        rules: [
          { id: "sta1", condition: "equals", value: "Qualified", points: 10 },
          { id: "sta2", condition: "equals", value: "Contacted", points: 5 },
          { id: "sta3", condition: "equals", value: "New", points: 2 },
        ],
      },
      {
        fieldName: "industry",
        label: "Industry",
        isActive: true,
        weight: 20,
        rules: [
          { id: "ind1", condition: "equals", value: "Technology", points: 10 },
          { id: "ind2", condition: "equals", value: "Finance", points: 8 },
          { id: "ind3", condition: "equals", value: "Education", points: 5 },
        ],
      },
    ],
  };
  sessionStorage.setItem("mockScoringConfig", JSON.stringify(defaultConfig));
  return defaultConfig;
};

const getInitialLeads = (): Lead[] => {
  const storedLeads = sessionStorage.getItem("mockLeads");
  if (storedLeads) {
    try {
      return JSON.parse(storedLeads);
    } catch (e) {
      console.error("Failed to parse stored leads, using default.", e);
    }
  }
  const defaultLeads: Lead[] = [
    {
      id: "1",
      name: "Somnath Ghosh",
      email: "ghoshsomnath5@gmail.com",
      phone: "+91 91-9836841074",
      company: "SomLance",
      title: "CEO", // Changed from designation
      industry: "Technology",
      status: "Qualified",
      source: "LinkedIn",
      category: "Regional", // Re-add category
      location: "Kolkata, India", // Re-add location
      lastContact: "Mar 23, 2025", // Re-add lastContact
      nextFollowUp: "Mar 29, 2025", // Re-add nextFollowUp
      notes: "Initial contact made. Interested in enterprise plan.",
      createdAt: "2025-03-20T10:00:00Z",
      updatedAt: "2025-03-28T11:30:00Z",
      linkedinUrl: "https://linkedin.com/in/somnathghosh",
      engagement: 75,
      companySize: 50,
      budget: 15000,
      timeline: "1-3 months",
      score: 92, // Keep existing score or recalculate later
    },
    {
      id: "2",
      name: "Sanchita Ghosh",
      email: "ghoshsanchita@example.com", // Changed email
      phone: "+91 91-9876543210", // Changed phone
      company: "SomLance",
      title: "CTO", // Changed from designation
      industry: "Education",
      status: "New",
      source: "Website Form",
      category: "Local", // Re-add category
      location: "Mumbai, India", // Re-add location
      lastContact: "Mar 23, 2025", // Re-add lastContact
      nextFollowUp: new Date().toLocaleDateString("en-US", {
        // Re-add nextFollowUp
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      notes: "Downloaded whitepaper.",
      createdAt: "2025-03-23T14:00:00Z",
      updatedAt: "2025-03-23T14:00:00Z",
      engagement: 20,
      companySize: 50,
      budget: 8500,
      timeline: "6+ months",
      score: 50, // Keep existing score or recalculate later
    },
    {
      id: "3",
      name: "Sanchita Ghosh", // Same name, different person/lead
      email: "sanchita.g@prodomain.com", // Changed email
      phone: "+44 20 7123 4567", // Changed phone
      company: "Prodomain",
      title: "Head of Marketing", // Changed from designation
      industry: "Finance",
      status: "Closed", // Changed from Won to match type
      source: "Referral",
      category: "MNC", // Re-add category
      location: "London, UK", // Re-add location
      lastContact: "Mar 23, 2025", // Re-add lastContact
      nextFollowUp: "Mar 27, 2025", // Re-add nextFollowUp
      notes: "Closed deal. Happy customer.",
      createdAt: "2025-02-15T09:00:00Z",
      updatedAt: "2025-03-23T16:00:00Z",
      linkedinUrl: "https://linkedin.com/in/sanchitag",
      engagement: 90,
      companySize: 500,
      budget: 22000,
      timeline: "Immediate",
      score: 66, // Keep existing score or recalculate later
    },
  ];
  sessionStorage.setItem("mockLeads", JSON.stringify(defaultLeads));
  return defaultLeads;
};

const getInitialPipelineStages = (): PipelineStage[] => {
  const storedStages = sessionStorage.getItem("mockPipelineStages");
  if (storedStages) {
    try {
      return JSON.parse(storedStages);
    } catch (e) {
      console.error("Failed to parse stored stages, using default.", e);
    }
  }
  const defaultStages: PipelineStage[] = [
    {
      id: "New",
      name: "New",
      order: 0,
      color: "bg-blue-100",
      description: "Newly added leads, awaiting initial contact.",
    },
    {
      id: "Contacted",
      name: "Contacted",
      order: 1,
      color: "bg-purple-100",
      description: "Initial contact has been made.",
    },
    {
      id: "Qualified",
      name: "Qualified",
      order: 2,
      color: "bg-amber-100",
      description: "Lead meets qualification criteria.",
    },
    {
      id: "Won",
      name: "Won",
      order: 3,
      color: "bg-green-100",
      description: "Deal successfully closed.",
    },
    {
      id: "Lost",
      name: "Lost",
      order: 4,
      color: "bg-red-100",
      description: "Deal lost or lead disqualified.",
    },
  ];
  sessionStorage.setItem("mockPipelineStages", JSON.stringify(defaultStages));
  return defaultStages;
};

// --- Mock State ---
export let currentScoringConfig: ScoringConfig = getInitialScoringConfig();
export let currentMockLeads: Lead[] = getInitialLeads();
export let currentMockPipelineStages: PipelineStage[] =
  getInitialPipelineStages();

export const mockLeadActivity = new Map<string, ActivityLogEntry[]>([
  [
    "1",
    [
      {
        id: "act101",
        timestamp: "2025-03-28T10:30:00Z",
        type: "Call",
        details: "Initial contact call, discussed needs.",
        userId: "user1",
      },
      {
        id: "act102",
        timestamp: "2025-03-29T14:00:00Z",
        type: "Email",
        details: "Sent follow-up email with brochure.",
        userId: "user1",
      },
      {
        id: "act103",
        timestamp: "2025-03-30T09:15:00Z",
        type: "StageChange",
        details: "Stage changed from New to Contacted.",
        userId: "system",
      },
    ],
  ],
  [
    "3",
    [
      {
        id: "act301",
        timestamp: "2025-03-25T11:00:00Z",
        type: "Meeting",
        details: "Discovery meeting held.",
        userId: "user2",
      },
      {
        id: "act302",
        timestamp: "2025-03-26T16:45:00Z",
        type: "Note",
        details: "Lead interested in premium features.",
        userId: "user2",
      },
    ],
  ],
]);

export const dashboardStats: DashboardStats = {
  totalLeads: { value: 86, change: { value: "12%", positive: true } },
  conversionRate: { value: "24%", change: { value: "3%", positive: true } },
  meetingsBooked: { value: 12, change: { value: "5%", positive: false } },
  dealsClosed: { value: 8, change: { value: "18%", positive: true } },
};

export const subscriptionInfo: SubscriptionInfo = {
  plan: "Pro",
  daysRemaining: 14,
  usedLeads: 35,
  maxLeads: 50,
};

// --- State Management Functions ---
export const updateStoredScoringConfig = (config: ScoringConfig) => {
  currentScoringConfig = config; // Update in-memory state as well
  sessionStorage.setItem("mockScoringConfig", JSON.stringify(config));
};

export const updateStoredLeads = (leads: Lead[]) => {
  currentMockLeads = leads; // Update in-memory state as well
  sessionStorage.setItem("mockLeads", JSON.stringify(leads));
};

export const updateStoredPipelineStages = (stages: PipelineStage[]) => {
  currentMockPipelineStages = stages; // Update in-memory state as well
  sessionStorage.setItem("mockPipelineStages", JSON.stringify(stages));
};

// --- Score Calculation Logic ---
export const calculateLeadScore = (
  lead: Omit<Lead, "id" | "score"> | Lead,
  config: ScoringConfig
): number => {
  let totalWeightedScore = 0;
  let totalActiveWeight = 0;

  config.fields.forEach((fieldConfig) => {
    if (!fieldConfig.isActive || fieldConfig.weight <= 0) {
      return;
    }

    totalActiveWeight += fieldConfig.weight;
    let fieldScore = 0;
    const leadIdentifier = lead
      ? lead.name || ("id" in lead ? `(ID: ${lead.id})` : "(ID missing)")
      : "(unknown lead)";

    if (!Object.prototype.hasOwnProperty.call(lead, fieldConfig.fieldName)) {
      return;
    }

    const leadValueRaw = lead[fieldConfig.fieldName as keyof typeof lead];

    if (typeof leadValueRaw === "string" && leadValueRaw.trim() !== "") {
      const leadValueLower = leadValueRaw.toLowerCase();

      fieldConfig.rules.forEach((rule) => {
        let match = false;
        const ruleValue = rule.value;

        try {
          switch (rule.condition) {
            case "equals":
              if (typeof ruleValue === "string") {
                match = leadValueLower === ruleValue.toLowerCase();
              }
              break;
            case "contains":
              if (typeof ruleValue === "string") {
                match = leadValueLower.includes(ruleValue.toLowerCase());
              }
              break;
            case "isOneOf":
              if (Array.isArray(ruleValue)) {
                match = ruleValue.some(
                  (val) =>
                    typeof val === "string" &&
                    leadValueLower === val.toLowerCase()
                );
              }
              break;
            case "isNotEmpty":
              match = leadValueRaw !== undefined && leadValueRaw !== "";
              break;
          }
        } catch (e) {
          console.error(
            `[ScoreCalc] Error evaluating rule ${rule.id} (Condition: ${rule.condition}) for field ${fieldConfig.fieldName} on lead ${leadIdentifier}:`,
            e
          );
        }

        if (match) {
          fieldScore += rule.points;
        }
      });
    }
    totalWeightedScore += fieldScore * (fieldConfig.weight / 100);
  });

  const maxPossibleWeightedScore = config.fields.reduce((sum, field) => {
    if (!field.isActive) return sum;
    const maxPointsForRule = Math.max(0, ...field.rules.map((r) => r.points));
    return sum + maxPointsForRule * (field.weight / 100);
  }, 0);

  let finalScore = 0;
  if (maxPossibleWeightedScore > 0) {
    finalScore = (totalWeightedScore / maxPossibleWeightedScore) * 100;
  }

  if (!isFinite(finalScore)) {
    console.warn(
      `Score calculation resulted in non-finite number for lead ${
        lead.name || ("id" in lead ? lead.id : "")
      }. Resetting to 0.`
    );
    finalScore = 0;
  }
  finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

  return finalScore;
};

// Update functions for mock data
export const updateMockLeads = (leads: Lead[]) => {
  currentMockLeads = leads;
  updateStoredLeads(leads);
};

export const updateMockPipelineStages = (stages: PipelineStage[]) => {
  currentMockPipelineStages = stages;
  updateStoredPipelineStages(stages);
};

export const updateMockScoringConfig = (config: ScoringConfig) => {
  currentScoringConfig = config;
  updateStoredScoringConfig(config);
};

// Mail Activities
export const mockMailActivities: MailActivity[] = [
  {
    id: "1",
    name: "Welcome Email Sequence",
    type: "Email Campaign",
    date: "2023-06-15",
    assignedUser: "John Doe",
    status: "Completed",
    description: "Automated welcome sequence for new leads",
    targetAudience: "New leads",
    metrics: {
      openRate: 85,
      clickRate: 45,
      conversionRate: 25,
    },
  },
  {
    id: "2",
    name: "Product Update Announcement",
    type: "Email Newsletter",
    date: "2023-06-20",
    assignedUser: "Sarah Lee",
    status: "In Progress",
    description: "Announcing new product features",
    targetAudience: "Existing customers",
    metrics: {
      openRate: 75,
      clickRate: 35,
      conversionRate: 15,
    },
  },
  {
    id: "3",
    name: "Customer Feedback Survey",
    type: "Email Survey",
    date: "2023-06-25",
    assignedUser: "Mike Johnson",
    status: "Planned",
    description: "Gathering customer feedback",
    targetAudience: "Active users",
  },
  {
    id: "4",
    name: "Summer Promotion",
    type: "Email Campaign",
    date: "2023-07-01",
    assignedUser: "Alex Wong",
    status: "Planned",
    description: "Summer special offers",
    targetAudience: "All leads",
  },
  {
    id: "5",
    name: "Webinar Invitation",
    type: "Webinar",
    date: "2023-07-05",
    assignedUser: "Jennifer Smith",
    status: "Planned",
    description: "Product demo webinar",
    targetAudience: "Qualified leads",
  },
];

// GTM Strategy
export const mockGTMStrategy: GTMStrategy = {
  id: "1",
  name: "Q3 Market Expansion Strategy",
  description: "Strategy for expanding into new markets in Q3",
  status: "Active",
  items: [
    {
      id: "1",
      title: "Market Analysis",
      type: "Market Analysis",
      status: "In Progress",
      description: "Analyze target market size and opportunities",
      dueDate: "2023-07-15",
      assignedTo: "John Doe",
      progress: 60,
      notes: "Need to gather more competitor data",
      metrics: {
        marketSize: 5000000,
        growthRate: 15,
      },
    },
    {
      id: "2",
      title: "Value Proposition",
      type: "Positioning Strategy",
      status: "Not Started",
      description: "Define unique value proposition",
      dueDate: "2023-07-20",
      assignedTo: "Sarah Lee",
      progress: 0,
    },
    {
      id: "3",
      title: "Channel Strategy",
      type: "Channel Strategy",
      status: "Not Started",
      description: "Plan distribution channels",
      dueDate: "2023-07-25",
      assignedTo: "Mike Johnson",
      progress: 0,
    },
    {
      id: "4",
      title: "SaaS GTM Framework",
      type: "Framework",
      status: "Completed",
      description: "Apply SaaS GTM framework",
      dueDate: "2023-07-10",
      assignedTo: "Alex Wong",
      progress: 100,
      template: "SaaS GTM Framework",
    },
  ],
  createdAt: "2023-06-01",
  updatedAt: "2023-06-15",
};

// Remove this duplicate definition, use currentMockPipelineStages instead
// export const mockPipelineStages: PipelineStage[] = [ ... ];
