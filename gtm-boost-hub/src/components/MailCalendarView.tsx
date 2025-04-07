import React from "react";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MailActivity } from "../types/strategy";

interface MailCalendarViewProps {
  activities: MailActivity[];
  onActivityClick: (activity: MailActivity) => void;
}

export const MailCalendarView: React.FC<MailCalendarViewProps> = ({
  activities,
  onActivityClick,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

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

  const getActivitiesForDate = (date: Date) => {
    return activities.filter(
      (activity) =>
        new Date(activity.date).toDateString() === date.toDateString()
    );
  };

  const selectedDateActivities = selectedDate
    ? getActivitiesForDate(selectedDate)
    : [];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
          />
        </Card>
      </div>
      <div className="md:w-2/3">
        <Card className="p-6">
          <h3 className="font-medium text-lg mb-4">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "No date selected"}
          </h3>
          <div className="space-y-4">
            {selectedDateActivities.length > 0 ? (
              selectedDateActivities.map((activity) => (
                <Card
                  key={activity.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onActivityClick(activity)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{activity.name}</h4>
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
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No activities scheduled for this date
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
