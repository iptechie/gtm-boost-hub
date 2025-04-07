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
import type { Lead } from "@/types/lead"; // Import Lead type
import { Label } from "@/components/ui/label";

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // onSave: (lead: Lead) => void; // Removed unused onSave prop
  initialData?: Partial<Lead>; // Allow partial initial data
}

interface FormData extends Omit<Lead, "id" | "createdAt" | "updatedAt"> {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AddLeadDialog: React.FC<AddLeadDialogProps> = ({
  open,
  onOpenChange,
  // onSave, // Removed from parameters
  initialData,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Lead>>({
    // Use Partial<Lead> for state
    name: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    industry: "",
    source: "",
    status: "New",
    score: 0,
    // lastContactDate: new Date().toISOString(), // Removed invalid field
    notes: "",
    linkedinUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    ...initialData,
  });

  const addLeadMutation = useMutation({
    mutationFn: addLead,
    onSuccess: (data) => {
      toast.success(`Lead "${data.name}" added successfully`);
      queryClient.invalidateQueries({ queryKey: ["leads"] }); // Invalidate and refetch leads query
      onOpenChange(false); // Close dialog on success
      setFormData({
        // Reset state according to Partial<Lead>
        name: "",
        email: "",
        phone: "",
        company: "",
        title: "",
        industry: "",
        source: "",
        status: "New",
        score: 0,
        // lastContactDate: new Date().toISOString(), // Removed invalid field
        notes: "",
        linkedinUrl: "",
        instagramUrl: "",
        twitterUrl: "",
      }); // Reset form values
    },
    onError: (error) => {
      toast.error(`Failed to add lead: ${error.message}`);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (
    id: keyof FormData, // Use keys from FormData type
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare data for mutation, ensuring required fields are present if necessary
    // For now, we assume formData has enough to satisfy the 'addLead' API function
    // Add validation logic here if needed before mutating
    addLeadMutation.mutate(
      formData as Omit<Lead, "id" | "createdAt" | "updatedAt">
    ); // Call the internal mutation
  };

  const sourceOptions = [
    "Website",
    "Facebook",
    "LinkedIn",
    "Instagram",
    "X.com",
    "Partner",
    "Email",
    "Call",
    "Message",
    "Others",
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
          <DialogTitle>
            {initialData ? "Edit Lead" : "Add New Lead"}
          </DialogTitle>
          <DialogDescription>
            Fill in the lead's information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) =>
                  setFormData({ ...formData, industry: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
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
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value) =>
                  setFormData({ ...formData, source: value })
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as Lead["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram Profile</Label>
              <Input
                id="instagramUrl"
                type="url"
                value={formData.instagramUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, instagramUrl: e.target.value })
                }
                placeholder="https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter Profile</Label>
              <Input
                id="twitterUrl"
                type="url"
                value={formData.twitterUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, twitterUrl: e.target.value })
                }
                placeholder="https://twitter.com/username"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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
