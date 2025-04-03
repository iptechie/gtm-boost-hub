import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import mutation hooks
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
  MessageCircle, // WhatsApp icon
  MoreHorizontal, // Dropdown trigger
  MapPin, // Location icon
  Slack, // Slack icon
  History, // Activity Log icon
  Eye, // Quick View icon
  AlertCircle, // Delete confirmation icon
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { deleteLead } from "@/lib/api";
import LeadActivityLog from "./LeadActivityLog"; // Import the new component
import LeadQuickViewSheet from "./LeadQuickViewSheet"; // Import the new component

export interface Lead {
  id: string;
  name: string;
  designation?: string;
  company: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  location?: string;
  value?: number;
  status: string; // Represents the pipeline stage ID
  category?: string;
  industry?: string;
  lastContact: string;
  nextFollowUp: string;
  score: number;
  slackUrl?: string; // Added optional Slack URL field
}

interface LeadTableProps {
  leads: Lead[];
}

// Removed inline component definitions

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

  const queryClient = useQueryClient(); // Get query client instance

  // Mutation for deleting a lead
  const deleteMutation = useMutation({
    mutationFn: deleteLead, // Use the API function
    onSuccess: (_, deletedLeadId) => {
      toast.success(`Lead deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ["leads"] }); // Refetch leads list
      setLeadToDelete(null); // Clear the lead marked for deletion
      setDeleteConfirmOpen(false); // Close the dialog
    },
    onError: (error, deletedLeadId) => {
      toast.error(`Failed to delete lead: ${error.message}`);
      console.error("Delete error:", error);
      setLeadToDelete(null); // Clear the lead even on error
      setDeleteConfirmOpen(false); // Close the dialog
    },
  });

  const getStatusBadge = (status: string) => {
    // Badge logic remains the same...
    switch (status) {
      case "New":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            {status}
          </Badge>
        );
      case "Qualified":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            {status}
          </Badge>
        );
      case "Won":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            {status}
          </Badge>
        );
      case "Lost":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((lead) => lead.id));
    }
  };

  const handleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter((leadId) => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const handleUpdateStage = (stage: string, leadId?: string) => {
    // Mock update logic
    if (leadId) {
      toast.success(`Updated lead ${leadId} to stage: ${stage} (mock).`);
      // TODO: Add mutation call here
    } else {
      toast.success(
        `Updated ${selectedLeads.length} leads to stage: ${stage} (mock).`
      );
      // TODO: Add bulk mutation call here
      setSelectedLeads([]);
    }
  };

  const handleDeleteSelected = () => {
    // TODO: Implement bulk delete confirmation and mutation
    toast.success(`Deleted ${selectedLeads.length} leads (mock).`);
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

  // Updated confirmDelete to use the mutation
  const confirmDelete = () => {
    if (leadToDelete) {
      deleteMutation.mutate(leadToDelete.id); // Call the mutation
    }
  };

  const handleViewActivity = (lead: Lead) => {
    // Set the ID and name, not the whole lead object
    setLeadForActivity(lead); // Keep setting the full lead temporarily for the name prop
    setActivityLogOpen(true);
  };

  const handleQuickView = (lead: Lead) => {
    setLeadForQuickView(lead);
    setQuickViewOpen(true);
  };

  const handleWhatsApp = (phone: string) => {
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp");
  };

  // Assuming stage options might come from API/context later
  const stageOptions = [
    "New",
    "Contacted",
    "Qualified",
    "Discovery Meeting",
    "Demo",
    "Proposal",
    "Negotiation",
    "Won",
    "Lost",
  ];

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
        {/* Other header elements if needed */}
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  className="rounded-sm"
                  checked={
                    selectedLeads.length === leads.length && leads.length > 0
                  }
                  onCheckedChange={handleSelectAll}
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
            {leads.map((lead) => (
              <TableRow key={lead.id} className="table-row-hover">
                <TableCell>
                  <Checkbox
                    className="rounded-sm"
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => handleSelectLead(lead.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    {lead.designation && (
                      <div className="text-xs text-slate-500">
                        {lead.designation}
                      </div>
                    )}
                    <div className="text-sm text-slate-500 mt-1">
                      {lead.company}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{lead.contactInfo.email}</div>
                    <div className="text-sm text-slate-500">
                      {lead.contactInfo.phone}
                    </div>
                    {lead.location && (
                      <div className="text-xs text-slate-500 mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{lead.location}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{lead.category || "N/A"}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={lead.status}
                    onValueChange={(value) => handleUpdateStage(value, lead.id)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>{getStatusBadge(lead.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{lead.lastContact}</TableCell>
                <TableCell>{lead.nextFollowUp}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getScoreColor(lead.score)}`}>
                    {lead.score}%
                  </span>
                </TableCell>
                {/* Add stopPropagation and preventDefault to the TableCell */}
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <DropdownMenu>
                    {/* Remove asChild and the inner Button */}
                    <DropdownMenuTrigger
                      onClick={(e) => e.stopPropagation()} // Keep stopPropagation just in case
                      className="p-2 rounded hover:bg-gray-100" // Add basic styling
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {/* Slack Button - Conditional */}
                      {lead.slackUrl && (
                        <DropdownMenuItem
                          onClick={() => window.open(lead.slackUrl, "_blank")}
                        >
                          <Slack className="mr-2 h-4 w-4" />
                          <span>Open Slack</span>
                        </DropdownMenuItem>
                      )}
                      {/* View Activity Button */}
                      <DropdownMenuItem
                        onClick={() => handleViewActivity(lead)}
                      >
                        <History className="mr-2 h-4 w-4" />
                        <span>View Activity</span>
                      </DropdownMenuItem>
                      {/* Quick View Button */}
                      <DropdownMenuItem onClick={() => handleQuickView(lead)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Quick View</span>
                      </DropdownMenuItem>
                      {/* WhatsApp Button */}
                      <DropdownMenuItem
                        onClick={() => handleWhatsApp(lead.contactInfo.phone)}
                        className="text-green-600 focus:text-green-700"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>WhatsApp</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {/* Edit Button */}
                      <DropdownMenuItem onClick={() => handleEdit(lead)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      {/* Delete Button - Removed AlertDialogTrigger again */}
                      <DropdownMenuItem
                        // onSelect={(e) => e.preventDefault()} // Keep dropdown open if needed later
                        onClick={() => handleDeleteClick(lead)} // Directly call handler
                        className="text-red-500 focus:text-red-700"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs and Sheets */}
      <AddLeadDialog open={addLeadOpen} onOpenChange={setAddLeadOpen} />
      <EditLeadDialog
        open={editLeadOpen}
        onOpenChange={setEditLeadOpen}
        lead={currentLead}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lead "{leadToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLeadToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activity Log Sheet - Pass leadId and leadName */}
      <LeadActivityLog
        leadId={leadForActivity?.id ?? null}
        leadName={leadForActivity?.name ?? null}
        open={activityLogOpen}
        onOpenChange={setActivityLogOpen}
      />

      {/* Quick View Sheet */}
      <LeadQuickViewSheet
        lead={leadForQuickView}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
};

export default LeadTable;
