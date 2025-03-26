
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Users, 
  Target,
  LogOut,
  Kanban,
  Mail,
  Sparkles,
  Plus,
  Bell,
  Import
} from 'lucide-react';
import { toast } from "sonner";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Target, label: 'GTM Strategy', path: '/gtm-strategy' },
    { icon: Mail, label: 'Mail Planner', path: '/mail-planner' },
    { icon: Users, label: 'Lead Management', path: '/leads' },
    { icon: Kanban, label: 'Pipeline Management', path: '/pipeline' },
    { icon: Sparkles, label: 'AI Insights', path: '/ai-insights' },
  ];

  const handleAddLead = () => {
    // This will be connected to the AddLeadDialog in LeadsPage
    const event = new CustomEvent('openAddLeadDialog');
    document.dispatchEvent(event);
  };

  const handleImport = () => {
    const a = document.createElement('a');
    a.href = '/leads-template.xlsx'; // This would be a real template path in production
    a.download = 'leads-import-template.xlsx';
    a.textContent = 'Download Template';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.info("Template downloaded. Upload your filled template via import button.");
  };
  
  const handleNotification = () => {
    const event = new CustomEvent('openNotificationPopover');
    document.dispatchEvent(event);
  };

  return (
    <div className="w-64 h-screen flex flex-col bg-sidebar fixed left-0 top-0 z-10">
      <div className="p-6">
        <Logo className="text-white" />
      </div>
      <div className="flex-1 px-4 py-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {isActive('/leads') && (
        <div className="px-4 py-2 space-y-1">
          <h3 className="text-xs uppercase text-sidebar-text/70 font-semibold tracking-wider px-3 py-2">
            Lead Tools
          </h3>
          <button 
            className="sidebar-link w-full"
            onClick={handleAddLead}
          >
            <Plus size={20} />
            <span>Add Lead</span>
          </button>
          <button 
            className="sidebar-link w-full"
            onClick={handleImport}
          >
            <Import size={20} />
            <span>Import Leads</span>
          </button>
          <button 
            className="sidebar-link w-full"
            onClick={handleNotification}
          >
            <Bell size={20} />
            <span>Notifications</span>
          </button>
        </div>
      )}

      <div className="p-4 border-t border-sidebar-border">
        <Link to="/logout" className="sidebar-link">
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
