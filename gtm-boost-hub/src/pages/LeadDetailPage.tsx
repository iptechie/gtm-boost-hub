import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FeatureGate } from "@/components/FeatureGate";

// Icons
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Calendar,
  Clock,
  Edit,
  Trash,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  FileText,
  Activity,
  BarChart,
  Tag,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

// Components
import LeadEmails from "@/components/LeadEmails";
import { fetchLeads } from "@/lib/api";
import type { Lead } from "@/types/lead";

const LeadDetailPage: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canAccessIntegrationFeature } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  const [lead, setLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch lead data
  const { data: leadsData, isLoading: queryLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
    enabled: !!leadId,
  });

  useEffect(() => {
    if (leadsData) {
      const foundLead = leadsData.find((l) => l.id === leadId);
      setLead(foundLead || null);
      setIsLoading(false);
    }
  }, [leadsData, leadId]);

  const handleToggleStarred = async () => {
    if (!lead) return;
    try {
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLead((prev) =>
        prev ? { ...prev, isStarred: !prev.isStarred } : null
      );
      toast.success(lead.isStarred ? "Lead unstarred" : "Lead starred");
    } catch (error) {
      toast.error("Failed to update lead");
    }
  };

  const handleDeleteLead = async () => {
    if (!lead) return;
    setIsDeleting(true);
    try {
      // In a real app, this would delete from Supabase
      // const { error } = await supabase
      //   .from("leads")
      //   .delete()
      //   .eq("id", lead.id);
      // if (error) throw error;

      toast.success("Lead deleted successfully");
      navigate("/leads");
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "unqualified":
        return "bg-red-100 text-red-800";
      case "converted":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-gray-100 text-gray-800";
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (queryLoading || isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold">Lead not found</h1>
        <p className="text-muted-foreground">
          The requested lead could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <p className="text-muted-foreground">{lead.company}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleStarred}
            className={lead.isStarred ? "text-yellow-500" : ""}
          >
            <Star className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDeleteLead}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{lead.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{lead.phone || "No phone number"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{lead.company}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{lead.location || "No location"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{lead.website || "No website"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant={lead.status === "Closed" ? "default" : "outline"}>
                {lead.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Score</p>
              <Badge variant="outline">{lead.score}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Tags</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {lead.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground mt-1">
                {lead.notes || "No notes"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button className="w-full" variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
            <Button className="w-full" variant="outline">
              <Tag className="h-4 w-4 mr-2" />
              Add Tags
            </Button>
            <Button className="w-full" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Log Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Overview</CardTitle>
              <CardDescription>
                Summary of lead information and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Last contacted:{" "}
                        {new Date(lead.lastContact).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Total interactions: {lead.interactions || 0}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Pipeline Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Stage: {lead.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Value: ${lead.value?.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Activity timeline would go here */}
              <p className="text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <FeatureGate integrationFeature="email">
            <LeadEmails leadId={leadId!} />
          </FeatureGate>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Add and view notes about this lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Notes section would go here */}
              <p className="text-muted-foreground">No notes yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadDetailPage;
