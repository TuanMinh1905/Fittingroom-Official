// ===== TMFashion Filter Category =====
// Horizontal scrollable category buttons (tương đương components/filter/Category.vue)

"use client";

import Link from "next/link";
import type { Category } from "@/stores/category";

interface FilterCategoryProps {
  categories: Category[];
  selected?: string;
}

export default function FilterCategory({
  categories,
  selected,
}: FilterCategoryProps) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-4">
      <Link
        href="/shop"
        className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium border transition ${
          !selected
            ? "bg-primary text-gray-800 border-primary"
            : "bg-white text-gray-600 border-gray-200 hover:border-primary"
        }`}
      >
        Tất cả
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat._id}
          href={`/category/${cat.slug || cat._id}`}
          className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium border transition ${
            selected === cat._id || selected === cat.slug
              ? "bg-primary text-gray-800 border-primary"
              : "bg-white text-gray-600 border-gray-200 hover:border-primary"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
