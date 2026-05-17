"use client";

import { useEffect, useState } from "react";
import { useCategoryStore, Category } from "@/store/categoryStore";

export default function CategoriesAdminPage() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Category, "_id">>({
    name: "",
    slug: "",
    sortOder: 0,
    imageCategory: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    void fetchCategories();
  }, []);

  useEffect(() => {
    setImagePreview(formData.imageCategory || "");
  }, [formData.imageCategory]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sortOder" ? Number(value) : value,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        setUploadError("Upload thất bại");
        return;
      }

      const data = (await response.json()) as { filePath: string };
      setFormData((prev) => ({
        ...prev,
        imageCategory: data.filePath,
      }));
    } catch (error) {
      setUploadError("Lỗi khi upload file");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory(editingId, formData);
      setEditingId(null);
    } else {
      await createCategory(formData);
    }
    setFormData({ name: "", slug: "", sortOder: 0, imageCategory: "" });
    setImagePreview("");
    setIsAddFormOpen(false);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      sortOder: category.sortOder,
      imageCategory: category.imageCategory || "",
    });
    setEditingId(category._id || null);
    setIsAddFormOpen(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      await deleteCategory(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", sortOder: 0, imageCategory: "" });
    setImagePreview("");
    setUploadError(null);
    setIsAddFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Categories
            </h1>
          </div>
          <button
            onClick={() => {
              setIsAddFormOpen(!isAddFormOpen);
              if (editingId) handleCancel();
            }}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {isAddFormOpen ? "Hủy" : "+ Thêm danh mục"}
          </button>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="rounded-2xl border border-rose-800/50 bg-rose-900/30 p-4 text-rose-200">
          {error}
        </div>
      )}

      {uploadError && (
        <div className="rounded-2xl border border-rose-800/50 bg-rose-900/30 p-4 text-rose-200">
          {uploadError}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAddFormOpen && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            {editingId ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Tên danh mục *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="VD: Quần áo"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="VD: quan-ao"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  name="sortOder"
                  value={formData.sortOder}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Chọn ảnh
              </label>
              <div className="mt-2 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-500 file:text-slate-950
                    hover:file:bg-cyan-400
                    disabled:opacity-50
                    cursor-pointer"
                />
                {isUploading && (
                  <p className="mt-2 text-sm text-cyan-300">Đang upload...</p>
                )}
              </div>
            </div>

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-300 mb-2">
                  Xem trước ảnh:
                </p>
                <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="max-h-40 rounded"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-emerald-600 py-2 font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Tạo mới"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-lg border border-slate-700 py-2 font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Categories Table */}
      {loading && !isAddFormOpen ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">
          Đang tải dữ liệu...
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  <th className="px-6 py-4 text-left font-semibold text-slate-300">
                    Tên
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-300">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-300">
                    Thứ tự
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-300">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-300">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-slate-800 transition hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{cat.slug}</td>
                    <td className="px-6 py-4 text-center text-slate-400">
                      {cat.sortOder}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {cat.imageCategory ? (
                        <a
                          href={cat.imageCategory}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline text-xs"
                        >
                          Xem
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-500"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="rounded bg-rose-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-500"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
