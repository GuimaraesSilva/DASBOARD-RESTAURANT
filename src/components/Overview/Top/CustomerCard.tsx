import React from 'react';
import type { Customer } from '@/types/metric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#3C3838]">Top Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customers.map((customer, idx) => (
            <div 
              key={idx} 
              className="bg-[#D4C5BE] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-[#263321] ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-semibold shadow-sm`}>
                  {getInitials(customer.name)}
                </div>
                <div>
                  <p className="font-semibold text-[#3C3838] text-lg">{customer.name}</p>
                  <p className="text-sm text-[#3C3838]/70">{customer.email || 'cliente@example.com'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-[#3C3838] block">{customer.visits}</span>
                <span className="text-sm text-[#3C3838]/70">visitas</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
