"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    e.preventDefault();
    setActiveTab(item.name);

    // Get the target element
    const targetId = item.url.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Scroll to the element with smooth behavior
      window.scrollTo({
        top: targetElement.offsetTop - 100, // Offset to account for fixed header
        behavior: "smooth",
      });
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
