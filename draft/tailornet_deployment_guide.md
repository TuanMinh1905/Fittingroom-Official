# Hướng Dẫn Triển Khai TailorNet — Step by Step

> Đây là toàn bộ quá trình chúng ta đã làm để đi từ **2 repo GitHub gốc** đến **web phòng thử đồ ảo** hiện tại.

---

## Tổng quan pipeline

```
GIAI ĐOẠN 1: Chuẩn bị nguyên liệu
  └── Download TailorNet-master (Link 1)
  └── Download SMPL model (.pkl)
  └── Download Weights đã train (t-shirt, shirt, pant, short-pant...)
  └── Download TailorNet dataset meta (Link 2 - chỉ lấy meta)

GIAI ĐOẠN 2: Tích hợp & Custom
  └── Thêm folder backend/ (FastAPI server)
  └── Viết measurements_to_beta.py (số đo → SMPL params)
  └── Thêm frontend/ (HTML + Three.js)
  └── Cấu hình global_var.py (đường dẫn data)
  └── Đóng gói bằng Docker

GIAI ĐOẠN 3: Kết nối với web app chính
  └── Kết nối Next.js frontend → Hono proxy → TailorNet API
```

---

## GIAI ĐOẠN 1 — Chuẩn bị nguyên liệu

### Step 1.1 — Download TailorNet-master (Link 1)

Download hoặc clone repo gốc:
```
https://github.com/chaitanya100100/TailorNet
```

Cấu trúc gốc bạn nhận được:
```
TailorNet-master/
├── dataset/          ← Loader code để đọc dataset
├── models/           ← Kiến trúc model (TailorNetModel, SMPL4Garment...)
├── smpl_lib/         ← Thư viện xử lý SMPL
├── trainer/          ← Code training (SS2G, LF, HF, Baseline)
├── utils/            ← Các hàm tiện ích
├── visualization/    ← Render mesh bằng Blender
├── global_var.py     ← File cấu hình đường dẫn
└── run_tailornet.py  ← Script demo inference gốc
```

> **Lưu ý:** Repo gốc này là code nghiên cứu — không có web API, không có Docker, không có frontend. Chúng ta phải thêm tất cả những thứ đó.

---

### Step 1.2 — Download SMPL Model

SMPL là mô hình 3D body dùng trong nghiên cứu. **Phải đăng ký tài khoản** để download:

```
https://smpl.is.tue.mpg.de
```

Sau khi download `SMPL_python_v.1.0.0.zip`, giải nén và lấy các file `.pkl`:

```
smpl/models/
├── basicmodel_m_lbs_10_207_0_v1.0.0.pkl   ← Male model
├── basicModel_f_lbs_10_207_0_v1.0.0.pkl   ← Female model
└── basicModel_neutral_lbs_10_207_0_v1.0.0_no_hands.hdf5  ← Neutral
```

Sau đó chạy script của Link 2 để convert format:
```bash
python smpl_lib/convert_smpl_models.py
```

Kết quả là các file `model.pkl` đã được convert sang format Python3 tương thích.

**Đặt vào:**
```
data/smpl_models/
├── male/model.pkl
├── female/model.pkl
└── neutral/model.pkl
```

---

### Step 1.3 — Download Pretrained Weights

Đây là bước **quan trọng nhất** — download file weights đã train sẵn (không cần train lại):

| Garment | Link download | Kích thước |
|---------|--------------|-----------|
| t-shirt (male) | https://datasets.d2.mpi-inf.mpg.de/tailornet/t-shirt_male_weights.zip | ~2GB |
| t-shirt (female) | https://datasets.d2.mpi-inf.mpg.de/tailornet/t-shirt_female_weights.zip | ~2GB |
| shirt (male) | https://datasets.d2.mpi-inf.mpg.de/tailornet/shirt_male_weights.zip | ~2.5GB |
| shirt (female) | https://datasets.d2.mpi-inf.mpg.de/tailornet/shirt_female_weights.zip | ~2.5GB |
| pant, short-pant, skirt | https://nextcloud.mpi-klsb.mpg.de/index.php/s/LTWJPcRt7gsgoss | ~1-3GB mỗi loại |

Mỗi file zip khi giải nén chứa các folder:
```
t-shirt_male_weights/
├── tn_orig_baseline/      ← Weights của Baseline MLP
├── tn_orig_lf/            ← Weights của Low Frequency predictor
├── tn_orig_hf/            ← Weights của High Frequency predictor (21 pivot)
└── tn_orig_ss2g/          ← Weights của Shape-Style-to-Garment model
```

