
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
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

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLeadDialog: React.FC<AddLeadDialogProps> = ({ open, onOpenChange }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Lead added successfully");
    onOpenChange(false);
  };

  const sourceOptions = [
    "Website", 
    "Email", 
    "Web Form", 
    "LinkedIn", 
    "Database", 
    "Instagram", 
    "Facebook", 
    "Custom"
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
    "Lost"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>
          <DialogDescription>
            Fill in the lead's information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
              <Input id="lastName" placeholder="Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input id="phone" placeholder="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">Company</label>
              <Input id="company" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Job Title</label>
              <Input id="title" placeholder="Sales Manager" />
            </div>
            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium">Source</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((source) => (
                    <SelectItem key={source} value={source.toLowerCase()}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="stage" className="text-sm font-medium">Stage</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((stage) => (
                    <SelectItem key={stage} value={stage.toLowerCase()}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Input id="location" placeholder="New York, USA" />
            </div>
            <div className="space-y-2">
              <label htmlFor="linkedin" className="text-sm font-medium">LinkedIn URL</label>
              <Input id="linkedin" placeholder="https://linkedin.com/in/johndoe" />
            </div>
            <div className="col-span-2 space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea id="notes" placeholder="Add any additional notes about the lead" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="btn-gradient">Add Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;
