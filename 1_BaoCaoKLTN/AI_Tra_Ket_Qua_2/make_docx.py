"""
Tạo file docx với format chính xác theo draf.docx:
- Style Normal, align JUSTIFY
- "Lý thuyết:" / "Thực hành:" -> italic
- Bullet items ở Lý thuyết -> plain text (dùng list bullet style)
- Bullet items ở Thực hành -> bold tech name + plain description
- Font Times New Roman 13pt, line spacing 1.5, margins chuẩn KLTN
"""
import docx
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

# ── Mở draf.docx để lấy đúng document styles gốc ──────────────────────────
src = docx.Document('..\\draf.docx')
doc = docx.Document()

# ── Margin chuẩn KLTN ──────────────────────────────────────────────────────
for sec in doc.sections:
    sec.top_margin    = Cm(2.0)
    sec.bottom_margin = Cm(2.0)
    sec.left_margin   = Cm(3.0)
    sec.right_margin  = Cm(2.0)

# ── Default style ───────────────────────────────────────────────────────────
normal = doc.styles['Normal']
normal.font.name        = 'Times New Roman'
normal.font.size        = Pt(13)
normal.paragraph_format.line_spacing = 1.5
normal.paragraph_format.alignment    = WD_ALIGN_PARAGRAPH.JUSTIFY

def new_para(bullet_char='●'):
    """Tạo paragraph mới với bullet ký tự ● ở đầu, căn justify."""
    p = doc.add_paragraph()
    p.paragraph_format.alignment    = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.5
    # Tab stop bắt chước indent sau bullet (0.5cm)
    p.paragraph_format.left_indent  = Cm(0.5)
    p.paragraph_format.first_line_indent = Cm(-0.5)
    r_bullet = p.add_run(bullet_char + '\t')
    r_bullet.font.name = 'Times New Roman'
    r_bullet.font.size = Pt(13)
    return p

def add_run(p, text, bold=False, italic=False):
    r = p.add_run(text)
    r.font.name  = 'Times New Roman'
    r.font.size  = Pt(13)
    r.bold       = bold
    r.italic     = italic
    return r

def plain_para(text, italic=False):
    """Paragraph không bullet, căn justify."""
    p = doc.add_paragraph()
    p.paragraph_format.alignment    = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.5
    add_run(p, text, italic=italic)
    return p

def blank():
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.5

# ═══════════════════════════════════════════════════════════════════════════
# NỘI DUNG
# ═══════════════════════════════════════════════════════════════════════════

# ── Lý thuyết: ─────────────────────────────────────────────────────────────
plain_para('Lý thuyết:', italic=True)

ly_thuyet_groups = [
    'Next.js (React), TypeScript, TailwindCSS, Zustand',
    'Three.js, React Three Fiber',
    'Node.js, HonoJS, RESTful API, MongoDB, Mongoose, bcryptjs',
    'FastAPI (Python), PyTorch, Docker',
    'SMPL, TailorNet',
    'OpenAI API (GPT-4o-mini)',
]
for group in ly_thuyet_groups:
    p = new_para('●')
    add_run(p, group)

blank()

# ── Thực hành: ─────────────────────────────────────────────────────────────
plain_para('Thực hành:', italic=True)

thuc_hanh = [
    ('Next.js:', ' Framework React full-stack, hỗ trợ SSR và dynamic import, dùng để xây dựng giao diện phòng thử đồ ảo và các trang thương mại điện tử.'),
    ('TypeScript:', ' Ngôn ngữ mở rộng JavaScript với kiểu tĩnh, dùng để định nghĩa kiểu dữ liệu cho Product, User, mesh 3D, giúp đồng bộ dữ liệu giữa frontend và backend.'),
    ('TailwindCSS:', ' Framework CSS utility-first, dùng để xây dựng giao diện responsive cho toàn bộ ứng dụng.'),
    ('Zustand:', ' Thư viện quản lý trạng thái cho React, dùng để lưu giỏ hàng, dữ liệu mesh 3D, danh sách sản phẩm trên toàn ứng dụng.'),
]
for bold_part, plain_part in thuc_hanh:
    p = new_para('●')
    add_run(p, bold_part, bold=True)
    add_run(p, plain_part)

blank()

thuc_hanh_2 = [
    ('Three.js, React Three Fiber:', ' Bộ thư viện đồ họa 3D chạy trên WebGL, dùng để render model cơ thể người và trang phục trực tiếp trên trình duyệt.'),
    ('Node.js:', ' Runtime JavaScript phía server, nền tảng để chạy backend HonoJS và toàn bộ toolchain frontend.'),
    ('HonoJS:', ' Framework backend nhẹ trên Node.js, dùng để xây dựng RESTful API cho sản phẩm, đơn hàng, xác thực người dùng và tư vấn AI.'),
    ('RESTful API:', ' Kiến trúc chuẩn để frontend và các service Python trao đổi dữ liệu mesh 3D, thông tin sản phẩm và đơn hàng.'),
    ('MongoDB, Mongoose:', ' Cơ sở dữ liệu NoSQL document-based và ODM tương ứng, lưu trữ sản phẩm, người dùng, đơn hàng, bảng số đo sizeChart.'),
    ('bcryptjs:', ' Thư viện mã hóa mật khẩu một chiều, dùng để hash và xác thực mật khẩu người dùng khi đăng ký và đăng nhập.'),
]
for bold_part, plain_part in thuc_hanh_2:
    p = new_para('●')
    add_run(p, bold_part, bold=True)
    add_run(p, plain_part)

blank()

thuc_hanh_3 = [
    ('FastAPI:', ' Framework Python hiệu năng cao, dùng để xây dựng API nhận số đo cơ thể và trả về dữ liệu mesh 3D từ mô hình SMPL và TailorNet.'),
    ('PyTorch:', ' Framework học sâu, dùng để chạy inference mô hình TailorNet dự đoán biến dạng 3D của trang phục.'),
    ('Docker:', ' Công cụ container hóa, dùng để đóng gói và chạy TailorNet backend với đầy đủ thư viện nặng (PyTorch, psbody-mesh, PyOpenGL).'),
    ('SMPL:', ' Mô hình toán học biểu diễn cơ thể người 3D với 6890 đỉnh, tạo ra mesh avatar từ các thông số chiều cao và cân nặng.'),
    ('TailorNet:', ' Mô hình học sâu dự đoán biến dạng 3D của quần áo theo hình dáng và tư thế cơ thể, là lõi AI của hệ thống thử đồ ảo.'),
    ('OpenAI API (GPT-4o-mini):', ' Mô hình ngôn ngữ lớn, dùng để xây dựng AI Advisor tư vấn chọn size trang phục bằng tiếng Việt dựa trên số đo cơ thể người dùng.'),
]
for bold_part, plain_part in thuc_hanh_3:
    p = new_para('●')
    add_run(p, bold_part, bold=True)
    add_run(p, plain_part)

# ── Lưu file ────────────────────────────────────────────────────────────────
out = 'CongNgheSuDung.docx'
doc.save(out)
print(f'Saved: {out}')
