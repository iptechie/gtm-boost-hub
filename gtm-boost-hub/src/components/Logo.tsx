
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 rounded-md bg-gtm-gradient flex items-center justify-center text-white font-bold">
        G
      </div>
      <span className="font-bold text-xl">GTMcentric</span>
    </div>
  );
};

export default Logo;
