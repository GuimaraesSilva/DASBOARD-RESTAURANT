import { Product } from '@/types/products';

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-[#3C3838]">Top Produtos</h2>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-[#D4C5BE] rounded-lg p-4 flex items-center justify-between hover:bg-[#A8978E] transition-colors"
          >
            <div>
              <h3 className="font-semibold text-[#3C3838]">{product.name}</h3>
              <p className="text-sm text-[#3C3838]/70">{product.sales} vendas</p>
            </div>
            <span className="text-lg font-semibold text-[#2C3A2B]">
              {product.revenue.toFixed(2)}€
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}