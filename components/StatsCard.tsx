import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, colorClass = "bg-primary" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200 p-6 border border-gray-100 flex items-center">
      <div className={`p-4 rounded-xl ${colorClass} bg-opacity-10 mr-4`}>
        <div className={colorClass.replace('bg-', 'text-')}>
            {icon}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</h4>
        <span className={`text-2xl font-bold ${colorClass.replace('bg-', 'text-')}`}>{value}</span>
      </div>
    </div>
  );
};
