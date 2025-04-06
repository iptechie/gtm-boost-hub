
import React from 'react';
import { Users, Settings, ArrowRight, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SubscriptionInfo from '../components/SubscriptionInfo';
import ApiKeyForm from '../components/ApiKeyForm';
import UserTable, { User } from '../components/UserTable';
import InviteUserForm from '../components/InviteUserForm';

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Manager',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'User',
    status: 'Pending',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'User',
    status: 'Inactive',
  },
];

const OrgAdminDashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen ml-64">
        <Header title="Organization Admin">
          <Button className="btn-gradient flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Organization Settings
          </Button>
        </Header>

        <div className="p-6 page-transition">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
            <p className="text-slate-600">Manage your organization, users, and API integrations.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <SubscriptionInfo
                plan="Pro"
                daysRemaining={14}
                usedLeads={35}
                maxLeads={50}
              />
            </div>
            <div>
              <div className="glass-card p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Organization Details</h3>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Organization Name</p>
                    <p className="font-medium">Acme Corporation</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Industry</p>
                    <p className="font-medium">Technology</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-medium">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6 hover-scale">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">User Management</h3>
              <p className="text-slate-600 mb-4">
                Manage users, roles, and permissions for your organization.
              </p>
              <Button variant="ghost" className="text-gtm-blue hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1 pl-0">
                Manage Users
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="glass-card p-6 hover-scale">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Subscription</h3>
              <p className="text-slate-600 mb-4">
                View and manage your current plan, billing, and usage.
              </p>
              <Button variant="ghost" className="text-gtm-blue hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1 pl-0">
                Manage Subscription
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="glass-card p-6 hover-scale">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"></path>
                  <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                  <path d="M12 12v4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Integrations</h3>
              <p className="text-slate-600 mb-4">
                Connect with other tools and manage API integrations.
              </p>
              <Button variant="ghost" className="text-gtm-blue hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1 pl-0">
                Manage Integrations
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <UserTable users={mockUsers} />
              </div>
            </div>
            <div>
              <InviteUserForm />
            </div>
          </div>

          <ApiKeyForm />
        </div>
      </div>
    </div>
  );
};

export default OrgAdminDashboard;
