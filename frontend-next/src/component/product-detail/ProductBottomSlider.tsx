import React from "react";
import ProductCard from "@/component/product/ProductCard";
import { Product } from "@/store/productStore";

interface Props {
  products: Product[];
}

export default function ProductBottomSlider({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Boss cũng yêu thích</h2>
        <p className="text-gray-500 mt-1">Săn deal hời - Chăm boss nhẹ tênh!</p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        {products.map((product) => (
          <div key={product._id} className="snap-start flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
