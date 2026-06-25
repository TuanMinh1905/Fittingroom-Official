"use client";

import React, { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  categorySlug?: string;
  brand?: string;
}

const API_URL = "http://localhost:8000/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    categorySlug: "ao", // Default
    brand: "Nike", // Default
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:8000/brand");
      const data = await res.json();
      setBrands(data);
      if (data.length > 0 && !formData.brand) {
        setFormData(prev => ({ ...prev, brand: data[0].name }));
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
      name: "", 
      price: 0, 
      description: "", 
      imageUrl: "", 
      categorySlug: "ao", 
      brand: brands.length > 0 ? brands[0].name : "Nike" 
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl || "",
      categorySlug: product.categorySlug || "ao",
      brand: product.brand || (brands.length > 0 ? brands[0].name : "Nike"),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Create
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thương hiệu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phân loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Chưa có sản phẩm nào.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.imageUrl && (
                          <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-full mr-3 object-cover" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">ID: {product._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.brand || "Nike"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {product.categorySlug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-900 mr-4">Sửa</button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh (URL)</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                <select name="brand" value={formData.brand} onChange={handleChange as any} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  {brands.length === 0 ? (
                    <option value="Nike">Nike</option>
                  ) : (
                    brands.map((b) => (
                      <option key={b._id} value={b.name}>
                        {b.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại (Slug)</label>
                <select name="categorySlug" value={formData.categorySlug} onChange={handleChange as any} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="ao">Áo</option>
                  <option value="quan">Quần</option>
                  <option value="giay">Giày</option>
                  <option value="mu">Mũ</option>
                  <option value="tat">Tất</option>
                  <option value="phu-kien">Phụ kiện</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Hủy</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">{editingId ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
