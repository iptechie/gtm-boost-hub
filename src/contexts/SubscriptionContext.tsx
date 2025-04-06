import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  SubscriptionPlan,
  BillingType,
  PlanFeatures,
} from "@/types/subscription";
import { SUBSCRIPTION_TIERS } from "@/types/subscription";

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan;
  setPlan: (planId: string) => void;
  billingType: BillingType;
  setBillingType: (type: BillingType) => void;
  canAccessFeature: (feature: keyof PlanFeatures) => boolean;
  canAccessPipelineFeature: (
    feature: keyof PlanFeatures["pipelineStages"]
  ) => boolean;
  canAccessLeadFeature: (
    feature: keyof PlanFeatures["leadManagement"]
  ) => boolean;
  canAccessAnalyticsFeature: (
    feature: keyof PlanFeatures["analytics"]
  ) => boolean;
  canAccessIntegrationFeature: (
    feature: keyof PlanFeatures["integrations"]
  ) => boolean;
  getRemainingLeads: () => number;
  getRemainingTeamMembers: () => number;
  getMaxPipelineStages: () => number;
  totalLeads: number;
  totalTeamMembers: number;
  totalPipelineStages: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(
    SUBSCRIPTION_TIERS.free
  );
  const [billingType, setBillingType] = useState<BillingType>("monthly");
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [totalPipelineStages, setTotalPipelineStages] = useState(0);

  useEffect(() => {
    // Load subscription data from localStorage
    const savedPlan = localStorage.getItem("subscriptionPlan");
    const savedBillingType = localStorage.getItem("billingType");

    if (savedPlan && savedPlan in SUBSCRIPTION_TIERS) {
      setCurrentPlan(
        SUBSCRIPTION_TIERS[savedPlan as keyof typeof SUBSCRIPTION_TIERS]
      );
    }

    if (savedBillingType === "monthly" || savedBillingType === "annual") {
      setBillingType(savedBillingType);
    }
  }, []);

  const setPlan = (planId: string) => {
    if (planId in SUBSCRIPTION_TIERS) {
      const newPlan =
        SUBSCRIPTION_TIERS[planId as keyof typeof SUBSCRIPTION_TIERS];
      setCurrentPlan(newPlan);
      localStorage.setItem("subscriptionPlan", planId);
    }
  };

  const handleSetBillingType = (type: BillingType) => {
    setBillingType(type);
    localStorage.setItem("billingType", type);
  };

  const canAccessFeature = (feature: keyof PlanFeatures): boolean => {
    return Boolean(currentPlan.features[feature]);
  };

  const canAccessPipelineFeature = (
    feature: keyof PlanFeatures["pipelineStages"]
  ): boolean => {
    return Boolean(currentPlan.features.pipelineStages[feature]);
  };

  const canAccessLeadFeature = (
    feature: keyof PlanFeatures["leadManagement"]
  ): boolean => {
    return Boolean(currentPlan.features.leadManagement[feature]);
  };

  const canAccessAnalyticsFeature = (
    feature: keyof PlanFeatures["analytics"]
  ): boolean => {
    return Boolean(currentPlan.features.analytics[feature]);
  };

  const canAccessIntegrationFeature = (
    feature: keyof PlanFeatures["integrations"]
  ): boolean => {
    return Boolean(currentPlan.features.integrations[feature]);
  };

  const getRemainingLeads = (): number => {
    if (currentPlan.features.maxLeads === -1) return -1;
    return Math.max(0, currentPlan.features.maxLeads - totalLeads);
  };

  const getRemainingTeamMembers = (): number => {
    if (currentPlan.features.maxTeamMembers === -1) return -1;
    return Math.max(0, currentPlan.features.maxTeamMembers - totalTeamMembers);
  };

  const getMaxPipelineStages = (): number => {
    return currentPlan.features.pipelineStages.maxStages;
  };

  const value = {
    currentPlan,
    setPlan,
    billingType,
    setBillingType: handleSetBillingType,
    canAccessFeature,
    canAccessPipelineFeature,
    canAccessLeadFeature,
    canAccessAnalyticsFeature,
    canAccessIntegrationFeature,
    getRemainingLeads,
    getRemainingTeamMembers,
    getMaxPipelineStages,
    totalLeads,
    totalTeamMembers,
    totalPipelineStages,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
