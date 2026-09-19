import React from 'react';

export const StatsCard: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`rounded-lg p-4 shadow-sm ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};
