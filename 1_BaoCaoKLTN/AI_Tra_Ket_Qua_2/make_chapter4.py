"""
Tạo Chương 4 - Cài Đặt và Thiết Kế Giao Diện cho TMF Virtual Fitting Room 3D.
Format bám sát draft.docx:
  - Heading 2: tên chương, CENTER
  - Heading 3: 4.1, 4.2 ... JUSTIFY
  - Heading 4: 4.1.1, 4.1.2 ... left_indent ~171450 EMU (~0.6cm)
  - Normal bullet items: left_indent ~628650 EMU (~2.2cm)
"""

import docx
from docx.shared import Pt, Cm, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = docx.Document()

for sec in doc.sections:
    sec.top_margin    = Cm(2.0)
    sec.bottom_margin = Cm(2.0)
    sec.left_margin   = Cm(3.0)
    sec.right_margin  = Cm(2.0)

normal = doc.styles['Normal']
normal.font.name        = 'Times New Roman'
normal.font.size        = Pt(13)
normal.paragraph_format.line_spacing = 1.5

H4_LI   = Emu(171450)   # Heading 4 left indent  (~0.6cm)
ITEM_LI  = Emu(628650)  # bullet item left indent (~2.2cm)

def run(p, text, bold=False, italic=False):
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.bold   = bold
    r.italic = italic
    return r

def heading2(text):
    p = doc.add_paragraph(style='Heading 2')
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    return p

def heading3(text):
    p = doc.add_paragraph(style='Heading 3')
    r = p.add_run(text)
    r.bold = True
    r.font.name = 'Times New Roman'
    return p

def heading4(text):
    """Heading 4 - left_indent như draft"""
    p = doc.add_paragraph(style='Heading 4')
    p.paragraph_format.left_indent = H4_LI
    r = p.add_run(text)
    r.bold = True
    r.font.name = 'Times New Roman'
    return p

def item(label, detail=''):
    """Bullet item với left_indent 2.2cm, label bold + detail plain"""
    p = doc.add_paragraph()
    p.paragraph_format.alignment    = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.left_indent  = ITEM_LI
    run(p, label, bold=True)
    if detail:
        run(p, detail)
    return p

def item_plain(text):
    """Bullet item plain text"""
    p = doc.add_paragraph()
    p.paragraph_format.alignment    = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.left_indent  = ITEM_LI
    run(p, text)
    return p

def body(text):
    """Normal paragraph justify"""
    p = doc.add_paragraph()
    p.paragraph_format.alignment         = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing      = 1.5
    p.paragraph_format.first_line_indent = Cm(0.8)
    p.paragraph_format.left_indent       = Cm(0.8)
    run(p, text)
    return p

def blank():
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.5

# ══════════════════════════════════════════════════════════════════════════════
# CHƯƠNG 4
# ══════════════════════════════════════════════════════════════════════════════
heading2('CHƯƠNG 4. CÀI ĐẶT VÀ THIẾT KẾ GIAO DIỆN')

# ── 4.1 Yêu cầu môi trường ───────────────────────────────────────────────────
heading3('4.1. Yêu cầu môi trường')

heading4('4.1.1. Yêu cầu chung')
item_plain('Git version 2.x trở lên')
item_plain('IDE/Text Editor (Visual Studio Code hoặc tương đương)')
item_plain('Docker Desktop (để chạy AI Engine FastAPI)')

heading4('4.1.2. Yêu cầu cho Frontend (Next.js)')
item_plain('Node.js version 20.x trở lên')
item_plain('npm version 9.x trở lên hoặc yarn version 1.22.x trở lên')
item_plain('Dung lượng ổ đĩa trống tối thiểu 1GB')
item_plain('Trình duyệt hỗ trợ WebGL (Chrome 90+, Firefox 88+, Edge 90+)')

heading4('4.1.3. Yêu cầu cho Backend (HonoJS/Node.js)')
item_plain('Node.js version 20.x trở lên')
item_plain('npm version 9.x trở lên')
item_plain('MongoDB (Atlas Cloud hoặc local instance)')
item_plain('Dung lượng ổ đĩa trống tối thiểu 1GB')

heading4('4.1.4. Yêu cầu cho AI Engine (FastAPI/Python)')
item_plain('Docker Desktop version 24.x trở lên (khuyến nghị)')
item_plain('Hoặc Python 3.10 trở lên (nếu chạy trực tiếp không dùng Docker)')
item_plain('PyTorch 1.13 trở lên (CPU hoặc CUDA)')
item_plain('RAM tối thiểu 8GB (khuyến nghị 16GB để load đủ các model TailorNet)')
item_plain('Dung lượng ổ đĩa trống tối thiểu 10GB (cho model weights SMPL và TailorNet)')

# ── 4.2 Các bước cài đặt ─────────────────────────────────────────────────────
heading3('4.2. Các bước cài đặt và chạy ứng dụng')

heading4('4.2.1. Cài đặt Frontend (Next.js)')
item('Clone project từ repository: ',
     'https://github.com/TuanMinh1905/TMF-FittingRoom-Frontend.git')
item('Di chuyển vào thư mục frontend: ', 'cd frontend')
item('Tạo file môi trường: ',
     'Tạo file .env.local trong thư mục gốc, điền các biến NEXT_PUBLIC_API_URL, '
     'NEXT_PUBLIC_FASTAPI_URL theo địa chỉ server')
