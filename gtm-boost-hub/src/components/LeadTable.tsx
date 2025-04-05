import React, { useState, useRef, useEffect } from "react"; // Import useRef and useEffect
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Trash,
  MessageCircle,
  MoreHorizontal,
  History,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import AddLeadDialog from "./AddLeadDialog";
import EditLeadDialog from "./EditLeadDialog";
import BulkActions from "./BulkActions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteLead, updateLead } from "@/lib/api";
import LeadActivityLog from "./LeadActivityLog";
import LeadQuickViewSheet from "./LeadQuickViewSheet";
import type { Lead } from "@/types/lead";
import { format, parseISO } from "date-fns";

interface LeadTableProps {
  leads: Lead[];
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Lead["status"]) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [activityLogOpen, setActivityLogOpen] = useState(false);
  const [leadForActivity, setLeadForActivity] = useState<Lead | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [leadForQuickView, setLeadForQuickView] = useState<Lead | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      toast.success(`Lead deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setLeadToDelete(null);
      setDeleteConfirmOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete lead: ${error.message}`);
      console.error("Delete error:", error);
      setLeadToDelete(null);
      setDeleteConfirmOpen(false);
    },
  });

  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "New":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            {status}
          </Badge>
        );
      case "Contacted":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            {status}
          </Badge>
        );
      case "Qualified":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            {status}
          </Badge>
        );
      case "Proposal":
        return (
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
            {status}
          </Badge>
        );
      case "Negotiation":
        return (
          <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
            {status}
          </Badge>
        );
      case "Closed":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            {status}
          </Badge>
        );
      default:
        console.warn(`Unknown lead status encountered: ${status}`);
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number | undefined) => {
    if (score === undefined) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedLeads(checked === true ? leads.map((lead) => lead.id) : []);
  };

  const handleSelectLead = (id: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedLeads((prev) => [...prev, id]);
    } else {
      setSelectedLeads((prev) => prev.filter((leadId) => leadId !== id));
    }
  };

  const handleUpdateStage = (stage: Lead["status"], leadId?: string) => {
    if (leadId) {
      toast.info(`Updating lead ${leadId} to stage: ${stage} (mock).`);
      // TODO: Add mutation call: updateLeadMutation.mutate({ id: leadId, status: stage })
    } else {
      toast.info(
        `Updating ${selectedLeads.length} leads to stage: ${stage} (mock).`
      );
      // TODO: Add bulk mutation call
      setSelectedLeads([]);
    }
  };

  const handleDeleteSelected = () => {
    toast.info(`Deleting ${selectedLeads.length} leads (mock).`);
    // TODO: Implement bulk delete confirmation and mutation
    setSelectedLeads([]);
  };

  const handleEdit = (lead: Lead) => {
    setCurrentLead(lead);
    setEditLeadOpen(true);
  };

  const handleDeleteClick = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (leadToDelete) {
      deleteMutation.mutate(leadToDelete.id);
    }
  };

  const handleViewActivity = (lead: Lead) => {
    setLeadForActivity(lead);
    setActivityLogOpen(true);
  };

  const handleQuickView = (lead: Lead) => {
    setLeadForQuickView(lead);
    setQuickViewOpen(true);
  };

  const handleWhatsApp = (phone: string | undefined) => {
    if (!phone) {
      toast.error("No phone number available for this lead.");
      return;
    }
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp");
  };

  const stageOptions: Lead["status"][] = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Closed",
  ];

  const isAllSelected =
    selectedLeads.length === leads.length && leads.length > 0;
  const isIndeterminate =
    selectedLeads.length > 0 && selectedLeads.length < leads.length;

  // Ref for the header checkbox
  const headerCheckboxRef = useRef<HTMLButtonElement>(null); // Ref for the shadcn Checkbox component

  // Effect to set indeterminate state using the data-state attribute
  useEffect(() => {
    if (headerCheckboxRef.current) {
      // Set data-state attribute for CSS styling, which shadcn/ui uses
      headerCheckboxRef.current.setAttribute(
        "data-state",
        isIndeterminate
          ? "indeterminate"
          : isAllSelected
          ? "checked"
          : "unchecked"
      );
    }
  }, [isIndeterminate, isAllSelected]);

  // Helper function to format date as "6th April, 2025"
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";

    try {
      // First try to parse as ISO date
      let date;
      try {
        date = parseISO(dateString);
      } catch (e) {
        // If ISO parsing fails, try to parse as YYYY-MM-DD
        const parts = dateString.split("-");
        if (parts.length === 3) {
          date = new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2])
          );
        } else {
          throw new Error("Invalid date format");
        }
      }

      const day = date.getDate();
      const month = format(date, "MMMM");
      const year = date.getFullYear();

      // Add ordinal suffix to day
      const ordinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if parsing fails
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <BulkActions
            selectedCount={selectedLeads.length}
            onUpdateStage={handleUpdateStage}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  ref={headerCheckboxRef}
                  className="rounded-sm"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>CONTACT INFO</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>STAGE</TableHead>
              <TableHead>LAST CONTACT</TableHead>
              <TableHead>NEXT FOLLOW-UP</TableHead>
              <TableHead>SCORE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow
                  key={lead.id}
                  data-state={selectedLeads.includes(lead.id) ? "selected" : ""}
                >
                  <TableCell>
                    <Checkbox
                      className="rounded-sm"
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={(checked) =>
                        handleSelectLead(lead.id, checked)
                      }
                      aria-label={`Select row for ${lead.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      {lead.title && (
                        <div className="text-xs text-slate-500">
                          {lead.title}
                        </div>
                      )}
                      <div className="text-sm text-slate-500 mt-1">
                        {lead.company}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{lead.email}</div>
                      <div className="text-sm text-slate-500">{lead.phone}</div>
                      {lead.location && (
                        <div className="text-xs text-slate-500 mt-1 flex items-center">
                          <span>{lead.location}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{lead.category || "N/A"}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={lead.status}
                      onValueChange={(value) =>
                        handleUpdateStage(value as Lead["status"], lead.id)
                      }
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue>{getStatusBadge(lead.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {stageOptions.map((stage) => (
                          <SelectItem
                            key={stage}
                            value={stage}
                            className="text-xs"
                          >
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatDate(lead.lastContact)}</TableCell>
                  <TableCell>{formatDate(lead.nextFollowUp)}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${getScoreColor(lead.score)}`}
                    >
                      {lead.score || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleQuickView(lead);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Quick View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleViewActivity(lead);
                          }}
                        >
                          <History className="h-4 w-4 mr-2" />
                          View Activity
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleEdit(lead);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleWhatsApp(lead.phone);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center text-red-600"
                          onSelect={(e) => {
                            e.preventDefault();
                            handleDeleteClick(lead);
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {currentLead && (
        <EditLeadDialog
          lead={currentLead}
          open={editLeadOpen}
          onOpenChange={setEditLeadOpen}
        />
      )}

      {leadToDelete && (
        <AlertDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lead</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {leadToDelete.name}? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {leadForActivity && (
        <LeadActivityLog
          leadId={leadForActivity.id}
          leadName={leadForActivity.name}
          open={activityLogOpen}
          onOpenChange={setActivityLogOpen}
        />
      )}

      {leadForQuickView && (
        <LeadQuickViewSheet
          lead={leadForQuickView}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      )}
    </>
  );
};

export default LeadTable;
