import React, { useState } from "react"; // Import useState
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import mutation hooks
import {
  fetchLeadActivity,
  addLeadActivity,
  updateLead,
  ActivityLogEntry,
} from "@/lib/api"; // Import addLeadActivity and updateLead
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Label } from "@/components/ui/label"; // Import Label
import { Input } from "@/components/ui/input"; // Import Input
import { toast } from "sonner"; // Import toast
import {
  AlertCircle,
  Phone,
  Mail,
  StickyNote,
  Users,
  ArrowRight,
  Calendar, // Generic icon for timestamp
} from "lucide-react"; // Import icons

interface LeadActivityLogProps {
  leadId: string | null; // Accept leadId instead of full lead object
  leadName: string | null; // Pass lead name for the title
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const activityTypes: ActivityLogEntry["type"][] = [
  "Call",
  "Email",
  "Note",
  "Meeting",
]; // Exclude StageChange for manual entry

// Helper to get icon based on activity type
const getActivityIcon = (type: ActivityLogEntry["type"]) => {
  switch (type) {
    case "Call":
      return <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />;
    case "Email":
      return <Mail className="h-4 w-4 mr-2 flex-shrink-0 text-red-500" />;
    case "Note":
      return (
        <StickyNote className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-500" />
      );
    case "Meeting":
      return <Users className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />;
    case "StageChange":
      return (
        <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
      );
    default:
      return <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />;
  }
};

const LeadActivityLog: React.FC<LeadActivityLogProps> = ({
  leadId,
  leadName,
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [newActivityType, setNewActivityType] =
    useState<ActivityLogEntry["type"]>("Note"); // Default to Note
  const [newActivityDetails, setNewActivityDetails] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  // Fetch activity data
  const {
    data: activities,
    isLoading,
    error,
    isFetching, // Use isFetching for subsequent loading states
  } = useQuery<ActivityLogEntry[]>({
    queryKey: ["leadActivity", leadId], // Query key includes leadId
    queryFn: () => fetchLeadActivity(leadId!), // Fetch data using the API function
    enabled: !!leadId && open,
    refetchOnWindowFocus: false,
  });

  // Mutation for adding activity
  const addActivityMutation = useMutation({
    mutationFn: (data: { type: ActivityLogEntry["type"]; details: string }) =>
      addLeadActivity(leadId!, data), // Pass leadId and data
    onSuccess: () => {
      toast.success("Activity added successfully.");
      queryClient.invalidateQueries({ queryKey: ["leadActivity", leadId] }); // Refetch activity log
      // Reset form
      setNewActivityType("Note");
      setNewActivityDetails("");
      setNextFollowUpDate("");
    },
    onError: (error) => {
      toast.error(`Failed to add activity: ${error.message}`);
      console.error("Add activity error:", error);
    },
  });

  // Mutation for updating lead with next follow-up date
  const updateLeadMutation = useMutation({
    mutationFn: updateLead,
    onSuccess: () => {
      toast.success("Next follow-up date updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["leads"] }); // Refetch leads
    },
    onError: (error) => {
      toast.error(`Failed to update next follow-up date: ${error.message}`);
    },
  });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityDetails.trim() || !leadId) {
      toast.warning("Please select a type and enter details.");
      return;
    }

    // Add the activity
    addActivityMutation.mutate({
      type: newActivityType,
      details: newActivityDetails.trim(),
    });

    // Update the lead with next follow-up date and last contact date
    if (leadId) {
      // Get current date in local timezone
      const now = new Date();
      const today = now.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD in local timezone

      updateLeadMutation.mutate({
        id: leadId,
        lastContact: today,
        ...(nextFollowUpDate ? { nextFollowUp: nextFollowUpDate } : {}),
      });
    }
  };

  // Determine the title safely
  const sheetTitle = leadName ? `Activity Log: ${leadName}` : "Activity Log";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>
            History of interactions and notes for this lead.
          </SheetDescription>
        </SheetHeader>

        {/* Activity List with Scroll */}
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : error ? (
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Error loading activity: {error.message}</span>
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities
                .sort(
                  (a, b) =>
                    parseISO(b.timestamp).getTime() -
                    parseISO(a.timestamp).getTime()
                )
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start text-sm border-b pb-2 last:border-b-0"
                  >
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-slate-700">{activity.details}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(
                          parseISO(activity.timestamp),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                        {activity.userId && ` by ${activity.userId}`}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-5">
              No activity recorded for this lead yet.
            </p>
          )}
        </div>

        {/* Add Activity Form */}
        <div className="border-t pt-4 mt-auto">
          <form onSubmit={handleAddActivity} className="space-y-4">
            <h4 className="font-medium text-slate-700">Add New Activity</h4>
            <div className="space-y-2">
              <Label htmlFor="activity-type">Type</Label>
              <Select
                value={newActivityType}
                onValueChange={(value) =>
                  setNewActivityType(value as ActivityLogEntry["type"])
                }
              >
                <SelectTrigger id="activity-type">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center">
                        {getActivityIcon(type)}
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity-details">Details</Label>
              <Textarea
                id="activity-details"
                value={newActivityDetails}
                onChange={(e) => setNewActivityDetails(e.target.value)}
                placeholder="Enter activity details..."
                className="h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next-followup">Next Follow-up Date</Label>
              <Input
                id="next-followup"
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Add Activity
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadActivityLog;
