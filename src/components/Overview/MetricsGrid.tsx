import React from 'react';
import { MetricCard } from './MetricCard';
import type { MetricCardProps } from '@/types/metric';

interface MetricsGridProps {
  metrics: MetricCardProps[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};