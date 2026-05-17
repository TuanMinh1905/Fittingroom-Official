// ===== Fitting Room Page =====
// /fitting-room — Phòng thử đồ 3D
// Layout: 3D viewer bên trái + controls bên phải

"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import BetaControls from "@/components/fitting/BetaControls";
import { useFittingStore } from "@/stores/fitting";

// Dynamic import FittingScene (Three.js = client only, no SSR)
const FittingScene = dynamic(
  () => import("@/components/fitting/FittingScene"),
  { ssr: false, loading: () => <SceneLoader /> }
);

function SceneLoader() {
  return (
    <div className="w-full h-full min-h-[500px] bg-slate-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Đang tải 3D viewer...</p>
      </div>
    </div>
  );
}

export default function FittingRoomPage() {
  const { meshData, info, loading, fetchInfo, fetchMesh } = useFittingStore();

  // Fetch info + initial mesh on mount
  useEffect(() => {
    fetchInfo();
    fetchMesh();
  }, [fetchInfo, fetchMesh]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Phòng thử đồ 3D</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tùy chỉnh thông số cơ thể để xem body model 3D
        </p>
      </div>

      {/* Main Layout: Scene + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* 3D Viewer */}
        <div className="relative">
          {meshData && meshData.vertices.length > 0 ? (
            <FittingScene
              vertices={meshData.vertices}
              faces={meshData.faces}
            />
          ) : (
            <SceneLoader />
          )}

          {/* Loading overlay */}
          {loading && meshData && (
            <div className="absolute inset-0 bg-white/30 rounded-xl flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Right Panel: Controls */}
        <div className="bg-slate-50 rounded-xl p-4 h-fit lg:max-h-[calc(100vh-180px)] overflow-y-auto">
          <BetaControls />
        </div>
      </div>
    </div>
  );
}
