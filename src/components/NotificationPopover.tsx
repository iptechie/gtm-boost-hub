import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Lead } from "./LeadTable";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  MessageSquare,
  FileText,
  Edit,
  Trash,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

interface NotificationPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leads: Lead[];
  handleWhatsApp: (phone: string) => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  open,
  onOpenChange,
  leads,
  handleWhatsApp,
}) => {
  const handleEdit = (lead: Lead) => {
    toast.info("Edit feature coming soon");
  };

  const handleDelete = (id: string) => {
    toast.success(`Lead ${id} deleted`);
  };

  // Remove the redundant Popover and PopoverContent wrappers
  return (
    <>
      {leads.length === 0
        ? null // Replaced the <p> tag with null when leads are empty
        : leads.map((lead) => (
            <div key={lead.id} className="mb-4">
              <h3 className="text-lg font-semibold">{lead.name}</h3>
              <p className="text-sm text-slate-500">{lead.designation}</p>
              <p className="text-sm text-slate-500">{lead.company}</p>
              <p className="text-sm">{lead.contactInfo.email}</p>
              <p className="text-sm text-slate-500">{lead.contactInfo.phone}</p>
              <div className="flex space-x-2 mt-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    window.open(`https://example.com/lead/${lead.id}`, "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toast.info("Message feature coming soon")}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toast.info("View details feature coming soon")}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleWhatsApp(lead.contactInfo.phone)}
                  className="text-green-600"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(lead)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => handleDelete(lead.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
    </>
  );
};

export default NotificationPopover;