item('Cài đặt các dependencies: ', 'npm install')
item('Chạy ứng dụng ở môi trường development: ', 'npm run dev')
item_plain('Ứng dụng Frontend sẽ chạy tại cổng 3000 (http://localhost:3000)')

heading4('4.2.2. Cài đặt Backend (HonoJS/Node.js)')
item('Clone project từ repository: ',
     'https://github.com/TuanMinh1905/TMF-FittingRoom-Backend.git')
item('Di chuyển vào thư mục backend: ', 'cd backend')
item('Tạo file môi trường: ',
     'Tạo file .env trong thư mục gốc, điền các biến MONGODB_URI, JWT_SECRET, '
     'OPENAI_API_KEY, FASTAPI_URL theo cấu hình thực tế')
item('Cài đặt các dependencies: ', 'npm install')
item('Chạy ứng dụng ở môi trường development: ', 'npm run dev')
item_plain('Ứng dụng Backend sẽ chạy tại cổng 8000 (dựa theo cấu hình .env)')

heading4('4.2.3. Cài đặt AI Engine (FastAPI + SMPL + TailorNet)')
item('Clone project từ repository: ',
     'https://github.com/TuanMinh1905/TMF-FittingRoom-AIEngine.git')
item('Di chuyển vào thư mục AI Engine: ', 'cd ai-engine')
item('Tải model weights: ',
     'Đặt file SMPL model (.pkl) vào thư mục models/smpl/ và các file '
     'TailorNet weights vào thư mục models/tailornet/ theo hướng dẫn README')
item('Chạy bằng Docker (khuyến nghị): ', 'docker-compose up --build')
item('Hoặc chạy trực tiếp: ', 'pip install -r requirements.txt && uvicorn main:app --reload')
item_plain('AI Engine sẽ chạy tại cổng 5000 (http://localhost:5000)')
body(
    'Đối với AI Engine, khuyến khích sử dụng Docker để đảm bảo môi trường '
    'chạy nhất quán vì các thư viện như psbody-mesh, PyOpenGL và PyTorch '
    'có nhiều dependency native phức tạp, dễ gây xung đột khi cài đặt thủ công.'
)

# ── 4.3 Thiết kế giao diện ───────────────────────────────────────────────────
heading3('4.3. Thiết kế giao diện')

heading4('4.3.1. Trang chủ và danh mục sản phẩm')
body(
    'Trang chủ hiển thị banner giới thiệu hệ thống thử đồ ảo, danh mục sản phẩm '
    'nổi bật và thanh điều hướng chính. Giao diện được xây dựng bằng TailwindCSS '
    'với thiết kế responsive, hoạt động tốt trên cả desktop và tablet. Người dùng '
    'có thể lọc sản phẩm theo danh mục (áo sơ mi nam, áo sơ mi nữ, quần nam, '
    'quần nữ) và tìm kiếm theo tên sản phẩm.'
)

heading4('4.3.2. Trang chi tiết sản phẩm')
body(
    'Trang chi tiết sản phẩm hiển thị ảnh sản phẩm, thông tin mô tả, bảng size '
    'và nút "Thử ngay" để vào phòng thử đồ ảo. Nút AI Advisor cho phép người dùng '
    'nhập số đo cơ thể và nhận tư vấn size phù hợp từ mô hình GPT-4o-mini bằng '
    'tiếng Việt trực tiếp trên trang.'
)

heading4('4.3.3. Phòng thử đồ ảo 3D')
body(
    'Phòng thử đồ ảo là tính năng cốt lõi của hệ thống. Người dùng nhập số đo '
    'chiều cao (cm) và cân nặng (kg), hệ thống gọi API đến AI Engine để tạo mesh '
    'cơ thể SMPL và biến dạng trang phục bằng TailorNet. Avatar 3D và trang phục '
    'được render trực tiếp trên trình duyệt bằng Three.js và React Three Fiber. '
    'Người dùng có thể xoay camera 360 độ, phóng to thu nhỏ bằng OrbitControls '
    'và thay đổi trang phục mà không cần tải lại trang.'
)

heading4('4.3.4. Trang giỏ hàng và thanh toán')
body(
    'Giỏ hàng được quản lý bằng Zustand store, lưu trữ persistent qua localStorage '
    'để giữ sản phẩm khi người dùng tải lại trang. Trang thanh toán thu thập thông '
    'tin địa chỉ giao hàng và xác nhận đơn hàng, dữ liệu được lưu vào MongoDB '
    'thông qua API Backend.'
)

heading4('4.3.5. Trang đăng nhập và đăng ký')
body(
    'Hệ thống xác thực người dùng bằng JWT token, mật khẩu được mã hóa một chiều '
    'bằng bcryptjs trước khi lưu vào MongoDB. Sau khi đăng nhập thành công, token '
    'được lưu trong cookie HttpOnly và gửi kèm theo mỗi request đến Backend để '
    'xác thực quyền truy cập.'
)

blank()

# ── Lưu ──────────────────────────────────────────────────────────────────────
out = 'Chuong4_CaiDatGiaoDien.docx'
doc.save(out)
print(f'Saved: {out}')
