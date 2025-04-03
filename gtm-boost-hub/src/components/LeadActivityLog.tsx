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
  ActivityLogEntry,
} from "@/lib/api"; // Import addLeadActivity
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
    },
    onError: (error) => {
      toast.error(`Failed to add activity: ${error.message}`);
      console.error("Add activity error:", error);
    },
  });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityDetails.trim() || !leadId) {
      toast.warning("Please select a type and enter details.");
      return;
    }
    addActivityMutation.mutate({
      type: newActivityType,
      details: newActivityDetails.trim(),
    });
  };

  // Determine the title safely
  const sheetTitle = leadName ? `Activity Log: ${leadName}` : "Activity Log";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        {" "}
        {/* Adjust width if needed */}
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
          <SheetDescription>
            History of interactions and notes for this lead.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(100vh-150px)]">
          {" "}
          {/* Add scroll */}
          {isLoading ? (
            // Show skeletons while loading
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : error ? (
            // Show error message
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Error loading activity: {error.message}</span>
            </div>
          ) : activities && activities.length > 0 ? (
            // Display activities
            activities
              .sort(
                (a, b) =>
                  parseISO(b.timestamp).getTime() -
                  parseISO(a.timestamp).getTime()
              ) // Sort descending by timestamp
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
              ))
          ) : (
            // Show message if no activities found
            <p className="text-slate-500 text-center py-5">
              No activity recorded for this lead yet.
            </p>
          )}
        </div>
        <div className="mt-auto pt-4 border-t">
          {" "}
          {/* Footer with close button */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
        {/* Add Activity Form */}
        <div className="mt-6 pt-4 border-t">
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
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-details">Details</Label>
              <Textarea
                id="activity-details"
                placeholder="Enter details about the activity..."
                value={newActivityDetails}
                onChange={(e) => setNewActivityDetails(e.target.value)}
                rows={3}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={
                addActivityMutation.isPending || !newActivityDetails.trim()
              }
            >
              {addActivityMutation.isPending ? "Adding..." : "Add Activity"}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadActivityLog;