**Đặt tất cả vào:**
```
data/model_weights/
├── t-shirt_male_weights/
├── t-shirt_female_weights/
├── shirt_male_weights/
├── pant_male_weights/
├── short-pant_male_weights/
└── ...
```

---

### Step 1.4 — Download Dataset Meta (từ Link 2)

Chúng ta **không cần** download toàn bộ dataset (~70GB simulation data).  
Chỉ cần file meta nhỏ (`dataset_meta.zip`, vài MB):

```
https://huggingface.co/datasets/zycliao/TailorNet_dataset
```

Sau khi giải nén, lấy:
```
data/tailor_data/
├── apose.npy                   ← A-pose parameters (tư thế chuẩn)
├── garment_class_info.pkl      ← Topology của từng loại quần áo
├── split_static_pose_shape.npz ← Train/test split indices
├── t-shirt_male/
│   ├── pivots.txt              ← Danh sách pivot (shape_style) để load model
│   └── style_model.npz         ← PCA model cho style space
├── shirt_male/...
├── pant_male/...
└── ...
```

> **Giải thích `pivots.txt`:** TailorNet có 21 MLP khác nhau, mỗi MLP tương ứng 1 "pivot" (combination của shape + style). File này liệt kê tên các folder chứa weights của từng pivot. Model load đúng pivot mới chạy được.

---

## GIAI ĐOẠN 2 — Tích hợp & Custom

### Step 2.1 — Cấu hình global_var.py

File này quy định tất cả đường dẫn. Sửa để trỏ đúng vào thư mục `data/`:

```python
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(ROOT_DIR, 'data', 'tailor_data')

SMPL_PATH_MALE    = os.path.join(ROOT_DIR, 'data', 'smpl_models', 'male', 'model.pkl')
SMPL_PATH_FEMALE  = os.path.join(ROOT_DIR, 'data', 'smpl_models', 'female', 'model.pkl')
SMPL_PATH_NEUTRAL = os.path.join(ROOT_DIR, 'data', 'smpl_models', 'neutral', 'model.pkl')

MODEL_WEIGHTS_PATH = os.path.join(ROOT_DIR, 'data', 'model_weights')
LOG_DIR            = os.path.join(ROOT_DIR, 'data', 'model_weights')
```

---

### Step 2.2 — Tạo backend/ (FastAPI Server)

Repo gốc không có web server. Chúng ta tạo thêm `backend/` với 3 file:

#### `backend/main.py` — Web API chính

Đây là file mà chúng ta viết hoàn toàn mới. Nó làm:

1. **Nhận HTTP request** từ frontend Next.js qua Hono proxy:
   ```json
   POST /try-on
   {
     "height_cm": 175,
     "weight_kg": 65,
     "gender": "male",
     "garment_type": "t-shirt",
     "size_small": "M",
     "size_large": "XL"
   }
   ```

2. **Gọi measurements_to_beta** để convert số đo → SMPL beta params (vector 10 chiều)

3. **Load TailorNet runner** (cached trong RAM để tái dùng):
   ```python
   tn_runner = get_tailornet_runner('t-shirt', 'male')
   ```

4. **Chạy inference** (forward pass qua 21 MLP):
   ```python
   pred_displacement = tn_runner.forward(thetas=θ, betas=β, gammas=γ)
   ```
   Kết quả là vector **displacement** — mô tả quần áo lệch khỏi body bao nhiêu mm tại mỗi vertex.

5. **Gọi SMPL** để tính body mesh + garment mesh từ displacement:
   ```python
   body_mesh, garment_mesh = smpl.run(beta, theta, garment_class, garment_d)
   ```

6. **Render** 2 ảnh PNG (size M và size XL) bằng pyrender/OSMesa

7. **Trả về** ảnh base64 + mesh data JSON cho frontend

#### `backend/measurements_to_beta.py` — Converter số đo → SMPL params

File này là **custom hoàn toàn**, không có trong repo gốc.

SMPL model nhận vector **beta (10 chiều)** đại diện cho hình dạng cơ thể.
Người dùng nhập chiều cao/cân nặng bình thường → phải convert.

