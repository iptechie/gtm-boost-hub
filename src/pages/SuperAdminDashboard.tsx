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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  Check,
  X,
} from "lucide-react";
import { AIApiKeysManager } from "@/components/AIApiKeysManager";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  fetchAdminStats,
  fetchRecentOrganizations,
} from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ORG_ADMIN" | "SUPER_ADMIN";
  status: "active" | "inactive" | "pending";
  organization: string;
  lastActive: string;
}

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
  users: User[];
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
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch admin stats
        const stats = await fetchAdminStats();

        // Fetch recent organizations
        const recentOrgs = await fetchRecentOrganizations();

        // Fetch users
        const fetchedUsers = await fetchUsers();

        // Format the data
        const formattedData: SuperAdminData = {
          stats,
          recentOrganizations: recentOrgs.map((org) => ({
            id: org.id,
            name: org.name,
            plan: org.subscription_tier || "Free",
            users: `${org.current_users || 0}/${org.max_users || 0}`,
            status: org.subscription_status || "Active",
            created: new Date(org.created_at).toLocaleDateString(),
          })),
          users: fetchedUsers.map((user) => ({
            id: user.id,
            name: user.name || "Unknown",
            email: user.email,
            role: user.role || "USER",
            status: user.status || "active",
            organization: user.organization_id || "Unknown",
            lastActive: user.last_active
              ? new Date(user.last_active).toLocaleDateString()
              : "Never",
          })),
        };

        setData(formattedData);
        setUsers(formattedData.users);
      } catch (error) {
        console.error("Failed to fetch super admin data:", error);
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

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await updateUser(userId, updates);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, ...updates } : user
        )
      );
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users across all organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ORG_ADMIN">Org Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.organization}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active"
                          ? "default"
                          : user.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUser(user.id, {
                              status:
                                user.status === "active"
                                  ? "inactive"
                                  : "active",
                            })
                          }
                        >
                          {user.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateUser(user.id, {
                              role:
                                user.role === "USER"
                                  ? "ORG_ADMIN"
                                  : user.role === "ORG_ADMIN"
                                  ? "SUPER_ADMIN"
                                  : "USER",
                            })
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                    <TableCell>${plan.monthlyPrice}/month</TableCell>
                    <TableCell>{plan.features.maxTeamMembers}</TableCell>
                    <TableCell>{plan.features.maxLeads}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(plan.features).map(
                          ([feature, value]) => (
                            <Badge
                              key={feature}
                              variant={
                                typeof value === "boolean" && value
                                  ? "default"
                                  : "secondary"
                              }
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
