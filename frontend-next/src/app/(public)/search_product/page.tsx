"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/component/product/ProductCard";

function SearchContent() {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("q") || "";
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!keyword) {
            setProducts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`http://localhost:8003/products/search?q=${encodeURIComponent(keyword)}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi fetch search results:", err);
                setLoading(false);
            });
    }, [keyword]);

    return (
        <div className="w-full max-w-[1200px] mx-auto py-8 px-4 font-monasans min-h-[60vh]">
            {keyword && (
                <>
                    {/* Banner thông báo */}
                    <div className="bg-[#FFF8D6] text-slate-800 rounded-2xl p-4 mb-8 flex items-center gap-3 border border-yellow-200 shadow-sm">
                        <span className="text-[20px]">✨</span>
                        <p className="text-[16px]">
                            Bạn đang tìm <span className="font-bold">"{keyword}"</span> phải không? TMF-SHOP có rất nhiều sản phẩm phù hợp với nhu cầu của bạn đấy!
                        </p>
                    </div>

                    {/* Tiêu đề kết quả */}
                    <h2 className="text-[24px] font-medium text-slate-900 mb-8">
                        Kết quả tìm kiếm <span className="text-[var(--primary)] font-bold">"{keyword}"</span>
                    </h2>
                </>
            )}

            {/* Lưới sản phẩm */}
            {loading ? (
                <div className="text-center py-10 text-slate-500">Đang tải dữ liệu...</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="flex justify-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-slate-500">
                    Không tìm thấy sản phẩm nào phù hợp với từ khóa <span className="font-bold">"{keyword}"</span>.
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="w-full text-center py-10">Đang tải trang tìm kiếm...</div>}>
            <SearchContent />
        </Suspense>
    );
}
