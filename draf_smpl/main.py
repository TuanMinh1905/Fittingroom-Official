# ===== SMPL Microservice — FastAPI =====
#
# Port: 8001
# Endpoints:
#   GET  /info  → model metadata (n_vertices, n_faces, model_type)
#   POST /mesh  → nhận {"betas": [10 floats]} → trả {"vertices": [...], "faces": [...]}
#
# CORS: localhost:3000 (Next.js) + localhost:8000 (Hono gateway)

import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from smpl_model import load_smpl_male, SMPLModel
from procedural_model import ProceduralModel


# ==================== Startup ====================

_model: SMPLModel | ProceduralModel | None = None
_model_type: str = "none"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load SMPL model khi server khởi động. Fallback → procedural."""
    global _model, _model_type
    print("[SMPL] Loading male model...")
    _model = load_smpl_male()
    if _model:
        _model_type = "smpl_pkl"
        print(f"[SMPL] Ready — {_model.n_vertices} vertices, {_model.n_faces} faces")
    else:
        print("[SMPL] .pkl not found → using procedural fallback")
        _model = ProceduralModel()
        _model_type = "procedural"
        print(f"[SMPL] Procedural ready — {_model.n_vertices} vertices, {_model.n_faces} faces")
    yield
    print("[SMPL] Shutting down")


app = FastAPI(title="SMPL Service", lifespan=lifespan)

# CORS — cho phép frontend (Next.js :3000) và gateway (Hono :8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# ==================== Schemas ====================

class MeshRequest(BaseModel):
    betas: list[float]


# ==================== Endpoints ====================

@app.get("/info")
async def get_info():
    """Trả metadata — frontend dùng để check service sống + model type."""
    return {
        "n_vertices": _model.n_vertices if _model else 0,
        "n_faces": _model.n_faces if _model else 0,
        "model_type": _model_type,
        "ready": _model is not None,
    }


@app.post("/mesh")
async def post_mesh(req: MeshRequest):
    """
    Nhận betas → forward pass → trả flat arrays.
    - betas: list 10 floats (clamp [-3, 3] bên trong forward)
    - vertices: flat float32 array [x0,y0,z0, x1,y1,z1, ...]
    - faces: flat int array [i0,j0,k0, i1,j1,k1, ...]
    """
    if _model is None:
        return {"error": "Model not loaded", "vertices": [], "faces": []}

    betas = np.array(req.betas, dtype=np.float64)
    mesh = _model.get_mesh(betas)
    return mesh
