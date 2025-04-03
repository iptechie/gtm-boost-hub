import React, { useState } from "react";
// Removed Header import
// Removed Sidebar import
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, List } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MailPlannerPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewType, setViewType] = useState<"calendar" | "list">("list");

  // Mock activities data
  const activities = [
    {
      id: "1",
      name: "Welcome Email Sequence",
      type: "Email Campaign",
      date: "2023-06-15",
      assignedUser: "John Doe",
      status: "Completed",
    },
    {
      id: "2",
      name: "Product Update Announcement",
      type: "Email Newsletter",
      date: "2023-06-20",
      assignedUser: "Sarah Lee",
      status: "In Progress",
    },
    {
      id: "3",
      name: "Customer Feedback Survey",
      type: "Email Survey",
      date: "2023-06-25",
      assignedUser: "Mike Johnson",
      status: "Planned",
    },
    {
      id: "4",
      name: "Summer Promotion",
      type: "Email Campaign",
      date: "2023-07-01",
      assignedUser: "Alex Wong",
      status: "Planned",
    },
    {
      id: "5",
      name: "Webinar Invitation",
      type: "Webinar",
      date: "2023-07-05",
      assignedUser: "Jennifer Smith",
      status: "Planned",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            {status}
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            {status}
          </Badge>
        );
      case "Planned":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddActivity = () => {
    toast.success("Add activity feature will be available in the next update");
  };

  // Removed outer layout divs and Sidebar/Header components
  return (
    <>
      {" "}
      {/* Use Fragment as the top-level element */}
      {/* Header content (buttons) is removed as it's handled by MainLayout now */}
      {/* If these buttons are specific to this page, they need to be moved inside the page content */}
      {/* For now, assuming they were generic header actions */}
      {/* Removed wrapping div, content starts directly */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-slate-700">
          Plan and schedule your lead generation activities
        </h2>
        <p className="text-slate-500">
          Organize email campaigns, webinars, and other outreach efforts.
        </p>
        {/* Consider moving view toggle buttons here if specific to this page */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={viewType === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("list")}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
          <Button
            variant={viewType === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("calendar")}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Calendar
          </Button>
          {/* Consider moving Add Activity button here */}
          <Button
            className="btn-gradient flex items-center gap-2 ml-auto" // Added ml-auto
            onClick={handleAddActivity}
          >
            <Plus className="h-4 w-4" />
            Add Activity
          </Button>
        </div>
      </div>
      {viewType === "calendar" ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="glass-card p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="glass-card p-6">
              <h3 className="font-medium text-slate-700 mb-4">
                {date
                  ? date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No date selected"}
              </h3>
              <div className="space-y-4">
                {activities
                  .filter(
                    (activity) =>
                      new Date(activity.date).toDateString() ===
                      date?.toDateString()
                  )
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{activity.name}</h4>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {activity.type}
                      </p>
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>Assigned to: {activity.assignedUser}</span>
                        <span>{activity.date}</span>
                      </div>
                    </div>
                  ))}
                {activities.filter(
                  (activity) =>
                    new Date(activity.date).toDateString() ===
                    date?.toDateString()
                ).length === 0 && (
                  <p className="text-center text-slate-500 py-4">
                    No activities scheduled for this date
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ACTIVITY NAME</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>ASSIGNED TO</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="table-row-hover">
                  <TableCell>
                    <div className="font-medium">{activity.name}</div>
                  </TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.assignedUser}</TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info("Edit feature coming soon")}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500"
                        onClick={() => toast.info("Delete feature coming soon")}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Removed closing divs for layout */}
    </>
  );
};

export default MailPlannerPage;
