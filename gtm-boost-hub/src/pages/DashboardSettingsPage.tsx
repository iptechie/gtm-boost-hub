import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DashboardSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Settings</h1>
      <p className="text-slate-500">
        Customize the appearance and content of your dashboard.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Widget Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Choose which widgets to display on your dashboard and configure
            their settings.
          </p>
          {/* Placeholder for widget selection/configuration */}
          <div className="border rounded-md p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="widget-leads-overview">Leads Overview</Label>
              <Switch id="widget-leads-overview" disabled defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="widget-pipeline-status">Pipeline Status</Label>
              <Switch id="widget-pipeline-status" disabled defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="widget-activity-feed">Activity Feed</Label>
              <Switch id="widget-activity-feed" disabled />
            </div>
            <p className="text-xs text-slate-400 text-center pt-2">
              More widget options coming soon.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Adjust the layout and arrangement of dashboard elements (Coming
            Soon).
          </p>
          <div className="border rounded-md p-4 text-center text-slate-400 mt-4">
            Layout customization options will appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettingsPage;
