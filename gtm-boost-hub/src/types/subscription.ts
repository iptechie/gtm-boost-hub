import { SubscriptionTier } from "./auth";

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

export interface SubscriptionPlan {
  name: string;
  price: number;
  maxUsers: number;
  maxLeads: number;
  features: {
    [key: string]: boolean;
  };
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  BASIC: {
    name: "Basic",
    price: 0,
    maxUsers: 3,
    maxLeads: 100,
    features: {
      "Lead Management": true,
      "Basic Analytics": true,
      "Email Integration": true,
      "Custom Fields": false,
      "API Access": false,
      "Advanced Analytics": false,
      "Priority Support": false,
    },
  },
  PRO: {
    name: "Pro",
    price: 49,
    maxUsers: 10,
    maxLeads: 1000,
    features: {
      "Lead Management": true,
      "Basic Analytics": true,
      "Email Integration": true,
      "Custom Fields": true,
      "API Access": true,
      "Advanced Analytics": false,
      "Priority Support": false,
    },
  },
  PREMIUM: {
    name: "Premium",
    price: 99,
    maxUsers: 50,
    maxLeads: 5000,
    features: {
      "Lead Management": true,
      "Basic Analytics": true,
      "Email Integration": true,
      "Custom Fields": true,
      "API Access": true,
      "Advanced Analytics": true,
      "Priority Support": true,
    },
  },
};
