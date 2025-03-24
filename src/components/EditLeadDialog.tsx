
import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Lead } from './LeadTable';

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

const EditLeadDialog: React.FC<EditLeadDialogProps> = ({ open, onOpenChange, lead }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showAddCommunication, setShowAddCommunication] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Lead updated successfully");
    onOpenChange(false);
  };

  const handleAddCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Communication added successfully");
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

  const communicationModes = [
    "Email",
    "Mobile",
    "Meeting",
    "WhatsApp",
    "Message"
  ];

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
          <DialogDescription>
            View and manage lead information and communication history.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input defaultValue={lead.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input defaultValue={lead.contactInfo.email} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input defaultValue={lead.contactInfo.phone} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <Input defaultValue={lead.company} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title</label>
                      <Input placeholder="e.g. Marketing Manager" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Source</label>
                      <Select defaultValue={lead.category.toLowerCase()}>
                        <SelectTrigger>
                          <SelectValue />
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
                      <label className="text-sm font-medium">Location</label>
                      <Input placeholder="e.g. New York, USA" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">LinkedIn</label>
                      <Input placeholder="LinkedIn profile URL" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">Lead Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Status</label>
                      <Select defaultValue={lead.status.toLowerCase()}>
                        <SelectTrigger>
                          <SelectValue />
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
                      <label className="text-sm font-medium">Lead Score</label>
                      <Input type="number" defaultValue={lead.score} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Contact</label>
                      <Input type="date" defaultValue={lead.lastContact} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Next Follow-up</label>
                      <Input type="date" defaultValue={lead.nextFollowUp} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">Additional Information</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea placeholder="Add any additional notes about the lead" />
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="submit" className="btn-gradient">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-4">
            {showAddCommunication ? (
              <div className="bg-white p-5 rounded-lg border mb-4">
                <h3 className="font-medium text-lg mb-3">Add Communication</h3>
                <form onSubmit={handleAddCommunication}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mode of Communication</label>
                      <Select>
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
                      <Textarea placeholder="Describe the communication details" />
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
            
            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-lg mb-3">Communication History</h3>
              <div className="space-y-2">
                <div className="text-sm text-slate-600">
                  <p>Last Contact: {lead.lastContact}</p>
                  <p>Next Follow-up: {lead.nextFollowUp}</p>
                </div>
                
                {lead.lastContact !== "Never" ? (
                  <div className="bg-white p-3 rounded border mt-4">
                    <p className="font-medium">{lead.lastContact}</p>
                    <p className="text-sm mt-2">They have shared the requirements via email.</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No communication records found.
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-3">Activity History</h3>
              <div className="text-sm text-slate-600">
                <p>Recent activity and updates for this lead</p>
              </div>
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
