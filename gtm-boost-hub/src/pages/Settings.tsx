import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadConfiguration from "@/components/settings/LeadConfiguration";
import { useLeadConfiguration } from "@/contexts/LeadConfigurationContext";

const Settings: React.FC = () => {
  const { configuration, updateConfiguration } = useLeadConfiguration();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="lead-configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lead-configuration">
            Lead Configuration
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="lead-configuration">
          <LeadConfiguration
            configuration={configuration}
            onSave={updateConfiguration}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              Notification Settings
            </h2>
            <p className="text-muted-foreground">
              Configure your notification preferences.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Integrations</h2>
            <p className="text-muted-foreground">
              Manage your connected services and integrations.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
            <p className="text-muted-foreground">
              Manage your account preferences and details.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
