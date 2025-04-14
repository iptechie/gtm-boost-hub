import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // If we're on the home page, scroll to top
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Otherwise navigate to home page
      navigate("/");
    }
  };

  return (
    <div
      className={`flex items-center gap-2 ${className} cursor-pointer`}
      onClick={handleClick}
    >
      <img
        src="/site-logo.png"
        alt="GTM Centric Logo"
        className="h-8 w-auto select-none"
      />
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl">GTMcentric</span>
        <Badge
          variant="outline"
          className="ml-1 bg-purple-100 text-purple-800 border-purple-300 font-semibold text-xs"
        >
          BETA
        </Badge>
      </div>
    </div>
  );
};

export default Logo;