Logic cơ bản:
```python
# Mỗi dimension của beta = (số đo - trung bình) / scale
beta[0] = (height_cm - 175.0) / 15.0   # chiều cao
beta[1] = (weight_kg - 75.0) / 20.0    # cân nặng
# ... 8 chiều còn lại từ các số đo khác (vai, tay, ngực, eo, hông, chân)
```

> **Lưu ý dấu âm/dương:** Trong SMPL v1.1.0, beta âm = người to hơn, beta dương = người nhỏ hơn. Điều này khác intuition thông thường nên phải lưu ý.

#### `backend/renderer.py` — Render 3D mesh thành ảnh PNG

File này dùng **pyrender** (headless renderer, không cần màn hình) để:
- Tạo scene 3D với body mesh + garment mesh
- Đặt camera, ánh sáng
- Render ra ảnh PNG
- Encode thành base64 để trả về qua HTTP

---

### Step 2.3 — Tạo frontend/ (HTML + Three.js)

File `frontend/index.html` là giao diện demo đơn giản (chỉ dùng để test trực tiếp TailorNet API):
- Form nhập chiều cao, cân nặng, giới tính, loại áo, size
- Gọi `POST /try-on`
- Hiển thị 2 ảnh kết quả (size nhỏ / size lớn)
- Render 3D mesh bằng Three.js từ `mesh_data` trong response

> **Lưu ý:** Frontend này là giao diện test, không phải giao diện web chính. Giao diện chính của hệ thống là Next.js app (frontend-next).

---

### Step 2.4 — Đóng gói bằng Docker

Vì TailorNet cần rất nhiều dependencies cũ (Python 3.7, PyTorch 1.13, psbody.mesh...), chúng ta đóng gói bằng Docker để tránh conflict:

**`Dockerfile`** cài đúng thứ tự:
```dockerfile
FROM python:3.7-slim-bullseye

# 1. System libs (boost, osmesa để render không cần màn hình)
RUN apt-get install libboost-dev libosmesa6-dev ...

# 2. PyTorch CPU version (không cần GPU để inference)
RUN pip install torch==1.13.1+cpu ...

# 3. Core dependencies
RUN pip install numpy==1.21.6 scipy==1.7.3 chumpy==0.70 ...

# 4. psbody.mesh (phải build từ source - không có trên PyPI)
RUN git clone https://github.com/MPI-IS/mesh.git && pip install .

# 5. FastAPI + uvicorn (web server)
RUN pip install fastapi uvicorn ...

# 6. Chạy backend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`docker-compose.yml`** mount data vào container:
```yaml
services:
  tailornet:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data  ← Mount SMPL + weights vào container
```

---

## GIAI ĐOẠN 3 — Kết nối với Web App Chính

### Step 3.1 — Hono Proxy (backend-hono)

Frontend Next.js không gọi thẳng TailorNet API (port 8000) vì:
- Khác origin → CORS issues
- TailorNet API chậm (~30s lần đầu) → cần timeout lớn

Chúng ta tạo proxy trong Hono backend:

```
User → Next.js frontend → POST /api/tryon
                            ↓
                         Hono proxy (backend-hono)
                            ↓
                         TailorNet FastAPI (port 8000)
                            ↓
                         Kết quả ảnh base64 + mesh data
```

### Step 3.2 — Hiển thị kết quả trong Next.js

Frontend Next.js nhận kết quả gồm:
- `image_small` / `image_large`: ảnh PNG base64 → hiển thị trong `<img>`
- `mesh_data`: JSON vertices + faces → dựng 3D scene bằng Three.js

---

## Sơ đồ toàn bộ file structure sau khi hoàn chỉnh

```
TailorNet-master/               ← Thư mục triển khai chính
│
├── backend/                    ← [CUSTOM] Chúng ta viết mới
│   ├── main.py                 ← FastAPI server (POST /try-on)
│   ├── measurements_to_beta.py ← Convert số đo → SMPL beta
│   └── renderer.py             ← Render mesh → PNG base64
│
├── frontend/                   ← [CUSTOM] Demo UI đơn giản
│   └── index.html              ← Form test + Three.js 3D viewer
│
├── data/                       ← [DOWNLOAD] Dữ liệu ngoài
│   ├── smpl_models/            ← SMPL .pkl files (đăng ký smpl.is.tue.mpg.de)
│   ├── tailor_data/            ← Dataset meta (garment_class_info.pkl, apose.npy...)
│   └── model_weights/          ← Pretrained weights (download từ MPI server)
│       ├── t-shirt_male_weights/
│       ├── t-shirt_female_weights/
│       ├── shirt_male_weights/
│       ├── pant_male_weights/
│       └── short-pant_male_weights/
│
├── models/                     ← [GỐC] Kiến trúc model TailorNet
│   ├── tailornet_model.py      ← TailorNetModel class (21 MLP)
│   ├── smpl4garment.py         ← SMPL wrapper + garment skinning
│   └── ...
│
├── dataset/                    ← [GỐC] Data loader
├── smpl_lib/                   ← [GỐC] SMPL processing
├── utils/                      ← [GỐC] Utility functions
├── trainer/                    ← [GỐC] Training code (chúng ta không dùng)
│
├── global_var.py               ← [SỬA] Cấu hình đường dẫn
├── Dockerfile                  ← [CUSTOM] Docker image
└── docker-compose.yml          ← [CUSTOM] Orchestration
```

---

## Luồng hoạt động khi User bấm "Thử đồ"

```
1. User nhập: 175cm, 65kg, male, t-shirt, size M vs XL

