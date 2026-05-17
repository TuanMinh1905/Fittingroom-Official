"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/productStore";

export default function ProdcutPage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Trang /prodcut (Zustand)</h1>
        <p className="mt-2 text-slate-300">
          Du lieu duoc luu trong global state bang Zustand.
        </p>

        <button
          onClick={() => void fetchProducts()}
          className="mt-4 rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-900 hover:bg-cyan-400"
        >
          Reload products
        </button>

        {loading && <p className="mt-4">Dang tai du lieu...</p>}
        {error && <p className="mt-4 text-rose-400">{error}</p>}

        {!loading && !error && (
          <ul className="mt-6 grid gap-3">
            {products.map((item, index) => (
              <li
                key={item._id ?? index}
                className="rounded-lg border border-slate-700 bg-slate-900 p-4"
              >
                <p>name: {item.name ?? "(khong co)"}</p>
                <p>number: {item.number ?? "(khong co)"}</p>
                <p>size: {item.size ?? "(khong co)"}</p>
                <p>color: {item.color ?? "(khong co)"}</p>
                <p>price: {item.price ?? "(khong co)"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}