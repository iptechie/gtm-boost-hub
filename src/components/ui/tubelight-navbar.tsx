"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check current hash or pathname to set initial active tab
    const { hash, pathname } = window.location;
    if (hash) {
      const matchingItem = items.find((item) => item.url === hash);
      if (matchingItem) {
        setActiveTab(matchingItem.name);
      }
    } else {
      // For direct navigation to URLs like /demo-scheduling
      const matchingItem = items.find((item) => item.url === pathname);
      if (matchingItem) {
        setActiveTab(matchingItem.name);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    e.preventDefault();
    setActiveTab(item.name);

    // Check if this is a hash navigation or regular navigation
    if (item.url.startsWith("#")) {
      // Get the target element
      const targetId = item.url.replace("#", "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Scroll to the element with smooth behavior
        const headerOffset = 120; // Increased offset to account for both headers
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else {
        console.error(`Element with id "${targetId}" not found`);
      }
    } else {
      // Navigate to a different page using react-router
      navigate(item.url);
    }
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6",
        className
      )}
    >
      <div className="flex items-center gap-3 bg-white/80 border border-gray-200 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => handleNavClick(e, item)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300",
                "text-gray-600 hover:text-[#4F46E5]",
                isActive && "bg-gray-100 text-[#4F46E5]"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <div className="absolute inset-0 w-full bg-[#4F46E5]/5 rounded-full -z-10 transition-all duration-300">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#4F46E5] rounded-t-full">
                    <div className="absolute w-12 h-6 bg-[#4F46E5]/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-[#4F46E5]/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-[#4F46E5]/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
