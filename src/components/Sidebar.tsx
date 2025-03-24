
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ShoppingBag, 
  Settings, 
  Target,
  LogOut,
  Briefcase
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: Building2, label: 'Company', path: '/company' },
    { icon: ShoppingBag, label: 'Products', path: '/products' },
    { icon: Briefcase, label: 'Services', path: '/services' },
    { icon: Target, label: 'GTM Strategy', path: '/gtm-strategy' },
  ];

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
