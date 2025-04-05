import { useAuth } from "@/contexts/AuthContext";
import { SUBSCRIPTION_PLANS } from "@/types/subscription";

export const useFeatureFlag = (
  feature: keyof (typeof SUBSCRIPTION_PLANS)["FREE"]["features"]
) => {
  const { organization } = useAuth();

  if (!organization) return false;

  const subscriptionTier = organization.subscriptionTier;
  const subscriptionPlan = SUBSCRIPTION_PLANS[subscriptionTier];

  return subscriptionPlan.features[feature];
};

// Example usage:
// const hasAdvancedAnalytics = useFeatureFlag('advancedAnalytics');
// const hasAIInsights = useFeatureFlag('aiInsights');
// const hasCustomLeadFields = useFeatureFlag('customLeadFields');