2. Next.js → POST /api/tryon (Hono proxy)

3. Hono → POST http://tailornet:8000/try-on

4. main.py nhận request:
   ├── measurements_to_beta(175, 65, 'male') → beta = [0.0, -0.5, ...]
   ├── garment_measurements_to_gamma('t-shirt', 'male', 'M') → gamma_M = [...]
   ├── garment_measurements_to_gamma('t-shirt', 'male', 'XL') → gamma_XL = [...]
   └── get_specific_pose(0) → theta = [standing pose params]

5. TailorNet inference (forward pass):
   ├── Load weights từ data/model_weights/t-shirt_male_weights/
   ├── tn_runner.forward(theta, beta, gamma_M) → displacement_M
   └── tn_runner.forward(theta, beta_ref, gamma_XL) → displacement_XL

6. SMPL skinning:
   ├── smpl.run(beta, theta, 't-shirt', displacement_M) → body_mesh + garment_M_mesh
   └── smpl.run(beta_ref, theta, 't-shirt', displacement_XL) → body_ref + garment_XL_mesh

7. Remove interpenetration (đẩy quần áo ra khỏi body nếu bị xuyên)

8. Render 2 ảnh (pyrender + OSMesa):
   ├── Panel trái: body + garment_M → image_small (base64 PNG)
   └── Panel phải: body_ref + garment_XL → image_large (base64 PNG)

9. Return JSON: { image_small, image_large, mesh_data }

10. Next.js hiển thị 2 ảnh so sánh
    Three.js render 3D mesh từ mesh_data
```

---

## Những điểm chúng ta tự làm thêm (không có trong repo gốc)

| Thành phần | Mô tả |
|---|---|
| `backend/main.py` | Viết hoàn toàn mới — FastAPI, caching model, endpoint /try-on và /try-on-outfit |
| `backend/measurements_to_beta.py` | Viết hoàn toàn mới — convert cm/kg → SMPL beta |
| `backend/renderer.py` | Viết mới — pyrender headless, 2 panels so sánh |
| `frontend/index.html` | Viết mới — Three.js 3D viewer, form nhập số đo |
| `Dockerfile` | Viết mới — giải quyết dependencies hell (psbody.mesh, chumpy...) |
| `docker-compose.yml` | Viết mới — mount data volumes |
| `global_var.py` | Sửa đường dẫn để auto-resolve trong Docker |
| Training short-pant | Tự train thêm model short-pant vì weights gốc chỉ có baseline |

---

## Thứ tự để tái tạo từ đầu

1. `git clone https://github.com/chaitanya100100/TailorNet`
2. Đăng ký https://smpl.is.tue.mpg.de → download + convert SMPL models
3. Download `dataset_meta.zip` từ HuggingFace → giải nén vào `data/tailor_data/`
4. Download weights t-shirt/shirt/pant/short-pant từ MPI server → đặt vào `data/model_weights/`
5. Cấu hình `global_var.py`
6. Viết `backend/main.py`, `measurements_to_beta.py`, `renderer.py`
7. Viết `Dockerfile` + `docker-compose.yml`
8. `docker build -t tailornet .` → `docker-compose up`
9. Test thử trên `frontend/index.html`
10. Kết nối với Next.js qua Hono proxy
