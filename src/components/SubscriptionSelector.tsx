import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_PLANS } from "@/types/subscription";
import { cn } from "@/lib/utils";

interface SubscriptionSelectorProps {
  selectedPlan: string;
  onSelectPlan: (plan: string) => void;
}

const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
  selectedPlan,
  onSelectPlan,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(SUBSCRIPTION_PLANS).map(([tier, plan]) => (
        <Card
          key={tier}
          className={cn(
            "transition-all duration-200",
            selectedPlan === tier
              ? "border-primary shadow-lg scale-105"
              : "hover:shadow-md"
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{plan.name}</span>
              {tier === "PREMIUM" && (
                <Badge variant="default" className="ml-2">
                  Most Popular
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              <div className="text-2xl font-bold mt-2">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">
                    Up to {plan.maxUsers} users
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">
                    Up to {plan.maxLeads} leads
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(plan.features).map(([feature, enabled]) => (
                  <div
                    key={feature}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full",
                        enabled
                          ? "bg-primary"
                          : "bg-muted border border-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        enabled ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full"
                variant={selectedPlan === tier ? "default" : "outline"}
                onClick={() => onSelectPlan(tier)}
              >
                {selectedPlan === tier ? "Selected" : "Select Plan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionSelector;
