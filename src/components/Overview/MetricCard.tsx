<<<<<<< HEAD
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MetricCardProps } from '@/types/metric';

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon: Icon,
}) => {

  return (
    <div className="bg-[#FFFCF8] rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">{value}</h3>
          
          {change && (
            <div className="flex items-center gap-1">
              {changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs ontem</span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-full bg-[#BDA69F]">
          <Icon className="w-6 h-6 text-[#412A22]" />
=======
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, change, changeLabel, icon }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm text-[#3C3838]/70 mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-[#3C3838] mb-3">{value}</h3>
          </div>
          <div className="bg-[#D4C5BE] rounded-full p-3">
            {icon}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
            {isPositive ? (
              <ArrowUpIcon className="w-4 h-4 text-green-600 font-semibold" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-600 font-semibold" />
            )}
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(change)}%
            </span>
            <span className="text-[#3C3838]/70">{changeLabel}</span>
>>>>>>> 10fec4c (feat: add overview charts and metrics components)
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> 10fec4c (feat: add overview charts and metrics components)
