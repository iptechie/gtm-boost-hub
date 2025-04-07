import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-slate-500">
        Manage your account settings and application configurations.
      </p>

      {/* Configurations Section */}
      <Card>
        <CardHeader>
          <CardTitle>Configurations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Lead Scoring Link */}
          <Link
            to="/settings/lead-scoring"
            className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors"
          >
            <div>
              <h4 className="font-medium">Lead Scoring</h4>
              <p className="text-sm text-slate-500">
                Configure rules and weights for automatic lead scoring.
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>

          {/* Custom Lead Fields Link */}
          <Link
            to="/settings/custom-lead-fields"
            className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors"
          >
            <div>
              <h4 className="font-medium">Custom Lead Fields</h4>
              <p className="text-sm text-slate-500">
                Add or manage custom fields for your leads.
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>

          {/* Dashboard Settings Link */}
          <Link
            to="/settings/dashboard"
            className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors"
          >
            <div>
              <h4 className="font-medium">Dashboard Settings</h4>
              <p className="text-sm text-slate-500">
                Customize your dashboard view and widgets.
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        </CardContent>
      </Card>

      {/* Add other settings sections like Profile, Billing etc. later */}
    </div>
  );
};

export default SettingsPage;
