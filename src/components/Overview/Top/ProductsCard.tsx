import React from 'react';
import type { Product } from '@/types/metric';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProductsCardProps {
  products: Product[];
}

export const ProductsCard: React.FC<ProductsCardProps> = ({ products }) => {
  console.log('ProductsCard - products:', products);
  console.log('ProductsCard - products length:', products?.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#3C3838]">Top Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products && products.length > 0 ? (
            products.map((product, idx) => (
              <div 
                key={idx} 
                className="bg-[#D4C5BE] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[#3C3838]">{product.name}</p>
                  <p className="text-sm font-semibold text-[#3C3838]/80">{product.sales} vendas</p>
                  {product.price && (
                    <p className="text-xs font-semibold text-[#3C3838]/70">Preço: €{product.price.toFixed(2).replace('.', ',')}/unidade</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#3C3838] block">
                    {typeof product.revenue === 'number' 
                      ? `€${product.revenue.toFixed(2).replace('.', ',')}` 
                      : product.revenue}
                  </span>
                  <span className="text-xs font-semibold text-[#3C3838]/70">receita total</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum produto disponível</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};