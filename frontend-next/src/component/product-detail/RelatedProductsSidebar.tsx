import React from "react";
import ProductCard from "@/component/product/ProductCard";
import { Product } from "@/store/productStore";

interface Props {
  products: Product[];
}

export default function RelatedProductsSidebar({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-transparent md:bg-white md:rounded-lg md:p-4 flex flex-col gap-4">
      {/* We only show a few products here */}
      {products.slice(0, 4).map((product) => (
        <div key={product._id} className="w-full flex justify-center">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
