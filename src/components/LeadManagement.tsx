import React, { useState } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeatureGate } from "@/components/FeatureGate";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SubscriptionLimits } from "@/components/SubscriptionLimits";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadManagementProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void;
  onEditLead: (id: string, lead: Partial<Lead>) => void;
  onDeleteLead: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onImportLeads: (
    leads: Omit<Lead, "id" | "createdAt" | "updatedAt">[]
  ) => void;
  onExportLeads: () => void;
}

export const LeadManagement: React.FC<LeadManagementProps> = ({
  leads,
  onAddLead,
  onEditLead,
  onDeleteLead,
  onBulkDelete,
  onImportLeads,
  onExportLeads,
}) => {
  const { canAccessLeadFeature, getRemainingLeads } = useSubscription();
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "",
    source: "",
    notes: "",
  });

  const handleAddLead = () => {
    if (getRemainingLeads() <= 0) {
      return;
    }
    onAddLead(newLead);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "",
      source: "",
      notes: "",
    });
    setIsAddingLead(false);
  };

  const handleEditLead = () => {
    if (!editingLead) return;
    onEditLead(editingLead.id, {
      name: editingLead.name,
      email: editingLead.email,
      phone: editingLead.phone,
      company: editingLead.company,
      status: editingLead.status,
      source: editingLead.source,
      notes: editingLead.notes,
    });
    setEditingLead(null);
  };

  const handleDeleteLead = (id: string) => {
    onDeleteLead(id);
  };

  const handleBulkDelete = (ids: string[]) => {
    onBulkDelete(ids);
  };

  const canImport = canAccessLeadFeature("canImport");
  const canExport = canAccessLeadFeature("canExport");
  const canBulkEdit = canAccessLeadFeature("canBulkEdit");
  const canDelete = canAccessLeadFeature("canDelete");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Management</h2>
        <div className="space-x-2">
          <FeatureGate
            leadFeature="canImport"
            fallback={
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Feature Locked</AlertTitle>
                <AlertDescription>
                  Upgrade your plan to import leads
                </AlertDescription>
              </Alert>
            }
          >
            <Button variant="outline" onClick={() => onImportLeads([])}>
              Import Leads
            </Button>
          </FeatureGate>
          <FeatureGate
            leadFeature="canExport"
            fallback={
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Feature Locked</AlertTitle>
                <AlertDescription>
                  Upgrade your plan to export leads
                </AlertDescription>
              </Alert>
            }
          >
            <Button variant="outline" onClick={onExportLeads}>
              Export Leads
            </Button>
          </FeatureGate>
          <Dialog open={isAddingLead} onOpenChange={setIsAddingLead}>
            <DialogTrigger asChild>
              <Button disabled={getRemainingLeads() <= 0}>Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) =>
                      setNewLead({ ...newLead, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) =>
                      setNewLead({ ...newLead, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newLead.phone}
                    onChange={(e) =>
                      setNewLead({ ...newLead, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newLead.company}
                    onChange={(e) =>
                      setNewLead({ ...newLead, company: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={newLead.status}
                    onChange={(e) =>
                      setNewLead({ ...newLead, status: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={newLead.source}
                    onChange={(e) =>
                      setNewLead({ ...newLead, source: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newLead.notes}
                    onChange={(e) =>
                      setNewLead({ ...newLead, notes: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleAddLead}>Add Lead</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SubscriptionLimits />

      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{lead.name}</span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingLead(lead)}
                  >
                    Edit
                  </Button>
                  <FeatureGate
                    leadFeature="canDelete"
                    fallback={
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Feature Locked</AlertTitle>
                        <AlertDescription>
                          Upgrade your plan to delete leads
                        </AlertDescription>
                      </Alert>
                    }
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteLead(lead.id)}
                    >
                      Delete
                    </Button>
                  </FeatureGate>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{lead.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.company}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">{lead.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Source</p>
                  <p className="text-sm text-muted-foreground">{lead.source}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">{lead.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          {editingLead && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingLead.name}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingLead.email}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editingLead.phone}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={editingLead.company}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      company: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Input
                  id="edit-status"
                  value={editingLead.status}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      status: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-source">Source</Label>
                <Input
                  id="edit-source"
                  value={editingLead.source}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      source: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingLead.notes}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={handleEditLead}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagement;
