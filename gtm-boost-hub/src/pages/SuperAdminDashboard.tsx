import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SUBSCRIPTION_PLANS } from "@/types/subscription";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { AIApiKeysManager } from "@/components/AIApiKeysManager";

interface SuperAdminData {
  stats: {
    totalOrganizations: number;
    totalUsers: number;
    monthlyRevenue: number;
    activeTrials: number;
  };
  recentOrganizations: Array<{
    id: string;
    name: string;
    plan: string;
    users: string;
    status: string;
    created: string;
  }>;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  lastUsed?: string;
  status: "active" | "inactive";
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "OpenAI Production",
    key: "sk-1234567890abcdef",
    service: "OpenAI",
    lastUsed: "2024-03-20",
    status: "active",
  },
  {
    id: "2",
    name: "Gemini Development",
    key: "AIzaSyD9876543210xyz",
    service: "Google Gemini",
    lastUsed: "2024-03-19",
    status: "active",
  },
];

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<SuperAdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/super");
        const result = await response.json();
        setData(result);
      } catch (error) {
        toast.error("Failed to fetch super admin data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveApiKey = (newApiKey: Omit<ApiKey, "id">) => {
    const apiKey: ApiKey = {
      ...newApiKey,
      id: Math.random().toString(36).substr(2, 9),
    };
    setApiKeys([...apiKeys, apiKey]);
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const handleUpdateApiKey = (id: string, updates: Partial<ApiKey>) => {
    setApiKeys(
      apiKeys.map((key) => (key.id === id ? { ...key, ...updates } : key))
    );
  };

  if (!user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
          <p className="text-slate-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <Button
          className="btn-gradient flex items-center gap-2"
          onClick={() => toast.info("Add organization feature coming soon")}
        >
          <Plus className="h-4 w-4" />
          Add Organization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Organizations</CardTitle>
            <CardDescription>Active organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data?.stats.totalOrganizations}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>
              Active users across all organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Current month's revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${data?.stats.monthlyRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Trials</CardTitle>
            <CardDescription>Organizations in trial period</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.stats.activeTrials}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <AIApiKeysManager
          apiKeys={apiKeys}
          onSave={handleSaveApiKey}
          onDelete={handleDeleteApiKey}
          onUpdate={handleUpdateApiKey}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>
            Manage subscription tiers and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Max Users</TableHead>
                <TableHead>Max Leads</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(SUBSCRIPTION_PLANS).map(
                ([subscriptionTier, plan]) => (
                  <TableRow key={subscriptionTier}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>${plan.price}/month</TableCell>
                    <TableCell>{plan.maxUsers}</TableCell>
                    <TableCell>{plan.maxLeads}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(plan.features).map(
                          ([feature, enabled]) => (
                            <Badge
                              key={feature}
                              variant={enabled ? "default" : "secondary"}
                            >
                              {feature}
                            </Badge>
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Organizations</CardTitle>
          <CardDescription>
            Latest organization signups and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recentOrganizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.plan}</TableCell>
                  <TableCell>{org.users}</TableCell>
                  <TableCell>
                    <Badge variant="default">{org.status}</Badge>
                  </TableCell>
                  <TableCell>{org.created}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
