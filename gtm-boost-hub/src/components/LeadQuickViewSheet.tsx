import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Lead } from "./LeadTable"; // Assuming Lead type is exported from LeadTable or a shared types file

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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick View: {lead.name}</SheetTitle>
          <SheetDescription>Key details for this lead.</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-3">
          <p>
            <strong>Company:</strong> {lead.company}
          </p>
          <p>
            <strong>Designation:</strong> {lead.designation || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {lead.status}
          </p>
          <p>
            <strong>Score:</strong> {lead.score}%
          </p>
          <p>
            <strong>Email:</strong> {lead.contactInfo.email}
          </p>
          <p>
            <strong>Phone:</strong> {lead.contactInfo.phone}
          </p>
          <p>
            <strong>Location:</strong> {lead.location || "N/A"}
          </p>
          <p>
            <strong>Last Contact:</strong> {lead.lastContact}
          </p>
          <p>
            <strong>Next Follow-up:</strong> {lead.nextFollowUp || "N/A"}
          </p>
        </div>
        <div className="mt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadQuickViewSheet;
