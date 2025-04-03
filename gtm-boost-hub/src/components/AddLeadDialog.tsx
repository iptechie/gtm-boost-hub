import React, { useState } from "react";
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
import { toast } from "sonner";
import { addLead } from "@/lib/api"; // Import the API function
import type { Lead } from "./LeadTable"; // Import Lead type

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define a type for the form values based on input IDs
type FormValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string; // Corresponds to designation
  source?: string;
  stage?: string; // Corresponds to status
  value?: number | string; // Add value field
  category?: string;
  industry?: string;
  location?: string;
  linkedin?: string;
  notes?: string;
};

const AddLeadDialog: React.FC<AddLeadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<FormValues>({});

  const addLeadMutation = useMutation({
    mutationFn: addLead,
    onSuccess: (data) => {
      toast.success(`Lead "${data.name}" added successfully`);
      queryClient.invalidateQueries({ queryKey: ["leads"] }); // Invalidate and refetch leads query
      onOpenChange(false); // Close dialog on success
      setFormValues({}); // Reset form values
    },
    onError: (error) => {
      toast.error(`Failed to add lead: ${error.message}`);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (
    id: keyof FormValues, // Use keys from FormValues type
    value: string
  ) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct the lead data, ensuring required fields are present
    const newLeadData: Omit<Lead, "id"> = {
      name: `${formValues.firstName || ""} ${formValues.lastName || ""}`.trim(),
      company: formValues.company || "",
      contactInfo: {
        email: formValues.email || "", // Use email from formValues
        phone: formValues.phone || "", // Use phone from formValues
      },
      designation: formValues.title, // Map title to designation
      status: formValues.stage || "New", // Map stage to status
      category: formValues.category,
      industry: formValues.industry,
      // Add other fields as needed, potentially with defaults
      lastContact: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      nextFollowUp: "", // Or get from form if added
      score: 0, // Or get from form if added
      value: Number(formValues.value) || 0, // Add value, default to 0
      // Include location, linkedin, notes if they are part of the Lead type and form
      // Assuming these fields exist in Lead type or need adding:
      location: formValues.location, // Uncommented this line
      // linkedin: formValues.linkedin,
      // notes: formValues.notes,
      // source: formValues.source, // Assuming source is part of Lead type
    };

    // Basic validation example
    if (
      !newLeadData.name ||
      !newLeadData.company ||
      !newLeadData.contactInfo.email
    ) {
      toast.error("Please fill in First Name, Company, and Email.");
      return;
    }

    addLeadMutation.mutate(newLeadData);
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

  const categoryOptions = ["MNC", "Large Domestic", "Regional", "Local"];

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>
          <DialogDescription>
            Fill in the lead's information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Input fields using controlled components */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name *
              </label>
              <Input
                id="firstName"
                placeholder="John"
                value={formValues.firstName || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formValues.lastName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formValues.email || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formValues.phone || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company *
              </label>
              <Input
                id="company"
                placeholder="Acme Inc."
                value={formValues.company || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Job Title
              </label>
              <Input
                id="title"
                placeholder="Sales Manager"
                value={formValues.title || ""}
                onChange={handleInputChange}
              />
            </div>
            {/* Select fields using controlled components */}
            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium">
                Source
              </label>
              <Select
                value={formValues.source || ""}
                onValueChange={(value) => handleSelectChange("source", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a source" />
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
              <label htmlFor="stage" className="text-sm font-medium">
                Stage
              </label>
              <Select
                value={formValues.stage || ""}
                onValueChange={(value) => handleSelectChange("stage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a stage" />
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
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={formValues.category || ""}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
                onValueChange={(value) => handleSelectChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Other input fields */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                placeholder="New York, USA"
                value={formValues.location || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn URL
              </label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/johndoe"
                value={formValues.linkedin || ""}
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
                min="0"
              />
            </div>
            <div className="col-span-2 space-y-2">
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="btn-gradient"
              disabled={addLeadMutation.isPending}
            >
              {addLeadMutation.isPending ? "Adding..." : "Add Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;
