
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Plus, Import, FileUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '../components/Header';
import LeadTable, { Lead } from '../components/LeadTable';
import LeadFilter from '../components/LeadFilter';
import Sidebar from '../components/Sidebar';

// Mock lead data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Somnath Ghosh',
    company: 'SomLance',
    contactInfo: {
      email: 'ghoshsomnath5@gmail.com',
      phone: '+91 91-9836841074',
    },
    status: 'Qualified',
    category: 'Google',
    lastContact: 'Mar 23, 2025',
    nextFollowUp: 'Mar 29, 2025',
    score: 92,
  },
  {
    id: '2',
    name: 'Sanchita Ghosh',
    company: 'SomLance',
    contactInfo: {
      email: 'ghoshsomnath5@gmail.com',
      phone: '+91 91-9836841074',
    },
    status: 'New',
    category: 'Google',
    lastContact: 'Mar 23, 2025',
    nextFollowUp: 'Mar 25, 2025',
    score: 50,
  },
  {
    id: '3',
    name: 'Sanchita Ghosh',
    company: 'Prodomain',
    contactInfo: {
      email: 'sanchita@gmail.com',
      phone: '+91 91-9836841074',
    },
    status: 'Won',
    category: 'Google',
    lastContact: 'Mar 23, 2025',
    nextFollowUp: 'Mar 27, 2025',
    score: 66,
  },
];

// Lead stats
const leadStats = {
  total: 5,
  growth: '+5%',
  new: {
    count: 1,
    growth: '+12%',
  },
  qualified: {
    count: 1,
    growth: '-3%',
  },
  opportunities: {
    count: 2,
    growth: '+8%',
  },
};

const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Filter leads based on search term
  const filteredLeads = mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleAddLead = () => {
    toast.success("Add lead feature will be available in the next update");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen ml-64">
        <Header title="GTM Lead Management">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => toast.info("Import leads is a Pro feature")}
          >
            <Import className="h-4 w-4" />
            Import
          </Button>
          <Button 
            className="btn-gradient flex items-center gap-2"
            onClick={handleAddLead}
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </Header>

        <div className="p-6 page-transition">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-slate-700">
              Track and manage your leads efficiently
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 hover-scale bg-blue-50/50">
              <h3 className="text-sm font-medium text-slate-500">Total Leads</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold">{leadStats.total}</p>
                <span className="ml-2 text-sm font-medium text-green-600">
                  ↑ {leadStats.growth}
                </span>
              </div>
              <div className="mt-4 text-xs text-slate-500">Last 30 days</div>
            </div>

            <div className="glass-card p-6 hover-scale bg-green-50/50">
              <h3 className="text-sm font-medium text-slate-500">New Leads (This Month)</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold">{leadStats.new.count}</p>
                <span className="ml-2 text-sm font-medium text-green-600">
                  ↑ {leadStats.new.growth}
                </span>
              </div>
              <div className="mt-4 text-xs text-slate-500">Last 30 days</div>
            </div>

            <div className="glass-card p-6 hover-scale bg-purple-50/50">
              <h3 className="text-sm font-medium text-slate-500">Qualified Leads</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold">{leadStats.qualified.count}</p>
                <span className="ml-2 text-sm font-medium text-red-600">
                  ↓ {leadStats.qualified.growth}
                </span>
              </div>
              <div className="mt-4 text-xs text-slate-500">Last 30 days</div>
            </div>

            <div className="glass-card p-6 hover-scale bg-amber-50/50">
              <h3 className="text-sm font-medium text-slate-500">Opportunities</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold">{leadStats.opportunities.count}</p>
                <span className="ml-2 text-sm font-medium text-green-600">
                  ↑ {leadStats.opportunities.growth}
                </span>
              </div>
              <div className="mt-4 text-xs text-slate-500">Last 30 days</div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gtm-gradient flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Pro Plan</h3>
                  <p className="text-sm text-slate-500">14 days remaining</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-right mr-6">
                  <h4 className="font-medium">Leads Usage</h4>
                  <p className="text-sm text-slate-500">35 / 50</p>
                </div>
                <Button className="btn-gradient">
                  Upgrade
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="progress-bar">
                <div 
                  className="progress-value" 
                  style={{ width: '70%' }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Used: 70%</span>
                <span>Remaining: 15 leads</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <LeadFilter 
            onSearch={handleSearch}
            onFilter={handleFilter}
          />

          {/* Lead Table */}
          <LeadTable leads={filteredLeads} />
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;
