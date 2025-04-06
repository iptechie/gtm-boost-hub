import React from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import type { PlanFeatures } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureGateProps {
  children: React.ReactNode;
  feature?: keyof PlanFeatures;
  pipelineFeature?: keyof PlanFeatures["pipelineStages"];
  leadFeature?: keyof PlanFeatures["leadManagement"];
  analyticsFeature?: keyof PlanFeatures["analytics"];
  integrationFeature?: keyof PlanFeatures["integrations"];
  fallback?: React.ReactNode;
  showUpgradeButton?: boolean;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  children,
  feature,
  pipelineFeature,
  leadFeature,
  analyticsFeature,
  integrationFeature,
  fallback,
  showUpgradeButton = true,
}) => {
  const {
    canAccessFeature,
    canAccessPipelineFeature,
    canAccessLeadFeature,
    canAccessAnalyticsFeature,
    canAccessIntegrationFeature,
    currentPlan,
  } = useSubscription();
  const navigate = useNavigate();

  const hasAccess = (): boolean => {
    if (feature) return canAccessFeature(feature);
    if (pipelineFeature) return canAccessPipelineFeature(pipelineFeature);
    if (leadFeature) return canAccessLeadFeature(leadFeature);
    if (analyticsFeature) return canAccessAnalyticsFeature(analyticsFeature);
    if (integrationFeature)
      return canAccessIntegrationFeature(integrationFeature);
    return true;
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
      <div className="text-lg font-semibold">
        This feature is not available in your current plan
      </div>
      <div className="text-sm text-muted-foreground">
        Upgrade your plan to access this feature
      </div>
      {showUpgradeButton && (
        <Button variant="default" onClick={() => navigate("/settings/billing")}>
          Upgrade Plan
        </Button>
      )}
    </div>
  );
};

export default FeatureGate;
