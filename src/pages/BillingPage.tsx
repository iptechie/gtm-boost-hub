import React, { useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SUBSCRIPTION_TIERS } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const BillingPage: React.FC = () => {
  const { currentPlan, setPlan, billingType, setBillingType } =
    useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(currentPlan.id);

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleBillingTypeChange = (type: "monthly" | "annual") => {
    setBillingType(type);
  };

  const handleUpgrade = () => {
    // TODO: Implement payment processing
    setPlan(selectedPlan);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Subscription & Billing</h1>
        <div className="flex items-center space-x-4">
          <Label>Billing Cycle</Label>
          <RadioGroup
            value={billingType}
            onValueChange={handleBillingTypeChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="annual" id="annual" />
              <Label htmlFor="annual">Annual (20% off)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(SUBSCRIPTION_TIERS).map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              selectedPlan === plan.id ? "border-primary" : ""
            }`}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="text-2xl font-bold">
                $
                {billingType === "annual"
                  ? plan.annualPrice
                  : plan.monthlyPrice}
                <span className="text-sm font-normal text-muted-foreground">
                  /{billingType === "annual" ? "year" : "month"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {Object.entries(plan.features).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {typeof value === "boolean"
                        ? key
                        : `${key}: ${value === -1 ? "Unlimited" : value}`}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full"
                variant={selectedPlan === plan.id ? "default" : "outline"}
                onClick={() => handlePlanChange(plan.id)}
              >
                {selectedPlan === plan.id ? "Current Plan" : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlan !== currentPlan.id && (
        <div className="flex justify-end">
          <Button onClick={handleUpgrade}>Upgrade Plan</Button>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
