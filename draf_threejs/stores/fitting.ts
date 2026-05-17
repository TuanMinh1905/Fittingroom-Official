// ===== Fitting Room Store (Zustand) =====
// State: betas[10], vertices, faces, loading, model info
// Actions: fetchInfo, fetchMesh, setBeta, applyPreset

import { create } from "zustand";
import { api } from "@/lib/api";

// ==================== Types ====================

interface SmplInfo {
  n_vertices: number;
  n_faces: number;
  model_type: "smpl_pkl" | "procedural" | "offline" | "none";
  ready: boolean;
}

interface MeshData {
  vertices: number[]; // flat [x0,y0,z0, x1,y1,z1, ...]
  faces: number[];    // flat [i0,j0,k0, i1,j1,k1, ...]
  n_vertices: number;
  n_faces: number;
}

// 10 β parameters — tên tiếng Việt cho UI
export const BETA_LABELS = [
  "Chiều cao",      // β0
  "Cân nặng",       // β1
  "Thân dài",       // β2
  "Chân dài",       // β3
  "Tay dài",        // β4
  "Vai rộng",       // β5
  "Hông rộng",      // β6
  "Đầu to",         // β7
  "Tay dày",        // β8
  "Chân dày",       // β9
];

export interface BetaPreset {
  name: string;
  betas: number[];
}

export const PRESETS: BetaPreset[] = [
  { name: "Trung bình", betas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: "Cao gầy", betas: [2, -1.5, 0.5, 1, 0.5, -0.5, -0.5, 0, -0.5, -0.5] },
  { name: "Thấp đậm", betas: [-1.5, 2, 0, -0.5, -0.3, 1, 1.5, 0.3, 1, 1] },
  { name: "Lực sĩ", betas: [1, 1, 0.3, 0.5, 0.5, 2, 0.5, 0, 1.5, 1] },
  { name: "Mảnh khảnh", betas: [0.5, -2, 0, 0.5, 0.3, -1, -1, -0.3, -1, -0.8] },
];

// ==================== Store ====================

interface FittingStore {
  // State
  betas: number[];
  info: SmplInfo | null;
  meshData: MeshData | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchInfo: () => Promise<void>;
  fetchMesh: () => Promise<void>;
  setBeta: (index: number, value: number) => void;
  applyPreset: (preset: BetaPreset) => void;
  resetBetas: () => void;
}

export const useFittingStore = create<FittingStore>((set, get) => ({
  betas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  info: null,
  meshData: null,
  loading: false,
  error: null,

  fetchInfo: async () => {
    try {
      const info = await api.get<SmplInfo>("/smpl/info");
      set({ info });
    } catch {
      set({
        info: { n_vertices: 0, n_faces: 0, model_type: "offline", ready: false },
      });
    }
  },

  fetchMesh: async () => {
    const { betas } = get();
    set({ loading: true, error: null });
    try {
      const meshData = await api.post<MeshData>("/smpl/mesh", { betas });
      set({ meshData, loading: false });
    } catch {
      set({ error: "Không thể tải mesh", loading: false });
    }
  },

  setBeta: (index: number, value: number) => {
    const betas = [...get().betas];
    betas[index] = Math.max(-3, Math.min(3, value));
    set({ betas });
  },

  applyPreset: (preset: BetaPreset) => {
    set({ betas: [...preset.betas] });
  },

  resetBetas: () => {
    set({ betas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
  },
}));
