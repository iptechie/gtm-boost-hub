import React from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LimitDisplayProps {
  label: string;
  used: number;
  total: number;
  showUpgrade?: boolean;
}

const LimitDisplay: React.FC<LimitDisplayProps> = ({
  label,
  used,
  total,
  showUpgrade = true,
}) => {
  const percentage = total === -1 ? 0 : (used / total) * 100;
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {used} / {total === -1 ? "∞" : total}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      {showUpgrade && total !== -1 && used >= total * 0.8 && (
        <Button
          variant="link"
          className="px-0 text-sm"
          onClick={() => navigate("/settings/billing")}
        >
          Upgrade plan to increase limit
        </Button>
      )}
    </div>
  );
};

export const SubscriptionLimits: React.FC = () => {
  const {
    currentPlan,
    getRemainingLeads,
    getRemainingTeamMembers,
    getMaxPipelineStages,
    totalLeads,
    totalTeamMembers,
    totalPipelineStages,
  } = useSubscription();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <LimitDisplay
          label="Leads"
          used={totalLeads}
          total={currentPlan.features.maxLeads}
        />
        <LimitDisplay
          label="Team Members"
          used={totalTeamMembers}
          total={currentPlan.features.maxTeamMembers}
        />
        <LimitDisplay
          label="Pipeline Stages"
          used={totalPipelineStages}
          total={getMaxPipelineStages()}
        />
      </CardContent>
    </Card>
  );
};

export default SubscriptionLimits;
