import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Trash2 } from "lucide-react";
import { MailActivity } from "../types/strategy";

interface MailActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: Omit<MailActivity, "id">) => void;
  activity?: MailActivity;
  onDelete?: () => void;
}

export const MailActivityModal: React.FC<MailActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activity,
  onDelete,
}) => {
  const [formData, setFormData] = React.useState<Omit<MailActivity, "id">>({
    name: activity?.name || "",
    type: activity?.type || "Email Campaign",
    date: activity?.date || "",
    assignedUser: activity?.assignedUser || "",
    status: activity?.status || "Planned",
    description: activity?.description || "",
    targetAudience: activity?.targetAudience || "",
    metrics: activity?.metrics || {
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      onDelete?.();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Edit Activity" : "Add New Activity"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Activity Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedUser">Assigned To</Label>
              <Input
                id="assignedUser"
                value={formData.assignedUser}
                onChange={(e) =>
                  setFormData({ ...formData, assignedUser: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as "Planned" | "In Progress" | "Completed",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData({ ...formData, targetAudience: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openRate">Open Rate (%)</Label>
              <Input
                id="openRate"
                type="number"
                min="0"
                max="100"
                value={formData.metrics?.openRate || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      openRate: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clickRate">Click Rate (%)</Label>
              <Input
                id="clickRate"
                type="number"
                min="0"
                max="100"
                value={formData.metrics?.clickRate || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      clickRate: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
              <Input
                id="conversionRate"
                type="number"
                min="0"
                max="100"
                value={formData.metrics?.conversionRate || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      conversionRate: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {activity && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
