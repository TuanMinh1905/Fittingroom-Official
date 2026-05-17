# ===== SMPL Model — Forward Pass (Shape only) =====
#
# SMPL (Skinned Multi-Person Linear Model)
#   Paper: Loper et al., 2015
#   Trained on ~4000 real 3D body scans
#
# Forward pass (shape only, T-pose):
#   v_shaped = v_template + shapedirs @ betas
#
#   v_template : (6890, 3) — mesh trung bình (mean body)
#   shapedirs  : (6890, 3, 300) — 300 PCA components (thường dùng 10 đầu)
#   betas      : (10,) — 10 hệ số β user nhập (dùng 10 components đầu)
#   faces      : (13776, 3) — index tam giác kết nối vertices
#
# Kết quả: 6890 vertices mới, mỗi vertex (x, y, z)

import os
import sys
import types
import pickle
import copyreg
import numpy as np
from pathlib import Path


# ==================== Chumpy Mock ====================
# SMPL v1.1.0 .pkl chứa chumpy.Ch objects.
# chumpy không hỗ trợ Python >= 3.12.
# Strategy:
#   1. Register fake chumpy modules (so pickle can resolve class names)
#   2. Patch copyreg._reconstructor to bypass object.__new__(Ch) error
#      → force np.ndarray construction for all chumpy classes

def _setup_chumpy_mock():
    """Inject fake chumpy + patch reconstructor."""

    # Plain class (NOT ndarray subclass) — just a name placeholder
    class Ch:
        """Placeholder for chumpy.Ch during unpickling."""
        _chumpy_mock = True

        def __setstate__(self, state):
            # Capture whatever state pickle provides
            if isinstance(state, dict):
                self.__dict__.update(state)

    # Register fake modules
    mock = types.ModuleType("chumpy")
    mock.__package__ = "chumpy"
    mock.__path__ = []
    mock.Ch = Ch
    mock.array = Ch
    Ch.__module__ = "chumpy"
    sys.modules["chumpy"] = mock
    for sub_name in ["ch", "utils", "linalg", "logic", "reordering"]:
        sub_mod = types.ModuleType(f"chumpy.{sub_name}")
        sub_mod.Ch = Ch
        sub_mod.__package__ = f"chumpy.{sub_name}"
        sys.modules[f"chumpy.{sub_name}"] = sub_mod

    # Patch copyreg._reconstructor
    _orig = copyreg._reconstructor

    def _patched(cls, base, state):
        mod = getattr(cls, "__module__", "") or ""
        if mod.startswith("chumpy") or getattr(cls, "_chumpy_mock", False):
            # Return plain object; __setstate__ will be called next by pickle
            return object.__new__(Ch)
        return _orig(cls, base, state)

    copyreg._reconstructor = _patched


_setup_chumpy_mock()


def _convert_chumpy(obj):
    """Recursively convert any chumpy mock objects to numpy arrays."""
    if hasattr(obj, "_chumpy_mock"):
        # chumpy.Ch stores actual data in various attributes
        for attr in ("x", "r", "dterms"):
            val = getattr(obj, attr, None)
            if val is not None:
                return np.asarray(_convert_chumpy(val))
        # Fallback: try converting directly
        return np.zeros(0, dtype=np.float64)
    if isinstance(obj, np.ndarray):
        return obj
    if isinstance(obj, dict):
        return {k: _convert_chumpy(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return type(obj)(_convert_chumpy(v) for v in obj)
    return obj


# ==================== SMPL Model ====================

MODELS_DIR = Path(__file__).parent / "models"


class SMPLModel:
    """
    Load SMPL .pkl model và tính forward pass (shape only).
    Pose cố định T-pose (θ = 0), chưa dùng LBS.
    """

    def __init__(self, model_path: str):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"SMPL model not found: {model_path}")

        with open(model_path, "rb") as f:
            raw = pickle.load(f, encoding="latin1")

        # Convert all chumpy mock objects → numpy arrays
        model_data = _convert_chumpy(raw)

        self.v_template = np.array(model_data["v_template"], dtype=np.float64)  # (6890, 3)
        self.shapedirs_full = np.array(model_data["shapedirs"], dtype=np.float64)  # (6890, 3, 300)
        self.faces = np.array(model_data["f"], dtype=np.int32)                      # (13776, 3)

        # Dùng 10 components đầu (đủ cho hầu hết biến đổi body shape)
        self.n_betas = 10
        self.shapedirs = self.shapedirs_full[:, :, :self.n_betas]  # (6890, 3, 10)

        self.n_vertices = self.v_template.shape[0]  # 6890
        self.n_faces = self.faces.shape[0]           # 13776

    def forward(self, betas: np.ndarray) -> np.ndarray:
        """
        SMPL forward pass (shape only, T-pose).
        v_shaped = v_template + shapedirs @ betas
        """
        betas = np.clip(np.asarray(betas, dtype=np.float64), -3.0, 3.0)

        if len(betas) < self.n_betas:
            betas = np.pad(betas, (0, self.n_betas - len(betas)))
        elif len(betas) > self.n_betas:
            betas = betas[: self.n_betas]

        # shapedirs: (6890, 3, 10) @ betas: (10,) → (6890, 3)
        shape_offset = np.einsum("ijk,k->ij", self.shapedirs, betas)
        v_shaped = self.v_template + shape_offset

        return v_shaped.astype(np.float32)

    def get_mesh(self, betas: np.ndarray) -> dict:
        """Tính vertices + trả kèm faces cho API."""
        vertices = self.forward(betas)
        return {
            "vertices": vertices.flatten().tolist(),
            "faces": self.faces.flatten().tolist(),
            "n_vertices": self.n_vertices,
            "n_faces": self.n_faces,
        }


# ==================== Loaders ====================

def load_smpl_male() -> SMPLModel | None:
    path = MODELS_DIR / "smpl_male.pkl"
    return SMPLModel(str(path)) if path.exists() else None


def load_smpl_female() -> SMPLModel | None:
    path = MODELS_DIR / "smpl_female.pkl"
    return SMPLModel(str(path)) if path.exists() else None


def load_smpl_neutral() -> SMPLModel | None:
    path = MODELS_DIR / "smpl_neutral.pkl"
    return SMPLModel(str(path)) if path.exists() else None
