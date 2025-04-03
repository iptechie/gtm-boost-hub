
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SubscriptionInfoProps {
  plan: 'Free' | 'Starter' | 'Growth' | 'Pro';
  daysRemaining: number;
  usedLeads: number;
  maxLeads: number;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
  plan,
  daysRemaining,
  usedLeads,
  maxLeads,
}) => {
  const percentage = Math.round((usedLeads / maxLeads) * 100);

  return (
    <div className="glass-card p-6">
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
            <h3 className="font-semibold">{plan} Plan</h3>
            <p className="text-sm text-slate-500">{daysRemaining} days remaining</p>
          </div>
        </div>
        
        <Button className="btn-gradient">
          {plan === 'Free' ? 'Upgrade' : 'Manage Subscription'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Leads Usage</span>
          <span className="font-medium">{usedLeads} / {maxLeads}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-value" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Used: {percentage}%</span>
          <span>Remaining: {maxLeads - usedLeads} leads</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionInfo;
