import React from 'react';
import type { Product } from '@/types/metric';

interface ProductsCardProps {
  products: Product[];
}

export const ProductsCard: React.FC<ProductsCardProps> = ({ products }) => {
  return (
    <div className="bg-[#FFFCF8] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Produtos</h3>
      <div className="space-y-3">
        {products.map((product, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-3 bg-[#BDA69F] rounded-lg cursor-pointer"
          >
            <div>
              <p className="font-medium text-white0">{product.name}</p>
              <p className="text-sm text-white">{product.sales} vendas</p>
            </div>
            <span className="font-semibold text-white">
                {typeof product.revenue === 'number' 
                ? product.revenue.toFixed(2).replace('.', ',')
                : product.revenue}€
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};