'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import productsData from "@/data/products.json";
import Image from "next/image";
import { Eye, Package, ChevronLeft, ChevronRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Carne": "bg-[#3C2F2C] text-white border-[#3C2F2C]",
  "Bebidas": "bg-[#536657] text-white border-[#536657]",
  "Acompanhamento": "bg-[#8B9687] text-white border-[#8B9687]",
  "Entrada": "bg-[#263321] text-white border-[#263321]",
  "Sobremesas": "bg-[#BDA69F] text-[#3C2C2D] border-[#BDA69F]",
};

interface SelectedProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export function ProductsGallery() {
  const categories = Array.from(new Set(productsData.products.map(p => p.category)));
  const [categoryFilter, setCategoryFilter] = React.useState<string>(categories[0] || "");
  const [selectedProduct, setSelectedProduct] = React.useState<SelectedProduct | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [api, setApi] = React.useState<any>();

  const filteredProducts = React.useMemo(() => {
    return productsData.products.filter(p => p.category === categoryFilter);
  }, [categoryFilter]);

  const handleViewProduct = (product: typeof productsData.products[0]) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });
    setDialogOpen(true);
  };

  // Divide products into rows of 6 (or 3 on mobile)
  const productsPerRow = 6;
  const rows = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredProducts.length; i += productsPerRow) {
      result.push(filteredProducts.slice(i, i + productsPerRow));
    }
    return result;
  }, [filteredProducts]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold">Products Gallery</CardTitle>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} in {categoryFilter}
            </p>
            
            {/* Navigation Buttons Above Grid */}
            {rows.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={() => api?.scrollPrev()}
                  className="h-8 w-8 rounded-full bg-[#53614E] text-white hover:bg-[#CDDBC8] hover:text-white border-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => api?.scrollNext()}
                  className="h-8 w-8 rounded-full bg-[#53614E] text-white hover:bg-[#CDDBC8] hover:text-white border-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No products found in this category</p>
            </div>
          ) : (
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {rows.map((row, rowIndex) => (
                  <CarouselItem key={rowIndex}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {row.map((product) => (
                        <div
                          key={product.id}
                          className="group relative bg-white rounded-lg border hover:border-[#2C3E2D] transition-all duration-300 overflow-hidden hover:shadow-lg"
                        >
                          {/* Product Image */}
                          <div className="aspect-square relative bg-gray-100">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            />
                            
                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleViewProduct(product)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </div>

                            {/* Stock Badge */}
                            {product.stock < 20 && (
                              <div className="absolute top-2 right-2">
                                <Badge 
                                  variant="destructive" 
                                  className={`text-xs ${product.stock < 10 ? 'bg-red-600' : 'bg-yellow-600'}`}
                                >
                                  {product.stock} left
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-3">
                            <h3 className="font-semibold text-sm truncate mb-1" title={product.name}>
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between gap-2">
                              {/* <Badge 
                                variant="outline" 
                                className={`${categoryColors[product.category] || 'bg-gray-100'} text-xs`}
                              >
                                {product.category}
                              </Badge> */}
                              <span className="text-sm font-bold text-[#2C3E2D]">
                                €{product.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Product Details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-2xl w-[calc(100%-2rem)]">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                    <Badge 
                      variant="outline" 
                      className={`${categoryColors[selectedProduct.category] || 'bg-gray-100'} text-sm py-1`}
                    >
                      {selectedProduct.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                    <p className="text-3xl font-bold text-[#2C3E2D]">
                      €{selectedProduct.price.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Stock Available</h3>
                    <div className="flex items-center gap-2">
                      <p className={`text-2xl font-bold ${
                        selectedProduct.stock < 10 
                          ? 'text-red-600' 
                          : selectedProduct.stock < 20 
                          ? 'text-yellow-600' 
                          : 'text-green-600'
                      }`}>
                        {selectedProduct.stock}
                      </p>
                      <span className="text-sm text-muted-foreground">units</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t">
                    <p className="text-xs text-muted-foreground">Product ID: #{selectedProduct.id}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}