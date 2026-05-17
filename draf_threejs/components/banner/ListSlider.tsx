// ===== TMFashion Banner ListSlider =====
// Hero image slider (tương đương components/banner/ListSlider.vue)
// Giống Nuxt: BarnerSlider.png background, gradient yellow, slides content

"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    title: "GIÁ TỐT HÔM NAY",
    subtitle: "Càng mua - Càng hời",
    description: "Giảm tới 50% mọi sản phẩm",
    btnText: "Mua ngay",
  },
  {
    title: "COMBO TIẾT KIỆM",
    subtitle: "Chăm hàng nhẹ tênh!",
    description: "Combo 3 món chỉ từ 299K",
    btnText: "Xem combo",
  },
  {
    title: "SĂN QUÀ CHẤT",
    subtitle: "Nhận quà cực ngầu",
    description: "Mua đơn từ 500K nhận quà",
    btnText: "Săn ngay",
  },
  {
    title: "ĐỒ GÌ CŨNG CÓ",
    subtitle: "MUA HẾT Ở TMF",
    description: "Thời trang cho mọi người",
    btnText: "Khám phá",
  },
];

export default function BannerListSlider() {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  // Autoplay 3s — giống Nuxt
  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next, isDragging]);

  // Drag / swipe support
  function handlePointerDown(e: React.PointerEvent) {
    setIsDragging(true);
    setStartX(e.clientX);
  }
  function handlePointerUp(e: React.PointerEvent) {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (diff > 50) prev();
    else if (diff < -50) next();
    setIsDragging(false);
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl select-none"
      style={{ height: "clamp(200px, 40vw, 460px)" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === current
              ? "translate-x-0"
              : index < current
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          {/* Background image — giống Nuxt BarnerSlider.png */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/BarnerSlider.png')" }}
          />
          {/* Gradient overlay — giống Nuxt: bg-gradient from button-barner */}
          <div className="absolute inset-0 bg-gradient-to-r from-button-barner/90 via-button-barner/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-[60%]">
            <p className="text-[14px] md:text-[16px] text-gray-tmf mb-2">
              {slide.subtitle}
            </p>
            <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-[var(--font-longreach)] text-primary leading-tight mb-3">
              {slide.title}
            </h2>
            <p className="text-[13px] md:text-[15px] text-gray-tmf/80 mb-4">
              {slide.description}
            </p>
            <button className="w-fit px-6 py-2 bg-primary text-white rounded-full text-[14px] font-medium hover:bg-secondary transition">
              {slide.btnText}
            </button>
          </div>
        </div>
      ))}

      {/* Dots — giống Nuxt */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-[10px] h-[10px] rounded-full transition-all ${
              index === current
                ? "bg-primary w-[24px]"
                : "bg-gray-400/50"
            }`}
          />
        ))}
      </div>

      {/* Prev/Next arrows — giống Nuxt */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 hover:bg-white/90 rounded-full flex items-center justify-center transition z-20"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 hover:bg-white/90 rounded-full flex items-center justify-center transition z-20"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
