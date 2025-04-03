import React from "react";
// Removed Header import
// Removed Sidebar import
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const GTMStrategyPage: React.FC = () => {
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
          Plan, develop, and execute your go-to-market strategy
        </h2>
        <p className="text-slate-500">
          Define your target market, value proposition, pricing strategy, and
          more.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 hover-scale">
          <h3 className="font-medium text-slate-700 mb-2">Market Analysis</h3>
          <p className="text-sm text-slate-500 mb-4">
            Analyze your target market size, competitors, and opportunities.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.info("Feature in development")}
          >
            Start Analysis
          </Button>
        </div>

        <div className="glass-card p-6 hover-scale">
          <h3 className="font-medium text-slate-700 mb-2">
            Positioning Strategy
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Define your unique value proposition and competitive positioning.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.info("Feature in development")}
          >
            Create Positioning
          </Button>
        </div>

        <div className="glass-card p-6 hover-scale">
          <h3 className="font-medium text-slate-700 mb-2">Channel Strategy</h3>
          <p className="text-sm text-slate-500 mb-4">
            Plan your distribution channels and go-to-market approach.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.info("Feature in development")}
          >
            Plan Channels
          </Button>
        </div>
      </div>
      <div className="glass-card p-6 mb-8">
        <h3 className="font-medium text-slate-700 mb-4">
          GTM Framework Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <h4 className="font-medium">SaaS GTM Framework</h4>
            <p className="text-sm text-slate-500 mt-1">
              Complete framework for software-as-a-service products.
            </p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <h4 className="font-medium">Enterprise Sales Framework</h4>
            <p className="text-sm text-slate-500 mt-1">
              Framework designed for complex, high-value B2B sales.
            </p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <h4 className="font-medium">Product-Led Growth</h4>
            <p className="text-sm text-slate-500 mt-1">
              Framework for user-focused acquisition and expansion.
            </p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <h4 className="font-medium">Market Expansion</h4>
            <p className="text-sm text-slate-500 mt-1">
              Framework for entering new markets or segments.
            </p>
          </div>
        </div>
      </div>
      {/* Removed potentially extra closing div */}
    </>
  );
};

export default GTMStrategyPage;
