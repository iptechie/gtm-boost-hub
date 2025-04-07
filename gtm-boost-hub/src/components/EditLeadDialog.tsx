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
import type { Lead } from "@/types/lead"; // Import the primary Lead type
import { updateLead } from "@/lib/api"; // Import the API function
import { Label } from "@/components/ui/label"; // Import Label

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead; // Use the primary Lead type
}

// Define a type for the form values, aligned with editable fields in the primary Lead type
type EditFormValues = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  linkedinUrl?: string; // Changed from linkedin
  status?: Lead["status"]; // Use status type from Lead
  score?: number | string; // Input might be string
  notes?: string;
  industry?: string;
  // Add other editable fields from Lead type if needed (e.g., engagement, companySize, budget, timeline)
  engagement?: number | string;
  companySize?: number | string;
  budget?: number | string;
  timeline?: Lead["timeline"];
  instagramUrl?: string;
  twitterUrl?: string;
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
      setFormValues({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        title: lead.title || "",
        source: lead.source || "",
        linkedinUrl: lead.linkedinUrl || "",
        status: lead.status || "New",
        score: lead.score ?? "", // Use ?? for score
        notes: lead.notes || "",
        industry: lead.industry || "",
        engagement: lead.engagement ?? "",
        companySize: lead.companySize ?? "",
        budget: lead.budget ?? "",
        timeline: lead.timeline,
        instagramUrl: lead.instagramUrl || "",
        twitterUrl: lead.twitterUrl || "",
      });
    } else {
      setFormValues({}); // Reset if no lead
    }
  }, [lead]);

  const updateLeadMutation = useMutation({
    mutationFn: updateLead,
    onSuccess: (data) => {
      toast.success(`Lead "${data.name}" updated successfully`);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
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
    const finalValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormValues((prev) => ({ ...prev, [id]: finalValue }));
  };

  const handleSelectChange = (id: keyof EditFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) {
      return;
    }

    // Construct the updated lead data for the API call, aligning with Lead type
    const updatedLeadData: Partial<Lead> & { id: string } = {
      id: lead.id,
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      company: formValues.company,
      title: formValues.title,
      source: formValues.source,
      linkedinUrl: formValues.linkedinUrl,
      status: formValues.status,
      score: Number(formValues.score) || undefined, // Convert score back to number or undefined
      notes: formValues.notes,
      industry: formValues.industry,
      engagement: Number(formValues.engagement) || undefined,
      companySize: Number(formValues.companySize) || undefined,
      budget: Number(formValues.budget) || undefined,
      timeline: formValues.timeline,
      instagramUrl: formValues.instagramUrl,
      twitterUrl: formValues.twitterUrl,
      // Ensure all fields expected by the API are included
    };

    // Remove undefined fields before sending? Optional, depends on API.
    Object.keys(updatedLeadData).forEach(
      (key) =>
        updatedLeadData[key as keyof typeof updatedLeadData] === undefined &&
        delete updatedLeadData[key as keyof typeof updatedLeadData]
    );

    updateLeadMutation.mutate(updatedLeadData as Lead); // Mutate with the corrected structure
  };

  // --- Communication History Logic (Placeholder) ---
  const handleAddCommunication = (e: React.FormEvent) => {
    e.preventDefault();
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
    "Referral",
    "Custom",
    "Other", // Added Referral, Other
  ];
  const stageOptions: Lead["status"][] = [
    // Use Lead status type
    "New",
    "Contacted",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Closed",
  ];
  const timelineOptions: (Lead["timeline"] | undefined)[] = [
    // Use Lead timeline type, allow undefined
    "Immediate",
    "1-3 months",
    "3-6 months",
    "6+ months",
  ];
  const communicationModes = [
    "Email",
    "Mobile",
    "Meeting",
    "WhatsApp",
    "Message",
  ];
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
  ];

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>Update lead information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Information Section */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formValues.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formValues.email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formValues.phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formValues.company || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Marketing Manager"
                  value={formValues.title || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
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
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formValues.source || ""}
                  onValueChange={(value) => handleSelectChange("source", value)}
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
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Social Media</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn</Label>
                <Input
                  id="linkedinUrl"
                  placeholder="LinkedIn profile URL"
                  value={formValues.linkedinUrl || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram</Label>
                <Input
                  id="instagramUrl"
                  placeholder="Instagram profile URL"
                  value={formValues.instagramUrl || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={formValues.twitterUrl || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Lead Status & Scoring Section */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Lead Status & Scoring</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Current Stage</Label>
                <Select
                  value={formValues.status || ""}
                  onValueChange={(value) =>
                    handleSelectChange("status", value as Lead["status"])
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
                <Label htmlFor="score">Lead Score</Label>
                <Input
                  id="score"
                  type="number"
                  value={formValues.score || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="engagement">Engagement (0-100)</Label>
                <Input
                  id="engagement"
                  type="number"
                  min="0"
                  max="100"
                  value={formValues.engagement || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Input
                  id="companySize"
                  type="number"
                  min="0"
                  value={formValues.companySize || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  value={formValues.budget || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select
                  value={formValues.timeline || "Immediate"}
                  onValueChange={(value) =>
                    handleSelectChange("timeline", value as Lead["timeline"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelineOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about the lead"
                value={formValues.notes || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={updateLeadMutation.isPending}
              className="btn-gradient"
            >
              {updateLeadMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
