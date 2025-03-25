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
  Plus,
  Bell,
  ChevronDown,
  Phone
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import AddLeadDialog from './AddLeadDialog';
import EditLeadDialog from './EditLeadDialog';
import BulkActions from './BulkActions';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Lead {
  id: string;
  name: string;
  designation?: string;
  company: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  status: 'New' | 'Qualified' | 'Won' | string;
  category?: string;
  industry?: string;
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

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const followupLeads = leads.filter(lead => lead.nextFollowUp === today);
  
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() + 7);
  const weekDateString = thisWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const weekFollowupLeads = leads.filter(lead => 
    lead.nextFollowUp !== today && 
    new Date(lead.nextFollowUp) <= thisWeek
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{status}</Badge>;
      case 'Qualified':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">{status}</Badge>;
      case 'Won':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{status}</Badge>;
      case 'Lost':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">{status}</Badge>;
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

  const handleUpdateStage = (stage: string, leadId?: string) => {
    if (leadId) {
      toast.success(`Updated lead ${leadId} to stage: ${stage}`);
    } else {
      toast.success(`Updated ${selectedLeads.length} leads to stage: ${stage}`);
      setSelectedLeads([]);
    }
  };

  const handleDeleteSelected = () => {
    toast.success(`Deleted ${selectedLeads.length} leads`);
    setSelectedLeads([]);
  };

  const handleEdit = (lead: Lead) => {
    setCurrentLead(lead);
    setEditLeadOpen(true);
  };

  const handleDelete = (id: string) => {
    toast.success(`Lead ${id} deleted`);
  };

  const handleWhatsApp = (phone: string) => {
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
    window.open(url, '_blank');
    toast.success('Opening WhatsApp');
  };

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
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button variant="default" className="btn-gradient">
            Leads
          </Button>
          <BulkActions 
            selectedCount={selectedLeads.length} 
            onUpdateStage={handleUpdateStage} 
            onDeleteSelected={handleDeleteSelected} 
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {(followupLeads.length > 0 || weekFollowupLeads.length > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {followupLeads.length + weekFollowupLeads.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Follow-ups</h4>
                
                {followupLeads.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-red-500">Today</h5>
                    <ul className="space-y-1 mt-1">
                      {followupLeads.map(lead => (
                        <li key={lead.id} className="text-sm py-1 px-2 bg-gray-50 rounded-md">
                          {lead.name} - {lead.company}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {weekFollowupLeads.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-amber-500">This Week</h5>
                    <ul className="space-y-1 mt-1">
                      {weekFollowupLeads.map(lead => (
                        <li key={lead.id} className="text-sm py-1 px-2 bg-gray-50 rounded-md flex justify-between">
                          <span>{lead.name}</span>
                          <span className="text-gray-500">{lead.nextFollowUp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {followupLeads.length === 0 && weekFollowupLeads.length === 0 && (
                  <p className="text-sm text-gray-500">No upcoming follow-ups</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            className="btn-gradient flex items-center gap-2"
            onClick={() => setAddLeadOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox 
                  className="rounded-sm"
                  checked={selectedLeads.length === leads.length && leads.length > 0} 
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
                      <div className="text-xs text-slate-500">{lead.designation}</div>
                    )}
                    <div className="text-sm text-slate-500 mt-1">{lead.company}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{lead.contactInfo.email}</div>
                    <div className="text-sm text-slate-500">{lead.contactInfo.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{lead.category || "N/A"}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={lead.status} 
                    onValueChange={(value) => handleUpdateStage(value, lead.id)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        {getStatusBadge(lead.status)}
                      </SelectValue>
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
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => window.open(`https://example.com/lead/${lead.id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => toast.info("Message feature coming soon")}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => toast.info("View details feature coming soon")}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleWhatsApp(lead.contactInfo.phone)}
                      className="text-green-600"
                    >
                      <Phone className="h-4 w-4" />
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
