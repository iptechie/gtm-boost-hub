import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SUBSCRIPTION_TIERS } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const SubscriptionSelect: React.FC = () => {
  const navigate = useNavigate();
  const { setPlan } = useSubscription();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          navigate("/signup");
          return;
        }

        if (!session.user.email_confirmed_at) {
          setIsEmailVerified(false);
          toast.error("Please verify your email before selecting a plan.");
          return;
        }

        setIsEmailVerified(true);
      } catch (error) {
        console.error("Error checking email verification:", error);
        navigate("/signup");
      } finally {
        setIsLoading(false);
      }
    };

    checkEmailVerification();
  }, [navigate]);

  const handleSelectPlan = async (planId: string) => {
    if (!isEmailVerified) {
      toast.error("Please verify your email before selecting a plan.");
      return;
    }

    try {
      await setPlan(planId);
      toast.success("Subscription plan selected successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast.error("Failed to select subscription plan. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Checking verification status...
          </p>
        </div>
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-4">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verification Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please check your email and click the verification link before
              selecting a plan. If you haven't received the email, you can
              request a new one.
            </p>
            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="mr-2"
            >
              Back to Sign Up
            </Button>
            <Button
              onClick={async () => {
                const {
                  data: { session },
                } = await supabase.auth.getSession();
                if (session?.user.email) {
                  await supabase.auth.resend({
                    type: "signup",
                    email: session.user.email,
                  });
                  toast.success("Verification email resent!");
                }
              }}
            >
              Resend Verification Email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {Object.entries(SUBSCRIPTION_TIERS).map(([key, plan]) => (
            <Card key={key} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Object.entries(plan.features).map(([feature, value]) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-600">
                        {typeof value === "boolean"
                          ? feature
                          : `${feature}: ${value}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={key === "PRO" ? "default" : "outline"}
                  onClick={() => handleSelectPlan(key)}
                >
                  {key === "FREE" ? "Get Started" : "Upgrade to " + plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSelect;
