# Hướng dẫn chạy dự án TMF Fitting Room 3D

Dự án này bao gồm 4 thành phần chính cần được khởi chạy đồng thời để hệ thống hoạt động đầy đủ:
1. **Frontend (Next.js)**: Giao diện người dùng.
2. **Backend (Hono/Node.js)**: API server chính xử lý dữ liệu (Sử dụng cổng mặc định của Hono).
3. **Backend SMPL (Python/FastAPI)**: Server xử lý tính toán mô hình 3D (Sử dụng cổng 8001).
4. **TailorNet (Docker)**: API xử lý hình ảnh thực tế (Sử dụng cổng 8000).

Dưới đây là các bước để cài đặt và khởi chạy từng thành phần. Bạn cần mở 4 cửa sổ Terminal khác nhau để chạy song song 4 thành phần này.

---

## 1. Khởi chạy Backend (Hono/Node.js)
Thư mục: `backend-hono`

**Bước 1:** Di chuyển vào thư mục backend:
```bash
cd backend-hono
```

**Bước 2:** Cài đặt các thư viện (Dự án sử dụng `pnpm`):
```bash
pnpm install
```

**Bước 3:** Khởi chạy server ở chế độ phát triển:
```bash
pnpm dev
```
*(Lệnh này sẽ chạy `tsx watch src/index.ts` để tự động reload khi có thay đổi code)*

---

## 2. Khởi chạy Frontend (Next.js)
Thư mục: `frontend-next`

**Bước 1:** Di chuyển vào thư mục frontend:
```bash
cd frontend-next
```

**Bước 2:** Cài đặt các thư viện:
```bash
pnpm install
```

**Bước 3:** Khởi chạy server ở chế độ phát triển:
```bash
pnpm dev
```
*(Ứng dụng Next.js thường sẽ khởi chạy tại `http://localhost:3000`)*

---

## 3. Khởi chạy Backend SMPL (Python)
Thư mục: `backend-smpl`

**Cách 1: Chạy tự động bằng file Start.bat (Dành cho Windows)**
Dự án đã có sẵn file script khởi chạy cho Windows, tự động kích hoạt môi trường ảo và chạy server:
```cmd
cd backend-smpl
.\start.bat
```

**Cách 2: Chạy thủ công (Nếu bạn chưa thiết lập môi trường ảo)**
Trong trường hợp chạy lần đầu hoặc script trên không hoạt động:

1. Di chuyển vào thư mục:
```bash
cd backend-smpl
```

2. Tạo môi trường ảo (nếu chưa có thư mục `venv`):
```bash
python -m venv venv
```

3. Kích hoạt môi trường ảo:
```bash
# Trên Windows:
.\venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate
```

4. Cài đặt các thư viện cần thiết:
```bash
pip install -r requirements.txt
```

5. Khởi chạy server FastAPI:
```bash
uvicorn main:app --reload --port 8001
```
*(FastAPI server sẽ chạy tại `http://localhost:8001`)*

---

## 4. Khởi chạy TailorNet (Docker)
Thư mục: `TailorNet/TailorNet-master`

Vì đây là model AI phức tạp, dự án đã đóng gói sẵn trong Docker để dễ dàng khởi chạy. Đảm bảo bạn đã cài đặt **Docker Desktop** và nó đang mở.

**Bước 1:** Di chuyển vào thư mục TailorNet:
```bash
cd TailorNet/TailorNet-master
```

**Bước 2:** Khởi chạy bằng Docker Compose:
```bash
docker-compose up --build
```
*(Nếu bạn dùng phiên bản Docker mới, lệnh có thể là `docker compose up --build`. Container sẽ chạy ở cổng `http://localhost:8000`)*

---
**💡 Tips & Lưu ý:**
- Đảm bảo bạn đã cài đặt sẵn **Node.js**, **Python** và **pnpm** trên máy tính.
- Nếu bạn chưa có `pnpm`, có thể cài đặt bằng lệnh: `npm install -g pnpm`.
- Hãy kiểm tra các file `.env` nếu có, để đảm bảo các thành phần được cấu hình đúng URL kết nối với nhau.
