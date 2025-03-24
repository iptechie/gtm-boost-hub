
import React from 'react';
import { 
  Users, 
  LineChart, 
  Calendar as CalendarIcon, 
  BriefcaseIcon,
  TrendingUp,
  PieChart,
  ArrowRight
} from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import SubscriptionInfo from '../components/SubscriptionInfo';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen ml-64">
        <Header title="Dashboard">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Last 30 Days
          </Button>
        </Header>

        <div className="p-6 page-transition">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-slate-600">Here's what's happening with your GTM strategy.</p>
          </div>

          <SubscriptionInfo 
            plan="Pro"
            daysRemaining={14}
            usedLeads={35}
            maxLeads={50}
          />

          <h2 className="font-semibold text-xl mt-10 mb-6">Key Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard 
              title="Total Leads" 
              value="86" 
              icon={<Users className="h-5 w-5 text-blue-600" />}
              change={{ value: "12%", positive: true }}
              bgColor="bg-blue-50/50"
            />
            <StatsCard 
              title="Conversion Rate" 
              value="24%" 
              icon={<LineChart className="h-5 w-5 text-green-600" />}
              change={{ value: "3%", positive: true }}
              bgColor="bg-green-50/50"
            />
            <StatsCard 
              title="Meetings Booked" 
              value="12" 
              icon={<CalendarIcon className="h-5 w-5 text-purple-600" />}
              change={{ value: "5%", positive: false }}
              bgColor="bg-purple-50/50"
            />
            <StatsCard 
              title="Deals Closed" 
              value="8" 
              icon={<BriefcaseIcon className="h-5 w-5 text-amber-600" />}
              change={{ value: "18%", positive: true }}
              bgColor="bg-amber-50/50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Lead Generation Performance</h3>
                <Button variant="ghost" className="text-sm">View Details</Button>
              </div>
              <div className="h-72 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">Chart will appear here in the final implementation</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Lead Sources</h3>
                <Button variant="ghost" className="text-sm">View All</Button>
              </div>
              <div className="h-72 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">Chart will appear here in the final implementation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to get AI-powered insights?</h3>
                <p className="text-slate-600 mb-6 md:mb-0">
                  Unlock the full potential of GTMcentric with Gemma AI integration.
                </p>
              </div>
              <Button className="btn-gradient">
                Set up Gemma API
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
