export interface SubscriptionFeatures {
  leadManagement: boolean;
  advancedAnalytics: boolean;
  aiInsights: boolean;
  customLeadFields: boolean;
  teamCollaboration: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
}

export interface PlanFeatures {
  maxLeads: number;
  pipelineStages: {
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    maxStages: number;
  };
  leadManagement: {
    canImport: boolean;
    canExport: boolean;
    canBulkEdit: boolean;
    canDelete: boolean;
  };
  analytics: {
    basic: boolean;
    advanced: boolean;
    customReports: boolean;
  };
  integrations: {
    crm: boolean;
    email: boolean;
    calendar: boolean;
    custom: boolean;
  };
  maxTeamMembers: number;
  apiAccess: boolean;
  prioritySupport: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: PlanFeatures;
}

export type BillingType = "monthly" | "annual";

export interface SubscriptionTier {
  name: SubscriptionPlan;
  price: {
    monthly: number;
    annual: number;
  };
  features: PlanFeatures;
  description: string;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionPlan> = {
  free: {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    features: {
      maxLeads: 50,
      pipelineStages: {
        canAdd: false,
        canEdit: true,
        canDelete: false,
        maxStages: 3,
      },
      leadManagement: {
        canImport: false,
        canExport: false,
        canBulkEdit: false,
        canDelete: true,
      },
      analytics: {
        basic: true,
        advanced: false,
        customReports: false,
      },
      integrations: {
        crm: false,
        email: false,
        calendar: false,
        custom: false,
      },
      maxTeamMembers: 1,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  starter: {
    id: "starter",
    name: "Starter",
    monthlyPrice: 19,
    annualPrice: 182,
    features: {
      maxLeads: 200,
      pipelineStages: {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        maxStages: 10,
      },
      leadManagement: {
        canImport: true,
        canExport: true,
        canBulkEdit: true,
        canDelete: true,
      },
      analytics: {
        basic: true,
        advanced: false,
        customReports: false,
      },
      integrations: {
        crm: true,
        email: true,
        calendar: true,
        custom: false,
      },
      maxTeamMembers: 3,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  growth: {
    id: "growth",
    name: "Growth",
    monthlyPrice: 49,
    annualPrice: 470,
    features: {
      maxLeads: 1000,
      pipelineStages: {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        maxStages: 20,
      },
      leadManagement: {
        canImport: true,
        canExport: true,
        canBulkEdit: true,
        canDelete: true,
      },
      analytics: {
        basic: true,
        advanced: true,
        customReports: true,
      },
      integrations: {
        crm: true,
        email: true,
        calendar: true,
        custom: true,
      },
      maxTeamMembers: 10,
      apiAccess: true,
      prioritySupport: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyPrice: 99,
    annualPrice: 950,
    features: {
      maxLeads: -1,
      pipelineStages: {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        maxStages: -1,
      },
      leadManagement: {
        canImport: true,
        canExport: true,
        canBulkEdit: true,
        canDelete: true,
      },
      analytics: {
        basic: true,
        advanced: true,
        customReports: true,
      },
      integrations: {
        crm: true,
        email: true,
        calendar: true,
        custom: true,
      },
      maxTeamMembers: -1,
      apiAccess: true,
      prioritySupport: true,
    },
  },
};

// Export SUBSCRIPTION_PLANS as an alias for SUBSCRIPTION_TIERS for backward compatibility
export const SUBSCRIPTION_PLANS = SUBSCRIPTION_TIERS;
