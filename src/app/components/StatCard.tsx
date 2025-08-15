// app/components/StatCard.tsx

import { FC, ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode; // Permite passar um ícone SVG como componente // Ex: 'bg-blue-100 text-blue-800'
}

export const StatCard: FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full `}>
        {icon}
      </div>
    </div>
  );
};