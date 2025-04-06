import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/types/lead";
import { format } from "date-fns";

interface LeadQuickViewSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeadQuickViewSheet: React.FC<LeadQuickViewSheetProps> = ({
  lead,
  open,
  onOpenChange,
}) => {
  if (!lead) return null;

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch (error) {
      return date;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Quick View: {lead.name}</SheetTitle>
          <SheetDescription>Key details for this lead.</SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-500">Basic Info</h4>
            <div className="grid gap-2">
              <div>
                <span className="font-medium">Company:</span>{" "}
                {lead.company || "N/A"}
              </div>
              <div>
                <span className="font-medium">Title:</span>{" "}
                {lead.title || "N/A"}
              </div>
              <div>
                <span className="font-medium">Location:</span>{" "}
                {lead.location || "N/A"}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-500">
              Contact Details
            </h4>
            <div className="grid gap-2">
              <div>
                <span className="font-medium">Email:</span>{" "}
                {lead.email || "N/A"}
              </div>
              <div>
                <span className="font-medium">Phone:</span>{" "}
                {lead.phone || "N/A"}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-500">Lead Status</h4>
            <div className="grid gap-2">
              <div>
                <span className="font-medium">Status:</span>{" "}
                <Badge variant="outline">{lead.status}</Badge>
              </div>
              <div>
                <span className="font-medium">Category:</span>{" "}
                {lead.category || "N/A"}
              </div>
              <div>
                <span className="font-medium">Score:</span>{" "}
                <span
                  className={
                    lead.score && lead.score >= 80
                      ? "text-green-600"
                      : lead.score && lead.score >= 50
                      ? "text-amber-600"
                      : "text-red-600"
                  }
                >
                  {lead.score || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-500">
              Follow-up Info
            </h4>
            <div className="grid gap-2">
              <div>
                <span className="font-medium">Last Contact:</span>{" "}
                {formatDate(lead.lastContact)}
              </div>
              <div>
                <span className="font-medium">Next Follow-up:</span>{" "}
                {formatDate(lead.nextFollowUp)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadQuickViewSheet;
