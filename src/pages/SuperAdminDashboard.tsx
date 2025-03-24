
import React from 'react';
import { 
  Plus, 
  Filter, 
  RefreshCw, 
  MoreHorizontal, 
  Edit, 
  Users, 
  UserCheck,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { toast } from "sonner";

// Mock organizations data
const organizations = [
  {
    id: '1',
    name: 'Acme Corporation',
    subscriptionType: 'Pro',
    maxUsers: 50,
    currentUsers: 35,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Globex Inc.',
    subscriptionType: 'Growth',
    maxUsers: 25,
    currentUsers: 20,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Soylent Corp',
    subscriptionType: 'Starter',
    maxUsers: 10,
    currentUsers: 8,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Initech',
    subscriptionType: 'Free',
    maxUsers: 5,
    currentUsers: 3,
    status: 'Inactive',
  },
];

const SuperAdminDashboard: React.FC = () => {
  const handleToggleStatus = (orgId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    toast.success(`Organization status changed to ${newStatus}`);
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'Pro':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">{type}</Badge>;
      case 'Growth':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{type}</Badge>;
      case 'Starter':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{type}</Badge>;
      case 'Free':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen ml-64">
        <Header title="SuperAdmin Dashboard">
          <Button 
            className="btn-gradient flex items-center gap-2"
            onClick={() => toast.info("Add organization feature coming soon")}
          >
            <Plus className="h-4 w-4" />
            Add Organization
          </Button>
        </Header>

        <div className="p-6 page-transition">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Organization Management</h1>
            <p className="text-slate-600">Manage all organizations and their subscriptions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 hover-scale">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-1">{organizations.length}</h3>
              <p className="text-slate-600">Total Organizations</p>
            </div>

            <div className="glass-card p-6 hover-scale">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-1">
                {organizations.filter(org => org.status === 'Active').length}
              </h3>
              <p className="text-slate-600">Active Organizations</p>
            </div>

            <div className="glass-card p-6 hover-scale">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-1">
                {organizations.reduce((sum, org) => sum + org.currentUsers, 0)}
              </h3>
              <p className="text-slate-600">Total Users</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Organizations</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input 
                  placeholder="Search organizations..." 
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ORGANIZATION NAME</TableHead>
                  <TableHead>SUBSCRIPTION</TableHead>
                  <TableHead>MAX USERS</TableHead>
                  <TableHead>CURRENT USERS</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org) => (
                  <TableRow key={org.id} className="table-row-hover">
                    <TableCell>
                      <div className="font-medium">{org.name}</div>
                    </TableCell>
                    <TableCell>
                      {getSubscriptionBadge(org.subscriptionType)}
                    </TableCell>
                    <TableCell>{org.maxUsers}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{org.currentUsers}</span>
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gtm-gradient rounded-full"
                            style={{ width: `${(org.currentUsers / org.maxUsers) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={org.status === 'Active'}
                          onCheckedChange={() => handleToggleStatus(org.id, org.status)}
                        />
                        <span className={org.status === 'Active' ? 'text-green-600' : 'text-red-600'}>
                          {org.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Manage Users</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>Delete Organization</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
