import React, { useState } from "react";
// Removed Header import
// Removed Sidebar import
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import StatsCard from "../components/StatsCard";
import SubscriptionInfo from "../components/SubscriptionInfo";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const AIInsightsPage: React.FC = () => {
  const [hasValidApiKey, setHasValidApiKey] = useState(true);
  const [subscription, setSubscription] = useState<
    "Free" | "Starter" | "Growth" | "Pro"
  >("Starter");

  // This would normally come from your authentication/user context
  const userTier = subscription;

  const openRouterKey =
    "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";

  // Determine which features are available based on the subscription tier
  const canAccessLeadScoring = hasValidApiKey && userTier !== "Free";
  const canAccessNextBestActions =
    hasValidApiKey && (userTier === "Growth" || userTier === "Pro");
  const canAccessMarketTrends = hasValidApiKey && userTier === "Pro";

  const handleRequestDemo = () => {
    toast.success("Demo request sent! Our team will contact you shortly.");
  };

  // Removed outer layout divs and Sidebar/Header components
  return (
    <>
      {" "}
      {/* Use Fragment as the top-level element */}
      {/* Header content (button) is removed as it's handled by MainLayout now */}
      {/* If this button is specific to this page, it needs to be moved inside the page content */}
      {/* For now, assuming it was a generic header action */}
      {/* Removed wrapping div, content starts directly */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-slate-700">
          AI-powered insights for your GTM strategy
        </h2>
        <p className="text-slate-500">
          Leverage AI to enhance your lead scoring, get actionable
          recommendations, and stay informed on market trends.
        </p>
      </div>
      {/* Subscription Info - This would come from user context in a real app */}
      <div className="mb-8">
        <SubscriptionInfo
          plan={subscription}
          daysRemaining={14}
          usedLeads={125}
          maxLeads={500}
        />
      </div>
      {hasValidApiKey ? (
        <div className="grid grid-cols-1 gap-6">
          {/* Lead Scoring Widget */}
          {canAccessLeadScoring ? (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium">Lead Scoring</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <StatsCard
                  title="High Potential Leads"
                  value="12"
                  icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                  bgColor="bg-white"
                />
                <StatsCard
                  title="Medium Potential Leads"
                  value="27"
                  icon={<BarChart3 className="h-5 w-5 text-blue-600" />}
                  bgColor="bg-white"
                />
                <StatsCard
                  title="Low Potential Leads"
                  value="43"
                  icon={<BarChart3 className="h-5 w-5 text-amber-600" />}
                  bgColor="bg-white"
                />
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Top Ranked Leads</h4>
                <div className="space-y-2">
                  {[
                    {
                      name: "Acme Corporation",
                      score: 92,
                      reason:
                        "Recent engagement with website and marketing emails",
                    },
                    {
                      name: "TechStars Inc",
                      score: 89,
                      reason:
                        "Multiple demo requests and high content consumption",
                    },
                    {
                      name: "Global Solutions Ltd",
                      score: 85,
                      reason:
                        "Direct inquiry from CTO and multiple touchpoints",
                    },
                  ].map((lead, index) => (
                    <div
                      key={index}
                      className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between">
                        <h5 className="font-medium">{lead.name}</h5>
                        <span className="text-sm font-semibold text-green-600">
                          Score: {lead.score}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {lead.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" variant="outline">
                View All Lead Scores
              </Button>
            </div>
          ) : (
            <div className="glass-card p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h3 className="text-lg font-medium">Lead Scoring</h3>
              </div>
              <p className="text-slate-600 mb-4">
                This feature is available in the Starter, Growth, and Pro plans.
                Upgrade your subscription to access AI-powered lead scoring.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRequestDemo}
              >
                Request Demo
              </Button>
            </div>
          )}

          {/* Next Best Actions Widget */}
          {canAccessNextBestActions ? (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Next Best Actions</h3>
              </div>

              <div className="space-y-3 mb-4">
                {[
                  {
                    action: "Contact Acme Corporation",
                    reason:
                      "They've viewed your pricing page 3 times this week",
                    priority: "High",
                  },
                  {
                    action: "Send follow-up to TechStars Inc",
                    reason: "Last contact was 14 days ago with high interest",
                    priority: "Medium",
                  },
                  {
                    action: "Prepare personalized demo for Global Solutions",
                    reason: "Meeting scheduled for next week",
                    priority: "High",
                  },
                  {
                    action: "Update content for software industry",
                    reason: "50% increase in visitors from this segment",
                    priority: "Medium",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between">
                      <h5 className="font-medium">{item.action}</h5>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.priority === "High"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{item.reason}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full" variant="outline">
                View All Recommendations
              </Button>
            </div>
          ) : (
            <div className="glass-card p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h3 className="text-lg font-medium">Next Best Actions</h3>
              </div>
              <p className="text-slate-600 mb-4">
                This feature is available in the Growth and Pro plans. Upgrade
                your subscription to access AI-recommended actions.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRequestDemo}
              >
                Request Demo
              </Button>
            </div>
          )}

          {/* Market Trends Widget */}
          {canAccessMarketTrends ? (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">Market Trends</h3>
              </div>

              <div className="space-y-4 mb-4">
                <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                  <h4 className="font-medium text-blue-600 mb-2">
                    Rising Demand in E-commerce Integration
                  </h4>
                  <p className="text-slate-600 mb-2">
                    There's a 35% increase in companies looking for GTM
                    solutions with e-commerce integration capabilities.
                  </p>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Industry: Retail, E-commerce</span>
                    <span>Confidence: 87%</span>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                  <h4 className="font-medium text-blue-600 mb-2">
                    SMB Market Expansion Opportunity
                  </h4>
                  <p className="text-slate-600 mb-2">
                    Small and medium businesses are increasingly adopting GTM
                    strategies, representing a growth opportunity.
                  </p>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Industry: Cross-sector</span>
                    <span>Confidence: 92%</span>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                  <h4 className="font-medium text-blue-600 mb-2">
                    AI Integration is a Key Differentiator
                  </h4>
                  <p className="text-slate-600 mb-2">
                    Companies with AI-enhanced GTM strategies are seeing 27%
                    better conversion rates than non-AI approaches.
                  </p>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Industry: Technology, SaaS</span>
                    <span>Confidence: 95%</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                View Full Market Analysis
              </Button>
            </div>
          ) : (
            <div className="glass-card p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h3 className="text-lg font-medium">Market Trends</h3>
              </div>
              <p className="text-slate-600 mb-4">
                This feature is available in the Pro plan only. Upgrade your
                subscription to access AI-powered market trend analysis.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRequestDemo}
              >
                Request Demo
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">
            AI features are not enabled
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Please contact your OrgAdmin to provide a valid Gemma API key or
            upgrade your subscription to access AI-powered insights.
          </p>
          <Button
            variant="outline"
            className="px-8"
            onClick={handleRequestDemo}
          >
            Request Demo
          </Button>
        </div>
      )}
      {/* Removed closing divs for layout */}
    </>
  );
};

export default AIInsightsPage;
