import React from 'react';
import type { Customer } from '@/types/metric';

interface CustomersCardProps {
  customers: Customer[];
}

export const CustomersCard: React.FC<CustomersCardProps> = ({ customers }) => {
  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  const avatarColors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-orange-400 to-red-400'
  ];

  return (
    <div className="bg-[#FFFCF8] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clientes</h3>
      <div className="space-y-3">
        {customers.map((customer, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-3 bg-[#BDA69F] rounded-lg cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-[#412A22] ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-semibold shadow-sm`}>
                {getInitials(customer.name)}
              </div>
              <div>
                <p className="font-medium text-white">{customer.name}</p>
                <p className="text-xs text-white">{customer.email || 'cliente@example.com'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-white block">{customer.visits}</span>
              <span className="text-xs text-white">visitas</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
