import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FeatureGate } from "@/components/FeatureGate";

// Icons
import {
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Settings,
  Trash,
  Plus,
} from "lucide-react";

interface EmailIntegration {
  id: string;
  provider: "microsoft" | "google" | "mailchimp";
  email: string;
  isConnected: boolean;
  lastSynced: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
}

const EmailIntegrationsPage: React.FC = () => {
  const { user } = useAuth();
  const { canAccessIntegrationFeature } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [integrations, setIntegrations] = useState<EmailIntegration[]>([]);
  const [activeTab, setActiveTab] = useState<string>("microsoft");

  // Mock data for development
  useEffect(() => {
    // In a real app, this would fetch from your backend
    setIntegrations([
      {
        id: "1",
        provider: "microsoft",
        email: "user@example.com",
        isConnected: false,
        lastSynced: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      },
      {
        id: "2",
        provider: "google",
        email: "user@gmail.com",
        isConnected: false,
        lastSynced: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      },
      {
        id: "3",
        provider: "mailchimp",
        email: "user@mailchimp.com",
        isConnected: false,
        lastSynced: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      },
    ]);
  }, []);

  const handleConnect = async (provider: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would redirect to the OAuth flow
      // For now, we'll just simulate a successful connection
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.provider === provider
            ? {
                ...integration,
                isConnected: true,
                lastSynced: new Date().toISOString(),
                accessToken: "mock_token",
                refreshToken: "mock_refresh_token",
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
              }
            : integration
        )
      );

      toast.success(`Successfully connected to ${provider}`);
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error);
      toast.error(`Failed to connect to ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (provider: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would revoke the tokens
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.provider === provider
            ? {
                ...integration,
                isConnected: false,
                lastSynced: null,
                accessToken: null,
                refreshToken: null,
                expiresAt: null,
              }
            : integration
        )
      );

      toast.success(`Successfully disconnected from ${provider}`);
    } catch (error) {
      console.error(`Error disconnecting from ${provider}:`, error);
      toast.error(`Failed to disconnect from ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (provider: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would sync emails from the provider
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.provider === provider
            ? {
                ...integration,
                lastSynced: new Date().toISOString(),
              }
            : integration
        )
      );

      toast.success(`Successfully synced emails from ${provider}`);
    } catch (error) {
      console.error(`Error syncing emails from ${provider}:`, error);
      toast.error(`Failed to sync emails from ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "microsoft":
        return "Microsoft";
      case "google":
        return "Google";
      case "mailchimp":
        return "Mailchimp";
      default:
        return provider;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "microsoft":
        return "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg";
      case "google":
        return "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";
      case "mailchimp":
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Mailchimp_Logo.svg/2560px-Mailchimp_Logo.svg.png";
      default:
        return "";
    }
  };

  const getProviderDescription = (provider: string) => {
    switch (provider) {
      case "microsoft":
        return "Connect your Microsoft account to read emails from Outlook";
      case "google":
        return "Connect your Google account to read emails from Gmail";
      case "mailchimp":
        return "Connect your Mailchimp account to read campaign emails";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Email Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect your email accounts to read and analyze emails from your leads
        </p>
      </div>

      <FeatureGate
        feature="email"
        fallback={
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Feature not available</AlertTitle>
            <AlertDescription>
              Email integration is only available on higher subscription tiers.
              Please upgrade your plan to access this feature.
            </AlertDescription>
          </Alert>
        }
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Manage your email integrations and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="mailchimp">Mailchimp</TabsTrigger>
              </TabsList>

              {["microsoft", "google", "mailchimp"].map((provider) => {
                const integration = integrations.find(
                  (i) => i.provider === provider
                );
                const isConnected = integration?.isConnected || false;
                const lastSynced = integration?.lastSynced
                  ? new Date(integration.lastSynced).toLocaleString()
                  : "Never";

                return (
                  <TabsContent
                    key={provider}
                    value={provider}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-md">
                        <img
                          src={getProviderIcon(provider)}
                          alt={getProviderName(provider)}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">
                          {getProviderName(provider)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getProviderDescription(provider)}
                        </p>
                        <div className="flex items-center mt-2">
                          <Badge
                            variant={isConnected ? "default" : "outline"}
                            className="mr-2"
                          >
                            {isConnected ? "Connected" : "Not Connected"}
                          </Badge>
                          {isConnected && (
                            <span className="text-xs text-muted-foreground">
                              Last synced: {lastSynced}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Access</h4>
                          <p className="text-sm text-muted-foreground">
                            Allow access to read your emails
                          </p>
                        </div>
                        <Switch
                          checked={isConnected}
                          onCheckedChange={(checked) =>
                            checked
                              ? handleConnect(provider)
                              : handleDisconnect(provider)
                          }
                          disabled={isLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto-sync</h4>
                          <p className="text-sm text-muted-foreground">
                            Automatically sync emails every hour
                          </p>
                        </div>
                        <Switch
                          checked={isConnected}
                          disabled={!isConnected || isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      {isConnected && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(provider)}
                          disabled={isLoading}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </Button>
                      )}
                      <Button
                        variant={isConnected ? "destructive" : "default"}
                        size="sm"
                        onClick={() =>
                          isConnected
                            ? handleDisconnect(provider)
                            : handleConnect(provider)
                        }
                        disabled={isLoading}
                      >
                        {isConnected ? (
                          <>
                            <Trash className="h-4 w-4 mr-2" />
                            Disconnect
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Analysis Settings</CardTitle>
            <CardDescription>
              Configure how your emails are analyzed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sentiment Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyze the sentiment of emails (positive, negative,
                    neutral)
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Intent Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Detect the intent of emails (interested, not interested,
                    needs more info)
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Lead Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Update lead scores based on email content
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Templates</h4>
                  <p className="text-sm text-muted-foreground">
                    Suggest email templates based on lead responses
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </FeatureGate>
    </div>
  );
};

export default EmailIntegrationsPage;
