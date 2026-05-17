from contextlib import asynccontextmanager
from fastapi import FastAPI
import numpy as np
from smpl_model import create_object_smpl
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

_model = None # Tạo cái này trước mới global cái _model phía dưới được

@asynccontextmanager 
async def lifespan(app: FastAPI):
    global _model
    print("[SMPL] Loading male model...")
    _model = create_object_smpl("smpl_male")
    if _model:
        print(f"[SMPL] Ready — {_model.n_vertices} vertices, {_model.n_faces} faces")
    else:
        print("[SMPL] .pkl not found!")
    yield

# Gắn cái lifespan vô thì mới chạy được cái hàm async def lifespan cho server app
app = FastAPI(lifespan=lifespan)

# Middleware = "người trung gian" — code chạy ở giữa request đến và response đi, trước khi vào hàm xử lý chính.
# Mỗi request đến → middleware tự kiểm tra:
# "Request này từ localhost:3000 không? → OK, cho qua"
# "Request này từ localhost:9999 không? → Chặn"
# Rồi mới tới hàm xử lý chính
app.add_middleware(
    CORSMiddleware,                    # loại middleware
    allow_origins=["http://localhost:3000"],   # Chỉ cho phép frontend 3000 gọi
    allow_methods=["GET", "POST"],     # Chỉ cho phép http GET và POST nào
    allow_headers=["Content-Type"],    # cho phép header nào
)

# Bạn khai báo BetasType là class thường
# FastAPI chỉ parse JSON body khi class đó là Pydantic model (kế thừa BaseModel)
class BetasType(BaseModel):
    betas: list[float]  # định nghĩa kiểu dữ liệu cho betas, FastAPI sẽ tự động parse JSON body thành object này
# Tạo lại thằng này, sử dụng cái BaseModel cơ

@app.post("/smpl")
def post_mesh(req: BetasType): 
    if _model is None:
        return {"error": "Model not loaded"}
    betas = np.array(req.betas, dtype=np.float64)  # req.betas là list, convert thành numpy array
    v_shaped = _model.get_mesh(betas)  
    return v_shaped


