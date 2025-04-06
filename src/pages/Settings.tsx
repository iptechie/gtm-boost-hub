import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadConfiguration from "@/components/settings/LeadConfiguration";
import { useLeadConfiguration } from "@/contexts/LeadConfigurationContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { FeatureGate } from "@/components/FeatureGate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings2,
  ExternalLink,
  CreditCard,
  FileText,
  Key,
  Shield,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  lastSynced?: string;
  features: string[];
}

const Settings: React.FC = () => {
  const { configuration, updateConfiguration } = useLeadConfiguration();
  const { canAccessIntegrationFeature, currentPlan, billingType } =
    useSubscription();
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "email",
      name: "Email Integration",
      description:
        "Connect your email accounts to sync and analyze communications with leads",
      icon: <Mail className="h-5 w-5" />,
      isConnected: false,
      features: [
        "Email sync from multiple providers",
        "Sentiment analysis",
        "Intent detection",
        "Automated responses",
      ],
    },
    {
      id: "mailchimp",
      name: "Mailchimp Integration",
      description: "Sync your Mailchimp contacts and campaigns with your leads",
      icon: <Send className="h-5 w-5" />,
      isConnected: false,
      features: [
        "Contact synchronization",
        "Campaign tracking",
        "List management",
        "Automation rules",
      ],
    },
    {
      id: "slack",
      name: "Slack Integration",
      description: "Get notifications and updates in your Slack workspace",
      icon: <MessageSquare className="h-5 w-5" />,
      isConnected: false,
      features: [
        "Lead notifications",
        "Activity updates",
        "Team collaboration",
        "Custom alerts",
      ],
    },
  ]);
  const navigate = useNavigate();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    twoFactorEnabled: false,
  });

  const handleConnect = async (integrationId: string) => {
    try {
      // In a real app, this would handle OAuth or other connection methods
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? {
                ...integration,
                isConnected: true,
                lastSynced: new Date().toISOString(),
              }
            : integration
        )
      );
      toast.success(
        `${
          integrations.find((i) => i.id === integrationId)?.name
        } connected successfully`
      );
    } catch (error) {
      console.error("Error connecting integration:", error);
      toast.error("Failed to connect integration");
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      // In a real app, this would handle disconnection logic
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? { ...integration, isConnected: false, lastSynced: undefined }
            : integration
        )
      );
      toast.success(
        `${
          integrations.find((i) => i.id === integrationId)?.name
        } disconnected successfully`
      );
    } catch (error) {
      console.error("Error disconnecting integration:", error);
      toast.error("Failed to disconnect integration");
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      // In a real app, this would trigger a sync with the integration
      toast.success(
        `${
          integrations.find((i) => i.id === integrationId)?.name
        } synced successfully`
      );
    } catch (error) {
      console.error("Error syncing integration:", error);
      toast.error("Failed to sync integration");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would handle account deletion
      toast.success("Account deleted successfully");
      navigate("/logout");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

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
          <FeatureGate
            feature="integrations"
            fallback={
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Integrations</h2>
                <p className="text-muted-foreground">
                  This feature is only available on higher subscription tiers.
                  Please upgrade your plan to access integrations.
                </p>
              </div>
            }
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Connected Services</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your integrations and connected services
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
              </div>

              <div className="grid gap-4">
                {integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {integration.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {integration.name}
                            </CardTitle>
                            <CardDescription>
                              {integration.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {integration.isConnected ? (
                            <>
                              <Badge
                                variant="outline"
                                className="flex items-center"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                Connected
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisconnect(integration.id)}
                              >
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleConnect(integration.id)}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {integration.features.map((feature, index) => (
                            <Badge key={index} variant="secondary">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        {integration.isConnected && (
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Last synced:{" "}
                              {integration.lastSynced
                                ? new Date(
                                    integration.lastSynced
                                  ).toLocaleString()
                                : "Never"}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSync(integration.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Now
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </FeatureGate>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
