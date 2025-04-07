import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  List,
  Plus,
  Search,
  Filter,
  PenTool,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { mockMailActivities } from "../mocks/mockData";
import { MailActivity } from "../types/strategy";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { MailActivityModal } from "../components/MailActivityModal";
import { MailCalendarView } from "../components/MailCalendarView";
import { MailComposer } from "../components/MailComposer";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailComposerSection } from "@/components/MailComposerSection";

type ViewType = "list" | "calendar" | "compose";

const MailPlannerPage: React.FC = () => {
  const [activities, setActivities] =
    useState<MailActivity[]>(mockMailActivities);
  const [activeView, setActiveView] = useState<ViewType>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<MailActivity | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: activitiesData = [], isLoading } = useQuery({
    queryKey: ["mailActivities"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockMailActivities;
    },
  });

  const filteredActivities = useMemo(() => {
    return activitiesData.filter((activity) => {
      const matchesSearch =
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activity.assignedUser.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || activity.status === statusFilter;
      const matchesType = typeFilter === "all" || activity.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [activitiesData, searchQuery, statusFilter, typeFilter]);

  const addActivityMutation = useMutation({
    mutationFn: async (newActivity: Omit<MailActivity, "id">) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const activity: MailActivity = {
        ...newActivity,
        id: Math.random().toString(36).substr(2, 9),
      };
      return activity;
    },
    onSuccess: (newActivity) => {
      queryClient.setQueryData<MailActivity[]>(["mailActivities"], (old) => [
        ...(old || []),
        newActivity,
      ]);
      toast.success("Activity added successfully");
    },
    onError: () => {
      toast.error("Failed to add activity");
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: async (updatedActivity: MailActivity) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updatedActivity;
    },
    onSuccess: (updatedActivity) => {
      queryClient.setQueryData<MailActivity[]>(["mailActivities"], (old) =>
        (old || []).map((activity) =>
          activity.id === updatedActivity.id ? updatedActivity : activity
        )
      );
      toast.success("Activity updated successfully");
    },
    onError: () => {
      toast.error("Failed to update activity");
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return activityId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<MailActivity[]>(["mailActivities"], (old) =>
        (old || []).filter((activity) => activity.id !== deletedId)
      );
      toast.success("Activity deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete activity");
    },
  });

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity: MailActivity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDeleteActivity = (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this activity?")) {
      deleteActivityMutation.mutate(activityId);
    }
  };

  const handleSubmitActivity = (activityData: Omit<MailActivity, "id">) => {
    if (selectedActivity) {
      updateActivityMutation.mutate({
        ...activityData,
        id: selectedActivity.id,
      });
    } else {
      addActivityMutation.mutate(activityData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "planned":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSaveComposedEmail = (emailData: {
    name: string;
    type: string;
    description: string;
    content: string;
  }) => {
    const newActivity: MailActivity = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split("T")[0],
      assignedUser: "Current User",
      status: "Draft",
      ...emailData,
    };

    addActivityMutation.mutate(newActivity);
    setActiveView("list");
    toast.success("Email saved to planner successfully");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mail Planner</h1>
          <p className="text-slate-500">
            Plan and manage your email campaigns and communications
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs
            value={activeView}
            onValueChange={(value: ViewType) => setActiveView(value)}
            className="w-fit"
          >
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="compose" className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                AI Composer
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {activeView !== "compose" && (
            <Button onClick={handleAddActivity}>
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          )}
        </div>
      </div>

      {activeView !== "compose" && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                <SelectItem value="Email Newsletter">
                  Email Newsletter
                </SelectItem>
                <SelectItem value="Email Survey">Email Survey</SelectItem>
                <SelectItem value="Webinar">Webinar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {activeView === "list" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleEditActivity(activity)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{activity.name}</h3>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-2">{activity.type}</p>
              <p className="text-sm mb-2">{activity.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{activity.assignedUser}</span>
                <span>{activity.date}</span>
              </div>
              {activity.metrics && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Open Rate</span>
                    <span>{activity.metrics.openRate}%</span>
                  </div>
                  <Progress value={activity.metrics.openRate} />
                  <div className="flex justify-between text-sm">
                    <span>Click Rate</span>
                    <span>{activity.metrics.clickRate}%</span>
                  </div>
                  <Progress value={activity.metrics.clickRate} />
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate</span>
                    <span>{activity.metrics.conversionRate}%</span>
                  </div>
                  <Progress value={activity.metrics.conversionRate} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeView === "calendar" && (
        <MailCalendarView
          activities={filteredActivities}
          onActivityClick={handleEditActivity}
        />
      )}

      {activeView === "compose" && (
        <MailComposerSection onSave={handleSaveComposedEmail} />
      )}

      <MailActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitActivity}
        activity={selectedActivity}
        onDelete={
          selectedActivity
            ? () => handleDeleteActivity(null, selectedActivity.id)
            : undefined
        }
      />
    </div>
  );
};

export default MailPlannerPage;
