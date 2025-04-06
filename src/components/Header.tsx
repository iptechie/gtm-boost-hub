import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { ChevronDown, Bell } from "lucide-react"; // Import Bell icon
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner"; // Import toast
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Popover components
import NotificationPopover from "./NotificationPopover"; // Import NotificationPopover
import { Lead } from "./LeadTable"; // Import Lead type (adjust path if needed)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC<{ title: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLeads, setNotificationLeads] = useState<Lead[]>([]);

  // Event listener for notifications
  useEffect(() => {
    const handleOpenNotificationPopover = (event: CustomEvent<Lead[]>) => {
      setNotificationLeads(event.detail);
      setNotificationOpen(true);
    };

    document.addEventListener(
      "openNotificationPopover",
      handleOpenNotificationPopover // Removed unnecessary @ts-expect-error
    );

    return () => {
      document.removeEventListener(
        "openNotificationPopover",
        handleOpenNotificationPopover // Removed unnecessary @ts-expect-error
      );
    };
  }, []);

  // WhatsApp handler
  const handleWhatsApp = (phone: string) => {
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp");
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-gtm-text">{title}</h1>
      <div className="flex items-center gap-4">
        {children}

        {/* Notification Popover */}
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationLeads.length > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            {/* Render the NotificationPopover content inside PopoverContent */}
            <NotificationPopover
              open={notificationOpen} // Pass necessary props
              onOpenChange={setNotificationOpen}
              leads={notificationLeads}
              handleWhatsApp={handleWhatsApp}
            />
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
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
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            {/* Change back to Settings link pointing to /settings */}
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/logout")}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
