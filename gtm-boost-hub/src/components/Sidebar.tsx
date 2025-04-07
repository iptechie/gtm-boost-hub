import React, { useState, useMemo, useRef, useCallback } from "react"; // Import useState, useRef, useCallback
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import {
  LayoutDashboard,
  Users,
  Target,
  LogOut,
  Kanban,
  Mail,
  Sparkles,
  Plus,
  Bell, // Keep Bell for the new link icon
  Import,
  CalendarCheck, // Add CalendarCheck icon for the new link
  User, // Add User icon for profile
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { format, parse, isSameDay } from "date-fns"; // Corrected import
import type { Lead } from "@/types/lead";
// Removed Popover imports
// Removed NotificationPopover import
import { Button } from "@/components/ui/button"; // Corrected import
import { ExternalLink, MessageSquare, Edit, Trash, Phone } from "lucide-react";
// Remove cn import if no longer needed
// import { cn } from "@/lib/utils";

interface SidebarProps {
  leads: Lead[];
  // Remove onUpload prop
}

const Sidebar: React.FC<SidebarProps> = ({ leads }) => {
  // Remove Popover state
  // const [open, setOpen] = useState(false);
  // Remove file/drag state
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [isDragging, setIsDragging] = useState(false);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWhatsApp = (phone: string) => {
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp");
  };
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Note: Filtering logic for followupLeads has been moved to FollowUpPage.tsx

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Target, label: "GTM Strategy", path: "/gtm-strategy" },
    { icon: Mail, label: "Mail Planner", path: "/mail-planner" },
    { icon: Users, label: "Lead Management", path: "/leads" },
    { icon: Kanban, label: "Pipeline Management", path: "/pipeline" },
    { icon: Sparkles, label: "AI Insights", path: "/ai-insights" },
    { icon: FileText, label: "Reports", path: "/reports" },
  ];

  const handleAddLead = () => {
    // This will be connected to the AddLeadDialog in LeadsPage
    const event = new CustomEvent("openAddLeadDialog");
    document.dispatchEvent(event);
  };

  // New handler to open the import dialog via event
  const handleOpenImportDialog = () => {
    const event = new CustomEvent("openImportLeadsDialog");
    document.dispatchEvent(event);
  };

  // Remove previous import-related handlers:
  // handleDownloadTemplate, handleSelectFileClick, handleFileChange,
  // onFileInputChange, handleDragEnter, handleDragLeave, handleDragOver,
  // handleDrop, handleUploadClick

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
              className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {isActive("/leads") && (
        <div className="px-4 py-2 space-y-1">
          <h3 className="text-xs uppercase text-sidebar-text/70 font-semibold tracking-wider px-3 py-2">
            Lead Tools
          </h3>
          <button className="sidebar-link w-full" onClick={handleAddLead}>
            <Plus size={20} />
            <span>Add Lead</span>
          </button>
          {/* Simplified Import Button */}
          <button
            className="sidebar-link w-full"
            onClick={handleOpenImportDialog}
          >
            <Import size={20} />
            <span>Import Leads</span>
          </button>
          {/* Add link to the new Follow-up page */}
          <Link
            to="/follow-up"
            className={`sidebar-link w-full ${
              isActive("/follow-up") ? "active" : ""
            }`}
          >
            <CalendarCheck size={20} /> {/* Use new icon */}
            <span>Today's Follow-ups</span>
          </Link>
          {/* Remove the Popover */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
