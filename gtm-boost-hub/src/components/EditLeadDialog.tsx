import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Lead } from "./LeadTable";
import { updateLead } from "@/lib/api"; // Import the API function

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

// Define a type for the form values, including potential differences from Lead type
type EditFormValues = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string; // Corresponds to designation
  source?: string;
  location?: string;
  linkedin?: string;
  stage?: string; // Corresponds to status
  score?: number | string; // Input might be string
  value?: number | string; // Add value field (can be string from input)
  lastContact?: string; // Date string
  nextFollowUp?: string; // Date string
  notes?: string;
  // Include other fields from Lead if they are editable
  category?: string;
  industry?: string;
};

const EditLeadDialog: React.FC<EditLeadDialogProps> = ({
  open,
  onOpenChange,
  lead,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showAddCommunication, setShowAddCommunication] = useState(false);
  const [formValues, setFormValues] = useState<EditFormValues>({});
  const queryClient = useQueryClient();

  // Initialize form state when lead data is available or changes
  useEffect(() => {
    if (lead) {
      // Format dates for input type="date" (YYYY-MM-DD) if necessary
      const formatDateForInput = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
          // Attempt to create a date and format it. Handle potential invalid date strings.
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split("T")[0];
          }
        } catch (e) {
          console.error("Error formatting date:", dateString, e);
        }
        // Return original or empty if formatting fails or date is invalid
        // Check if it already looks like YYYY-MM-DD
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString) ? dateString : "";
      };

      setFormValues({
        name: lead.name,
        email: lead.contactInfo?.email,
        phone: lead.contactInfo?.phone,
        company: lead.company,
        title: lead.designation,
        source: lead.category, // Assuming category maps to source in this form? Adjust if needed.
        location: lead.location || "", // Initialize location from lead data
        linkedin: "", // Add if linkedin is part of Lead type
        stage: lead.status,
        score: lead.score,
        value: lead.value || "", // Initialize value, default to empty string if undefined
        lastContact: formatDateForInput(lead.lastContact),
        nextFollowUp: formatDateForInput(lead.nextFollowUp),
        notes: "", // Add if notes are part of Lead type
        category: lead.category,
        industry: lead.industry,
      });
    } else {
      setFormValues({}); // Reset if no lead
    }
  }, [lead]);

  const updateLeadMutation = useMutation({
    mutationFn: updateLead,
    onSuccess: (data) => {
      toast.success(`Lead "${data.name}" updated successfully`);
      queryClient.invalidateQueries({ queryKey: ["leads"] }); // Invalidate leads query
      // Optionally invalidate specific lead query if you have one
      // queryClient.invalidateQueries({ queryKey: ['lead', data.id] });
      onOpenChange(false); // Close dialog
    },
    onError: (error) => {
      toast.error(`Failed to update lead: ${error.message}`);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    // Handle number input specifically if needed
    const finalValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormValues((prev) => ({ ...prev, [id]: finalValue }));
  };

  const handleSelectChange = (id: keyof EditFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("[EditLeadDialog] handleSubmit called"); // Removed log
    if (!lead) {
      // console.error("[EditLeadDialog] No lead data available in handleSubmit"); // Removed log
      return;
    }

    // Construct the updated lead data for the API call
    const updatedLeadData: Partial<Lead> & { id: string } = {
      id: lead.id,
      name: formValues.name,
      company: formValues.company,
      contactInfo: {
        email: formValues.email || "",
        phone: formValues.phone || "",
      },
      designation: formValues.title,
      status: formValues.stage, // Use 'stage' from form state
      category: formValues.category, // Use 'category' from form state
      industry: formValues.industry, // Use 'industry' from form state
      lastContact: formValues.lastContact,
      nextFollowUp: formValues.nextFollowUp,
      score: Number(formValues.score) || 0,
      value: Number(formValues.value) || 0, // Add value, default to 0 if invalid/empty
      // Add other fields if they are part of the Lead type and editable
      location: formValues.location, // Include location in update data
      // linkedin: formValues.linkedin,
      // notes: formValues.notes,
      // source: formValues.source, // If source is different from category
    };

    // Remove undefined fields before sending? Optional, depends on API.
    // Object.keys(updatedLeadData).forEach(key => updatedLeadData[key] === undefined && delete updatedLeadData[key]);

    // console.log("[EditLeadDialog] Data being sent to mutation:", updatedLeadData); // Removed log
    updateLeadMutation.mutate(updatedLeadData);
  };

  // --- Communication History Logic (Placeholder) ---
  const handleAddCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement mutation for adding communication log
    toast.info("Adding communication feature coming soon.");
    setShowAddCommunication(false);
  };

  const sourceOptions = [
    "Website",
    "Email",
    "Web Form",
    "LinkedIn",
    "Database",
    "Instagram",
    "Facebook",
    "Custom",
  ];
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
  const communicationModes = [
    "Email",
    "Mobile",
    "Meeting",
    "WhatsApp",
    "Message",
  ];
  const categoryOptions = ["MNC", "Large Domestic", "Regional", "Local"]; // Added based on AddLeadDialog
  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Media",
    "Transportation",
    "Energy",
    "Other",
  ]; // Added

  if (!lead) return null; // Don't render if no lead data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
          <DialogDescription>
            View and manage lead information and communication history.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Contact Information Section */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="name"
                        value={formValues.name || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formValues.email || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        value={formValues.phone || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">
                        Company
                      </label>
                      <Input
                        id="company"
                        value={formValues.company || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Job Title
                      </label>
                      <Input
                        id="title"
                        placeholder="e.g. Marketing Manager"
                        value={formValues.title || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id="location"
                        placeholder="e.g. New York, USA"
                        value={formValues.location || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* Assuming 'source' here maps to lead.category initially */}
                    <div className="space-y-2">
                      <label htmlFor="source" className="text-sm font-medium">
                        Source
                      </label>
                      <Select
                        value={formValues.source || ""}
                        onValueChange={(value) =>
                          handleSelectChange("source", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceOptions.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id="location"
                        placeholder="e.g. New York, USA"
                        value={formValues.location || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="linkedin" className="text-sm font-medium">
                        LinkedIn
                      </label>
                      <Input
                        id="linkedin"
                        placeholder="LinkedIn profile URL"
                        value={formValues.linkedin || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* LinkedIn input moved here to keep grid even */}
                    <div className="space-y-2">
                      <label htmlFor="linkedin" className="text-sm font-medium">
                        LinkedIn
                      </label>
                      <Input
                        id="linkedin"
                        placeholder="LinkedIn profile URL"
                        value={formValues.linkedin || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Lead Status Section */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">
                    Lead Status & Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="stage" className="text-sm font-medium">
                        Current Stage
                      </label>
                      <Select
                        value={formValues.stage || ""}
                        onValueChange={(value) =>
                          handleSelectChange("stage", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {stageOptions.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="score" className="text-sm font-medium">
                        Lead Score
                      </label>
                      <Input
                        id="score"
                        type="number"
                        value={formValues.score || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* Add Value Input */}
                    <div className="space-y-2">
                      <label htmlFor="value" className="text-sm font-medium">
                        Value ($)
                      </label>
                      <Input
                        id="value"
                        type="number"
                        placeholder="e.g. 15000"
                        value={formValues.value || ""}
                        onChange={handleInputChange}
                        min="0" // Optional: prevent negative values
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <Select
                        value={formValues.category || ""}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="industry" className="text-sm font-medium">
                        Industry
                      </label>
                      <Select
                        value={formValues.industry || ""}
                        onValueChange={(value) =>
                          handleSelectChange("industry", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastContact"
                        className="text-sm font-medium"
                      >
                        Last Contact
                      </label>
                      <Input
                        id="lastContact"
                        type="date"
                        value={formValues.lastContact || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="nextFollowUp"
                        className="text-sm font-medium"
                      >
                        Next Follow-up
                      </label>
                      <Input
                        id="nextFollowUp"
                        type="date"
                        value={formValues.nextFollowUp || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">
                    Additional Information
                  </h3>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Notes
                    </label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional notes about the lead"
                      value={formValues.notes || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="btn-gradient"
                  disabled={updateLeadMutation.isPending}
                >
                  {updateLeadMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Activity Tab Content (Placeholder) */}
          <TabsContent value="activity" className="mt-4">
            {/* Add Communication Form Toggle */}
            {showAddCommunication ? (
              <div className="bg-white p-5 rounded-lg border mb-4">
                <h3 className="font-medium text-lg mb-3">Add Communication</h3>
                <form onSubmit={handleAddCommunication}>
                  {/* Form fields for adding communication */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Mode of Communication
                      </label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {communicationModes.map((mode) => (
                            <SelectItem key={mode} value={mode.toLowerCase()}>
                              {mode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        placeholder="Describe the communication details"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddCommunication(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="btn-gradient">
                        Add Communication
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex justify-end mb-4">
                <Button
                  className="btn-gradient"
                  onClick={() => setShowAddCommunication(true)}
                >
                  Add Communication
                </Button>
              </div>
            )}

            {/* Communication History (Placeholder) */}
            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-lg mb-3">
                Communication History
              </h3>
              <div className="space-y-2">
                {/* Display actual history here */}
                <div className="text-center py-8 text-slate-500">
                  Communication history coming soon...
                </div>
              </div>
            </div>

            {/* Activity History (Placeholder) */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-3">Activity History</h3>
              <div className="text-center py-8 text-slate-500">
                Activity history coming soon...
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
