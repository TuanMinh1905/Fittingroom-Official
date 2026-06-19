import React from "react";
import { Product } from "@/store/productStore";

interface Props {
  product: Product;
}

export default function ProductDetailsSection({ product }: Props) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold uppercase mb-4 text-gray-800">THÔNG TIN CHI TIẾT</h2>
      
      {/* Specs Table */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="bg-gray-50 border-b border-white">
              <td className="py-2 px-3 text-gray-500 w-1/3 rounded-l">Thương hiệu</td>
              <td className="py-2 px-3 text-gray-800 font-medium text-right rounded-r">{product.brand || 'PetPet'}</td>
            </tr>
            <tr className="bg-gray-100 border-b border-white">
              <td className="py-2 px-3 text-gray-500 w-1/3 rounded-l">Danh mục</td>
              <td className="py-2 px-3 text-gray-800 font-medium text-right rounded-r">{product.categorySlug}</td>
            </tr>
            <tr className="bg-gray-50 border-b border-white">
              <td className="py-2 px-3 text-gray-500 w-1/3 rounded-l">Hạn sử dụng</td>
              <td className="py-2 px-3 text-gray-800 font-medium text-right rounded-r">{product.expiryDate || '>1 năm'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Mô tả sản phẩm</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-4">
          <p>{product.description}</p>
          <div className="mt-4">
            <h4 className="font-bold text-gray-800 mb-2">⭐ ĐIỂM NỔI BẬT:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Thiết kế tinh tế, đem lại sự thoải mái khi sử dụng.</li>
              <li>Chất liệu an toàn, 100% chính hãng tại PetPet.</li>
              <li>Phù hợp cho nhiều mục đích khác nhau.</li>
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-gray-800 mb-2">📋 THÔNG TIN SẢN PHẨM:</h4>
            <ul className="space-y-1">
              <li>Thương hiệu: {product.brand || 'PetPet'}</li>
              <li>Nơi sản xuất: Việt Nam</li>
              <li>Đơn vị chịu trách nhiệm sản phẩm: Công ty Cổ phần Pet Pet</li>
            </ul>
          </div>
          <div className="mt-6 flex gap-4 text-sm font-medium">
            <span className="flex items-center gap-1 text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              100% chính hãng
            </span>
            <span className="flex items-center gap-1 text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              Giao hàng nhanh 2H tại TPHCM
            </span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="pt-6 border-t border-gray-100">
        <h2 className="text-xl font-bold uppercase mb-4 text-gray-800 flex items-center gap-2">
          ĐÁNH GIÁ 
          <span className="bg-yellow-100 text-yellow-700 text-sm px-2 py-0.5 rounded font-bold flex items-center">
            {product.rating ? product.rating.toFixed(1) : '0.0'} <span className="ml-1 text-xs">★</span>
          </span>
        </h2>
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 text-sm">
          Hãy mua hàng để bạn là người đánh giá đầu tiên
        </div>
      </div>
    </div>
  );
}
