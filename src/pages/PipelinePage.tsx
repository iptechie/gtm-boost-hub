
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Button } from "@/components/ui/button";
import { Settings, Plus } from 'lucide-react';
import { toast } from "sonner";

const PipelinePage: React.FC = () => {
  // Mock pipeline stages and data
  const stages = [
    { id: 'new', name: 'New', color: 'bg-blue-100' },
    { id: 'contacted', name: 'Contacted', color: 'bg-purple-100' },
    { id: 'qualified', name: 'Qualified', color: 'bg-amber-100' },
    { id: 'closed', name: 'Closed', color: 'bg-green-100' },
  ];

  const leads = [
    { id: '1', name: 'Acme Inc.', company: 'Acme Inc.', value: '$12,000', stage: 'new' },
    { id: '2', name: 'GlobalTech', company: 'GlobalTech', value: '$8,500', stage: 'new' },
    { id: '3', name: 'Innovate Co', company: 'Innovate Co', value: '$15,000', stage: 'contacted' },
    { id: '4', name: 'FutureSystems', company: 'FutureSystems', value: '$22,000', stage: 'contacted' },
    { id: '5', name: 'TechSolutions', company: 'TechSolutions', value: '$18,750', stage: 'qualified' },
    { id: '6', name: 'WebInnovators', company: 'WebInnovators', value: '$9,200', stage: 'closed' },
  ];

  // Group leads by stage
  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = leads.filter(lead => lead.stage === stage.id);
    return acc;
  }, {} as Record<string, typeof leads>);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen ml-64">
        <Header title="Pipeline Management">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => toast.info("Customize stages is a Pro feature")}
          >
            <Settings className="h-4 w-4" />
            Customize Stages
          </Button>
          <Button 
            className="btn-gradient flex items-center gap-2"
            onClick={() => toast.info("Add lead feature coming soon")}
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </Header>

        <div className="p-6 page-transition">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-slate-700">
              Track your sales pipeline and monitor deal progress
            </h2>
            <p className="text-slate-500">
              Drag and drop leads between stages to update their status.
            </p>
          </div>

          {/* Pipeline Board */}
          <div className="flex space-x-4 overflow-x-auto pb-6">
            {stages.map(stage => (
              <div key={stage.id} className="min-w-[280px] w-[280px] flex-shrink-0">
                <div className={`rounded-t-lg px-3 py-2 ${stage.color}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{stage.name}</h3>
                    <span className="text-xs font-medium bg-white/50 rounded-full px-2 py-0.5">
                      {leadsByStage[stage.id]?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="glass-card rounded-t-none p-2 min-h-[500px]">
                  {leadsByStage[stage.id]?.map(lead => (
                    <div 
                      key={lead.id} 
                      className="bg-white p-3 rounded-lg shadow-sm mb-2 border border-slate-100 cursor-move hover:border-blue-200 transition-all"
                    >
                      <h4 className="font-medium text-slate-800">{lead.name}</h4>
                      <p className="text-sm text-slate-500">{lead.company}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-slate-500">Value</span>
                        <span className="text-sm font-medium text-slate-700">{lead.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="glass-card p-6 mt-8">
            <h3 className="font-medium text-slate-700 mb-4">Pipeline Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm text-slate-600">Total Pipeline Value</h4>
                <p className="text-2xl font-semibold mt-1">$85,450</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="text-sm text-slate-600">Average Deal Size</h4>
                <p className="text-2xl font-semibold mt-1">$14,242</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="text-sm text-slate-600">Win Rate</h4>
                <p className="text-2xl font-semibold mt-1">32%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="text-sm text-slate-600">Closed This Month</h4>
                <p className="text-2xl font-semibold mt-1">$9,200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelinePage;
