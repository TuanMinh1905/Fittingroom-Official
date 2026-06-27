"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { GarmentData } from "./sectionSMPL/Sence";

// Dynamic import với ssr: false vì Three.js cần window/WebGL
const Scene = dynamic(
  () => import("./sectionSMPL/Sence").then((mod) => ({ default: mod.Scene })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Đang tải 3D viewer...</p>
        </div>
      </div>
    ),
  }
);

export interface MeshData {
  body_vertices: number[];
  body_faces: number[];
  garments: Array<{
    vertices: number[];
    faces: number[];
    color?: number[] | string;
    type?: string;
  }>;
}

interface FittingRoom3DViewerProps {
  meshData: MeshData | null;
  fallbackImage: string | null;
  isLoading: boolean;
  error: string | null;
  onClearError?: () => void;
}

/** Nhãn cho thanh trượt dọc */
const SLIDER_LABELS = [
  { value: 85, label: "Đầu" },
  { value: 50, label: "Thân" },
  { value: 15, label: "Chân" },
];

/**
 * Component wrapper cho phòng thử đồ 3D.
 *
 * - Nếu có meshData → render 3D Canvas tương tác
 * - Nếu chỉ có fallbackImage → hiển thị ảnh 2D
 * - Loading + Error states
 */
export default function FittingRoom3DViewer({
  meshData,
  fallbackImage,
  isLoading,
  error,
  onClearError,
}: FittingRoom3DViewerProps) {
  // State cho thanh cuộn dọc (0=chân, 50=giữa, 100=đầu)
  const [verticalOffset, setVerticalOffset] = useState(50);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVerticalOffset(Number(e.target.value));
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="text-center z-10 p-6">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-cyan-400/20 rounded-full" />
            <div className="absolute inset-2 border-4 border-cyan-300 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Đang render 3D...</h2>
          <p className="text-blue-200/60 text-sm">TailorNet đang tính toán mesh vật lý, vui lòng chờ.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/90">
        <div className="text-center z-10 p-6 max-w-sm">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-red-400 mb-2">Có lỗi xảy ra</h2>
          <p className="text-sm text-gray-300 bg-red-900/30 p-3 rounded-lg border border-red-800/50">{error}</p>
          {onClearError && (
            <button onClick={onClearError} className="mt-4 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
              Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3D mesh view
  if (meshData && meshData.body_vertices.length > 0) {
    // Chuyển đổi garment data
    const garmentData: GarmentData[] = meshData.garments.map((g) => ({
      vertices: g.vertices,
      faces: g.faces,
      color: Array.isArray(g.color) ? (g.color as [number, number, number, number]) : g.color,
      type: g.type,
    }));

    return (
      <div className="w-full h-full relative flex">
        {/* 3D Canvas — chiếm hết không gian trừ thanh slider */}
        <div className="flex-1 relative">
          <Scene
            bodyVertices={meshData.body_vertices}
            bodyFaces={meshData.body_faces}
            garments={garmentData}
            verticalOffset={verticalOffset}
          />
        </div>

        {/* ═══ Thanh trượt dọc (Vertical Slider) ═══ */}
        <div
          className="flex flex-col items-center justify-between py-4 px-1"
          style={{
            width: "44px",
            background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            borderLeft: "1px solid rgba(100, 160, 255, 0.15)",
          }}
        >
          {/* Icon mũi tên lên */}
          <div className="text-blue-300/60 text-xs select-none" title="Nhìn lên">▲</div>

          {/* Nhãn vùng */}
          <div className="relative flex-1 flex items-center" style={{ width: "100%" }}>
            {/* Track labels bên trái slider */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none" style={{ width: "100%" }}>
              {SLIDER_LABELS.map((item) => (
                <div
                  key={item.label}
                  className="text-center"
                  style={{
                    position: "absolute",
                    top: `${100 - item.value}%`,
                    transform: "translateY(-50%)",
                    width: "100%",
                  }}
                >
                  <span
                    className="text-blue-200/40 font-medium select-none"
                    style={{ fontSize: "8px", letterSpacing: "0.5px" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical range input */}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={verticalOffset}
              onChange={handleSliderChange}
              className="vertical-slider-3d"
              title={`Vị trí: ${verticalOffset}%`}
              style={{
                /* Xoay -90 để trở thành slider dọc */
                writingMode: "vertical-lr" as any,
                direction: "rtl",
                width: "28px",
                height: "100%",
                cursor: "grab",
                WebkitAppearance: "none",
                appearance: "none",
                background: "transparent",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Icon mũi tên xuống */}
          <div className="text-blue-300/60 text-xs select-none" title="Nhìn xuống">▼</div>
        </div>

        {/* Overlay hướng dẫn */}
        <div className="absolute bottom-3 left-3 right-12 flex justify-center pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm text-white/70 text-xs px-4 py-2 rounded-full flex items-center gap-3">
            <span>🖱️ Xoay</span>
            <span className="w-px h-3 bg-white/20" />
            <span>🔍 Zoom</span>
            <span className="w-px h-3 bg-white/20" />
            <span>↕️ Thanh trượt dọc</span>
          </div>
        </div>
        {/* Badge 3D */}
        <div className="absolute top-3 right-14">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            3D View
          </div>
        </div>

        {/* CSS cho vertical slider */}
        <style jsx global>{`
          .vertical-slider-3d::-webkit-slider-runnable-track {
            width: 4px;
            background: linear-gradient(to bottom, #3b82f6, #06b6d4, #3b82f6);
            border-radius: 2px;
            opacity: 0.4;
          }
          .vertical-slider-3d::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #60a5fa, #06b6d4);
            border: 2px solid rgba(255,255,255,0.8);
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5), 0 0 20px rgba(6, 182, 212, 0.3);
            cursor: grab;
            margin-left: -7px;
          }
          .vertical-slider-3d::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.7), 0 0 30px rgba(6, 182, 212, 0.5);
          }
          .vertical-slider-3d::-moz-range-track {
            width: 4px;
            background: linear-gradient(to bottom, #3b82f6, #06b6d4, #3b82f6);
            border-radius: 2px;
            opacity: 0.4;
          }
          .vertical-slider-3d::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #60a5fa, #06b6d4);
            border: 2px solid rgba(255,255,255,0.8);
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5), 0 0 20px rgba(6, 182, 212, 0.3);
            cursor: grab;
          }
          .vertical-slider-3d:active {
            cursor: grabbing;
          }
        `}</style>
      </div>
    );
  }

  // Fallback: ảnh 2D (nếu chỉ có image, không có mesh)
  if (fallbackImage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-900">
        <img src={fallbackImage} alt="Kết quả thử đồ" className="max-h-full max-w-full object-contain rounded-xl shadow-lg" />
        <p className="text-xs text-gray-500 mt-2">Chế độ 2D — không có dữ liệu 3D</p>
      </div>
    );
  }

  // Empty state — chưa thử đồ
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <div className="text-center z-10 p-8">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-blue-400/50">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          {/* Pulsing ring animation */}
          <div className="absolute inset-0 border-2 border-blue-400/20 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
        </div>
        <h2 className="text-2xl font-bold text-white/90 mb-2">Khu vực Render 3D</h2>
        <p className="text-blue-200/50 text-sm max-w-xs mx-auto">
          Chọn đồ bên trái, điều chỉnh thông số bên phải, rồi nhấn <strong className="text-blue-300/70">&quot;Thử đồ ngay&quot;</strong> để xem model 3D tương tác.
        </p>
      </div>
    </div>
  );
}
