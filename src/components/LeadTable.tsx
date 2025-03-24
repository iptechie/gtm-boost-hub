
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ExternalLink, 
  MessageSquare, 
  FileText, 
  Edit, 
  Trash,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import AddLeadDialog from './AddLeadDialog';
import EditLeadDialog from './EditLeadDialog';
import BulkActions from './BulkActions';
import { toast } from "sonner";

export interface Lead {
  id: string;
  name: string;
  company: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  status: 'New' | 'Qualified' | 'Won';
  category: string;
  lastContact: string;
  nextFollowUp: string;
  score: number;
}

interface LeadTableProps {
  leads: Lead[];
}

const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | undefined>(undefined);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{status}</Badge>;
      case 'Qualified':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">{status}</Badge>;
      case 'Won':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const handleUpdateStage = (stage: string) => {
    // This would update the leads in a real application
    console.log(`Updating leads ${selectedLeads.join(', ')} to stage ${stage}`);
    setSelectedLeads([]);
  };

  const handleDeleteSelected = () => {
    // This would delete the leads in a real application
    console.log(`Deleting leads ${selectedLeads.join(', ')}`);
    setSelectedLeads([]);
  };

  const handleEdit = (lead: Lead) => {
    setCurrentLead(lead);
    setEditLeadOpen(true);
  };

  const handleDelete = (id: string) => {
    toast.success(`Lead ${id} deleted`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <BulkActions 
          selectedCount={selectedLeads.length} 
          onUpdateStage={handleUpdateStage} 
          onDeleteSelected={handleDeleteSelected} 
        />
        <Button 
          className="btn-gradient flex items-center gap-2"
          onClick={() => setAddLeadOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox 
                  checked={selectedLeads.length === leads.length && leads.length > 0} 
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>CONTACT INFO</TableHead>
              <TableHead>CATEGORY</TableHead>
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
                    checked={selectedLeads.includes(lead.id)} 
                    onCheckedChange={() => handleSelectLead(lead.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-slate-500">{lead.company}</div>
                    <div className="mt-1">{getStatusBadge(lead.status)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{lead.contactInfo.email}</div>
                    <div className="text-sm text-slate-500">{lead.contactInfo.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{lead.category}</TableCell>
                <TableCell>{lead.lastContact}</TableCell>
                <TableCell>{lead.nextFollowUp}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getScoreColor(lead.score)}`}>
                    {lead.score}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <FileText className="h-4 w-4" />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddLeadDialog open={addLeadOpen} onOpenChange={setAddLeadOpen} />
      <EditLeadDialog 
        open={editLeadOpen} 
        onOpenChange={setEditLeadOpen} 
        lead={currentLead}
      />
    </>
  );
};

export default LeadTable;
