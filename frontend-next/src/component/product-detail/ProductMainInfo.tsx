"use client";

import React, { useState } from "react";
import { Product } from "@/store/productStore";

interface Props {
  product: Product;
}

export default function ProductMainInfo({ product }: Props) {
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < (product.stock || 1)) setQuantity(quantity + 1);
  };

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-8">
      {/* Left: Images */}
      <div className="w-full md:w-5/12">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-gray-100 mb-4">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        {/* Thumbnails placeholder */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="w-[60px] h-[60px] rounded border border-gray-200 overflow-hidden cursor-pointer hover:border-[var(--primary-color)]">
              <img src={product.imageUrl} alt="thumbnail" className="w-full h-full object-cover opacity-70 hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Info */}
      <div className="w-full md:w-7/12 flex flex-col">
        <h1 className="text-2xl font-medium text-gray-800 mb-2 leading-tight">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center text-yellow-400">
            {'★'.repeat(Math.floor(product.rating || 5))}
            {'☆'.repeat(5 - Math.floor(product.rating || 5))}
            <span className="text-gray-500 ml-1">{product.rating || 5}/5</span>
          </div>
          <div className="w-[1px] h-3 bg-gray-300"></div>
          <div>Đã bán {product.soldCount || 0}</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          {product.discountPrice ? (
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.discountPrice)}</span>
              <span className="text-sm text-gray-400 line-through mb-1">{formatPrice(product.price)}</span>
              <span className="text-xs bg-[var(--primary)] text-white px-2 py-1 rounded mb-1">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            </div>
          ) : (
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          )}
        </div>

        <div className="flex flex-col gap-4 text-sm mb-8">
          <div className="grid grid-cols-12 gap-2 items-center">
            <span className="col-span-3 text-gray-500">Tồn kho:</span>
            <span className="col-span-9 font-medium text-green-600">Còn {product.stock || 0} sản phẩm</span>
          </div>
          <div className="grid grid-cols-12 gap-2 items-center">
            <span className="col-span-3 text-gray-500">Vận chuyển:</span>
            <span className="col-span-9 font-medium">{product.shippingInfo || 'Miễn phí vận chuyển'}</span>
          </div>
          <div className="grid grid-cols-12 gap-2 items-center">
            <span className="col-span-3 text-gray-500">Số lượng:</span>
            <div className="col-span-9 flex items-center">
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <button onClick={handleDecrease} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 border-r border-gray-300">-</button>
                <input type="text" value={quantity} readOnly className="w-12 text-center outline-none text-sm" />
                <button onClick={handleIncrease} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 border-l border-gray-300">+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button className="w-full max-w-[300px] bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
            Mua ngay trên app PETPET
          </button>
        </div>
      </div>
    </div>
  );
}
