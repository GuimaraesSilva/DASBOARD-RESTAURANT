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
        </div>
      </div>
    </div>
  );
};
