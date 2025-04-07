import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { User, UserRole } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { SUBSCRIPTION_TIERS } from "@/types/subscription";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Icons
import {
  User as UserIcon,
  Mail,
  Key,
  Bell,
  Shield,
  LogOut,
  Camera,
  Save,
  X,
  Check,
  AlertTriangle,
  CreditCard,
  ArrowUpRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  bio: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  twoFactorEnabled: boolean;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentPlan, setPlan, billingType, setBillingType } =
    useSubscription();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    bio: "",
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    twoFactorEnabled: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (
    key: keyof ProfileFormData["notifications"]
  ) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would verify the current password first
      // and then update the password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      setIsChangingPassword(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // In a real app, you would delete the user from Supabase
      // This is a placeholder for the actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Account deleted successfully");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeSubscription = async (newPlanId: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would connect to a payment processor
      // For now, we'll just update the plan in the context
      setPlan(newPlanId);
      toast.success(
        `Successfully upgraded to ${SUBSCRIPTION_TIERS[newPlanId].name} plan!`
      );
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      toast.error("Failed to upgrade subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar with user info */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="flex justify-center mt-2">
                <Badge variant="outline" className="capitalize">
                  {user.role.toLowerCase().replace("_", " ")}
                </Badge>
              </div>
              <div className="flex justify-center mt-2">
                <Badge variant="secondary" className="capitalize">
                  {currentPlan.name} Plan
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {billingType === "annual" ? "Annual" : "Monthly"} billing
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Profile Information</CardTitle>
                          <CardDescription>
                            Update your personal information
                          </CardDescription>
                        </div>
                        {!isEditing ? (
                          <Button onClick={() => setIsEditing(true)}>
                            <UserIcon className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveProfile}
                              disabled={isLoading}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself"
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your account security
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Change Password Section */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h3 className="text-lg font-medium">Password</h3>
                              <p className="text-sm text-muted-foreground">
                                Change your password
                              </p>
                            </div>
                            {!isChangingPassword ? (
                              <Button
                                variant="outline"
                                onClick={() => setIsChangingPassword(true)}
                              >
                                <Key className="h-4 w-4 mr-2" />
                                Change Password
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsChangingPassword(false)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleChangePassword}
                                  disabled={isLoading}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            )}
                          </div>

                          {isChangingPassword && (
                            <div className="space-y-4 p-4 border rounded-md">
                              <div className="space-y-2">
                                <Label htmlFor="currentPassword">
                                  Current Password
                                </Label>
                                <Input
                                  id="currentPassword"
                                  name="currentPassword"
                                  type="password"
                                  value={formData.currentPassword}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newPassword">
                                  New Password
                                </Label>
                                <Input
                                  id="newPassword"
                                  name="newPassword"
                                  type="password"
                                  value={formData.newPassword}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                  Confirm New Password
                                </Label>
                                <Input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type="password"
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Two-Factor Authentication */}
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch
                            checked={formData.twoFactorEnabled}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                twoFactorEnabled: checked,
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        {/* Delete Account */}
                        <div>
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-lg font-medium text-destructive">
                                Delete Account
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data
                              </p>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Delete Account
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    all your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete Account
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Manage how you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium">
                              Email Notifications
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            checked={formData.notifications.email}
                            onCheckedChange={() =>
                              handleNotificationChange("email")
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium">
                              Push Notifications
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Receive push notifications in the app
                            </p>
                          </div>
                          <Switch
                            checked={formData.notifications.push}
                            onCheckedChange={() =>
                              handleNotificationChange("push")
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium">
                              Marketing Communications
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about new features and promotions
                            </p>
                          </div>
                          <Switch
                            checked={formData.notifications.marketing}
                            onCheckedChange={() =>
                              handleNotificationChange("marketing")
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        onClick={() =>
                          toast.success("Notification preferences saved")
                        }
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Subscription Tab */}
                <TabsContent value="subscription" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Current Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentPlan.name} -{" "}
                          {billingType === "annual" ? "Annual" : "Monthly"}{" "}
                          billing
                        </p>
                      </div>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        $
                        {billingType === "annual"
                          ? currentPlan.annualPrice
                          : currentPlan.monthlyPrice}
                        <span className="text-xs text-muted-foreground ml-1">
                          /{billingType === "annual" ? "year" : "month"}
                        </span>
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing Cycle</h3>
                      <RadioGroup
                        value={billingType}
                        onValueChange={(value) =>
                          setBillingType(value as "monthly" | "annual")
                        }
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly" className="flex-1">
                            <div className="flex justify-between">
                              <span>Monthly</span>
                              <span className="text-muted-foreground">
                                ${currentPlan.monthlyPrice}/month
                              </span>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="annual" id="annual" />
                          <Label htmlFor="annual" className="flex-1">
                            <div className="flex justify-between">
                              <span>Annual (Save 20%)</span>
                              <span className="text-muted-foreground">
                                ${currentPlan.annualPrice}/year
                              </span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Upgrade Your Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a plan that better fits your needs
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(SUBSCRIPTION_TIERS)
                          .filter(([id]) => id !== currentPlan.id)
                          .map(([id, plan]) => (
                            <Card key={id} className="relative">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                  {plan.name}
                                </CardTitle>
                                <CardDescription>
                                  <div className="text-xl font-bold mt-1">
                                    $
                                    {billingType === "annual"
                                      ? plan.annualPrice
                                      : plan.monthlyPrice}
                                    <span className="text-sm font-normal text-muted-foreground">
                                      /
                                      {billingType === "annual"
                                        ? "year"
                                        : "month"}
                                    </span>
                                  </div>
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                    <span>
                                      Up to{" "}
                                      {plan.features.maxLeads === -1
                                        ? "Unlimited"
                                        : plan.features.maxLeads}{" "}
                                      leads
                                    </span>
                                  </li>
                                  <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                    <span>
                                      Up to{" "}
                                      {plan.features.maxTeamMembers === -1
                                        ? "Unlimited"
                                        : plan.features.maxTeamMembers}{" "}
                                      team members
                                    </span>
                                  </li>
                                  <li className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                    <span>
                                      Up to{" "}
                                      {plan.features.pipelineStages
                                        .maxStages === -1
                                        ? "Unlimited"
                                        : plan.features.pipelineStages
                                            .maxStages}{" "}
                                      pipeline stages
                                    </span>
                                  </li>
                                  {plan.features.analytics.advanced && (
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                      <span>Advanced analytics</span>
                                    </li>
                                  )}
                                  {plan.features.apiAccess && (
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                      <span>API access</span>
                                    </li>
                                  )}
                                  {plan.features.prioritySupport && (
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                      <span>Priority support</span>
                                    </li>
                                  )}
                                </ul>
                              </CardContent>
                              <CardFooter>
                                <Button
                                  className="w-full"
                                  onClick={() => handleUpgradeSubscription(id)}
                                  disabled={isLoading}
                                  variant={
                                    id === "free" ? "outline" : "default"
                                  }
                                >
                                  {isLoading
                                    ? "Processing..."
                                    : id === "free"
                                    ? "Downgrade"
                                    : "Upgrade"}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
