
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  bgColor?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  bgColor = 'bg-white',
  className = '',
}) => {
  return (
    <div className={`glass-card p-6 hover-scale ${bgColor} ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold">{value}</p>
            {change && (
              <span
                className={`ml-2 text-sm font-medium ${
                  change.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.positive ? '↑' : '↓'} {change.value}
              </span>
            )}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-slate-100">{icon}</div>
      </div>
      <div className="mt-4 text-xs text-slate-500">Last 30 days</div>
    </div>
  );
};

export default StatsCard;
