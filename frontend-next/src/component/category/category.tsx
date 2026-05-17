"use client";
import { useEffect, useRef } from "react";
import { useCategoryStore } from "@/store/categoryStore";

export default function Category() {
  const { categories, fetchCategories, loading, error } = useCategoryStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -264, behavior: "smooth" }); 
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 264, behavior: "smooth" }); 
    }
  };

  return (
    <div className="relative flex items-center w-[648px]">
      {/* Nút mũi tên qua trái */}
      {!loading && !error && categories.length > 5 && (
        <button 
          onClick={scrollLeft}
          className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 w-[32px] h-[32px] flex items-center justify-center bg-white border border-gray-200 shadow-md rounded-full hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[16px] h-[16px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Khung chứa các item (chiều rộng đúng bằng 5 items = 648px) */}
      <section 
        ref={scrollRef}
        className="flex flex-row items-center gap-[15px] overflow-hidden scroll-smooth w-full"
      >
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && categories.map((item) => (
          <div key={item._id} className="colCenter shrink-0 gap-[8px] w-[120px] h-[144px]">
            <img 
              src={item.imageCategory || "/placeholder.png"} 
              alt={item.name} 
              className="w-full h-full object-cover rounded-md"
            />
            <h3 className="text-center text-sm font-medium">{item.name}</h3>
          </div>
        ))}
      </section>

      {/* Nút mũi tên qua phải */}
      {!loading && !error && categories.length > 5 && (
        <button 
          onClick={scrollRight}
          className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 w-[32px] h-[32px] flex items-center justify-center bg-white border border-gray-200 shadow-md rounded-full hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[16px] h-[16px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
