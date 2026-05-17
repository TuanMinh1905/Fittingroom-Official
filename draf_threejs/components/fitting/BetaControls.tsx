// ===== Beta Controls Panel =====
// 10 sliders cho β parameters + presets + status indicator

"use client";

import { useFittingStore, BETA_LABELS, PRESETS } from "@/stores/fitting";

export default function BetaControls() {
  const { betas, info, loading, setBeta, applyPreset, resetBetas, fetchMesh } =
    useFittingStore();

  function handleSliderChange(index: number, value: number) {
    setBeta(index, value);
  }

  // Debounced fetch on slider release
  function handleSliderCommit() {
    fetchMesh();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Status Indicator */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border text-sm">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            info?.ready ? "bg-green-500" : "bg-red-400"
          }`}
        />
        <span className="text-gray-600">
          {info?.model_type === "smpl_pkl" && "SMPL Model (6890 vertices)"}
          {info?.model_type === "procedural" && "Procedural Fallback"}
          {info?.model_type === "offline" && "Service Offline"}
          {info?.model_type === "none" && "Chưa tải model"}
          {!info && "Đang kết nối..."}
        </span>
        {loading && (
          <span className="ml-auto w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Preset
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                applyPreset(preset);
                fetchMesh();
              }}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Beta Sliders */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Thông số cơ thể
          </p>
          <button
            onClick={() => {
              resetBetas();
              fetchMesh();
            }}
            className="text-xs text-primary hover:underline"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          {BETA_LABELS.map((label, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-700">
                  {label}
                </label>
                <span className="text-xs text-gray-400 tabular-nums w-10 text-right">
                  {betas[i].toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.1}
                value={betas[i]}
                onChange={(e) =>
                  handleSliderChange(i, parseFloat(e.target.value))
                }
                onMouseUp={handleSliderCommit}
                onTouchEnd={handleSliderCommit}
                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
