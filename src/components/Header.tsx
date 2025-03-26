
import React, { useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Header: React.FC<{ title: string; children?: React.ReactNode }> = ({ 
  title, 
  children 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  // Mock follow-up data
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const followupLeads = [
    { id: '1', name: 'Somnath Ghosh', company: 'SomLance', nextFollowUp: today }
  ];
  
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() + 7);
  const weekFollowupLeads = [
    { id: '2', name: 'Sanchita Ghosh', company: 'Prodomain', nextFollowUp: 'Mar 27, 2025' }
  ];

  // Listen for notification open event from sidebar
  React.useEffect(() => {
    const handleOpenNotification = () => setNotificationOpen(true);
    document.addEventListener('openNotificationPopover', handleOpenNotification);
    return () => {
      document.removeEventListener('openNotificationPopover', handleOpenNotification);
    };
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-gtm-text">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600 cursor-pointer hover:text-gtm-blue transition-colors" />
              {(followupLeads.length > 0 || weekFollowupLeads.length > 0) && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                  {followupLeads.length + weekFollowupLeads.length}
                </div>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gtm-gradient flex items-center justify-center text-white font-medium">
                JD
              </div>
              <span>Profile</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/logout')}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
