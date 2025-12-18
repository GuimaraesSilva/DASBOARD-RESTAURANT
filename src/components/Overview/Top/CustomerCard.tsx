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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#3C3838]">Top Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-[#D4C5BE] rounded-lg p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#263321] flex items-center justify-center text-white font-semibold shadow-sm">
                {getInitials(customer.name)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#3C3838]">{customer.name}</p>
                <p className="text-sm text-[#3C3838]/70">{customer.email}</p>
              </div>
              <div className="text-left">
                <div className="flex justify-center items-center gap-1 pt-1">
                  <p className="font-bold text-[#3C3838]">{customer.reservations.made}</p>
                  <p className="text-xs text-[#3C3838]/70">reservations</p>
                </div>
                <div className="flex justify-center items-center gap-1 pt-1 border-t border-[#3C3838]/20">
                  <p className="text-sm font-medium text-[#3C3838]">{customer.visits}</p>
                  <p className="text-xs text-[#3C3838]/70">visits</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
