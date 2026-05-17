import os
import sys
import types
import pickle
import copyreg
import numpy as np
from pathlib import Path

# Khỏi quan tâm hai hàm này, nó chỉ để convert dữ liệu sau khi pickle load xong thôi
def _convert_chumpy(obj):

    # Mục đích: Sau khi pickle load xong, dữ liệu vẫn bọc trong object giả. Hàm này đệ quy tìm và convert hết sang np.ndarray.

    """Convert chumpy mock objects → numpy arrays."""
    if hasattr(obj, "_chumpy_mock"):
        for attr in ("x", "r", "dterms"):
            val = getattr(obj, attr, None)
            if val is not None:
                return np.asarray(_convert_chumpy(val))
        return np.zeros(0, dtype=np.float64)
    if isinstance(obj, np.ndarray):
        return obj
    if isinstance(obj, dict):
        return {k: _convert_chumpy(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return type(obj)(_convert_chumpy(v) for v in obj)
    return obj

def _setup_chumpy_mock():
    # File .pkl của SMPL v1.1.0 chứa object chumpy.Ch — thư viện cũ không chạy được trên Python ≥ 3.12. Ta cần giả lập nó để pickle.load() không bị lỗi.
    # Mục đích : Khi pickle.load() gặp class chumpy.Ch, nó sẽ tạo object giả thay vì crash. Bước tiếp theo ta sẽ convert object giả này sang numpy.

    class Ch:
        _chumpy_mock = True
        def __setstate__(self, state):
            if isinstance(state, dict):
                self.__dict__.update(state)

    # Đăng ký fake modules
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

    _orig = copyreg._reconstructor
    def _patched(cls, base, state):
        mod = getattr(cls, "__module__", "") or ""
        if mod.startswith("chumpy") or getattr(cls, "_chumpy_mock", False):
            return object.__new__(Ch)
        return _orig(cls, base, state)
    copyreg._reconstructor = _patched

def create_object_smpl(name):
    # name = "smpl_male", "smpl_female", hoặc "smpl_neutral"
    path = model_path / f"{name}.pkl"
    if path.exists():
        return SMPLModel(str(path))
    return None

_setup_chumpy_mock() # Mới vô cần convert chumpy mock sang numpy - Tại sao thì do phiên bản gì gì đó. Lười đọc =))
# Giờ tới load ba mảng v_template, shapedirs và faces từ file .pkl

# Tìm đường dẫn đến file
model_path = Path(__file__).parent / "models" #  Output: apps/backend-smpl/smpl_model.py

class SMPLModel:
    def __init__(self, model_path: str):
        with open(model_path, "rb") as f:
            data_from_model = pickle.load(f, encoding="latin1")
        
        data_numpy = _convert_chumpy(data_from_model)

        self.v_template = data_numpy["v_template"]
        self.shapedirs_full = data_numpy["shapedirs"]
        self.faces = data_numpy["f"]

        # Keyword : Nếu mấy tháng sau đọc lại trông kiểu dữ liệu shapedirs và shapedirs_full  như nào thì search AI nhé ^^ 
        self.n_betas = 10
        self.shapedirs = self.shapedirs_full[:, :, :self.n_betas]  # (6890, 3, 10) | Tưởng tượng nó có 100 thuộc tính thì số 10 ở (6890, 3, 10) nó chỉ lấy 10 thuộc tính đầu thôi | 

        self.n_vertices = self.v_template.shape[0]  # 6890
        self.n_faces = self.faces.shape[0]           # 13776

    # Hàm của v_shaped = v_template + shapedirs @ betas
    def forward(self, betas):

        # --- Bước 1: Chuyển betas thành numpy array ---
        # Phải chuyển vì np.clip, np.einsum và phép cộng ma trận ở bước 4-5 đều cần numpy array, không chạy được trên Python list thường
        betas = np.array(betas, dtype=np.float64)

        # --- Bước 2: Giới hạn giá trị trong [-3, 3] để chống người dùng nhập bậy 999 or -888
        betas = np.clip(betas, -3.0, 3.0)

        # --- Bước 3: Đảm bảo đúng 10 phần tử ---
        # Nếu user gửi ít hơn 10 → thêm số 0 vào cuối
        # Nếu user gửi nhiều hơn 10 → cắt bớt
        if len(betas) < self.n_betas:
            thieu = self.n_betas - len(betas)
            betas = np.pad(betas, (0, thieu))  # thêm 0 vào cuối
        elif len(betas) > self.n_betas:
            betas = betas[:self.n_betas]        # chỉ lấy 10 đầu

        # --- Bước 4: Phép tính v_shaped = v_template + shapedirs @ betas ---
        # np.einsum = Einstein summation — cách viết gọn phép nhân + cộng mảng nhiều chiều
        shape_offset = np.einsum("ijk,k->ij", self.shapedirs, betas)

        # --- Bước 5: Cộng phần dịch vào mesh trung bình → mesh mới ---
        v_shaped = self.v_template + shape_offset

        return v_shaped

    # Gọi forward() rồi chuyển sang dạng mảng phẳng mà Three.js cần
    def get_mesh(self, betas):
        # Bước 1: Tính mesh mới từ betas
        v_shaped = self.forward(betas)

        # Bước 2: Flatten — Three.js cần mảng phẳng 1 chiều
        # [[x0,y0,z0], [x1,y1,z1]] → [x0,y0,z0, x1,y1,z1]
        vertices_flat = v_shaped.flatten().tolist()
        faces_flat = self.faces.flatten().tolist()

        # Bước 3: Trả về dict để API response dùng
        return {
            "vertices": vertices_flat,
            "faces": faces_flat,
            "n_vertices": self.n_vertices,
            "n_faces": self.n_faces,
        }
    

