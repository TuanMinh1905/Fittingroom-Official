"""
Tạo Chương 2 - Cơ Sở Lý Thuyết cho đề tài TMF Virtual Fitting Room 3D.
Format bám sát draft.docx:
  - Heading 3 (bold, justify) cho mỗi mục 2.X
  - "X là gì?" -> Normal, first_line_indent, bold
  - Body -> Normal, first_line_indent + left_indent
  - "Ưu điểm:" / "Nhược điểm:" -> Normal, first_line_indent, bold
  - Sub-items (tên nhóm + nội dung) -> Normal, left_indent ~2cm
"""

import docx
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = docx.Document()

# ── Margins chuẩn KLTN ────────────────────────────────────────────────────────
for sec in doc.sections:
    sec.top_margin    = Cm(2.0)
    sec.bottom_margin = Cm(2.0)
    sec.left_margin   = Cm(3.0)
    sec.right_margin  = Cm(2.0)

# ── Normal style ──────────────────────────────────────────────────────────────
normal = doc.styles['Normal']
normal.font.name        = 'Times New Roman'
normal.font.size        = Pt(13)
normal.paragraph_format.line_spacing = 1.5

# ── Helpers ───────────────────────────────────────────────────────────────────
FI = Cm(0.8)   # first_line_indent  (~228600 EMU)
LI = Cm(2.0)   # left_indent for sub-items (~571500 EMU)
LI2 = Cm(0.8)  # left_indent for body continuation

def run(p, text, bold=False, italic=False):
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.bold   = bold
    r.italic = italic
    return r

def heading3(text):
    p = doc.add_paragraph(style='Heading 3')
    r = p.add_run(text)
    r.bold = True
    r.font.name = 'Times New Roman'
    return p

def la_gi(text):
    """'X là gì?' - bold, first_line_indent"""
    p = doc.add_paragraph()
    p.paragraph_format.alignment         = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing      = 1.5
    p.paragraph_format.first_line_indent = FI
    run(p, text, bold=True)
    return p

def body(text):
    """Body paragraph - justify, first_line_indent + left_indent"""
    p = doc.add_paragraph()
    p.paragraph_format.alignment         = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing      = 1.5
    p.paragraph_format.first_line_indent = FI
    p.paragraph_format.left_indent       = LI2
    run(p, text)
    return p

def section_title(text):
    """'Ưu điểm:' / 'Nhược điểm:' - bold, first_line_indent"""
    p = doc.add_paragraph()
    p.paragraph_format.alignment         = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing      = 1.5
    p.paragraph_format.first_line_indent = FI
    run(p, text, bold=True)
    return p

def sub_item(label, content):
    """Sub-item: label plain + content plain, left_indent"""
    p = doc.add_paragraph()
    p.paragraph_format.alignment    = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.left_indent  = LI
    run(p, label)
    if content:
        run(p, content)
    return p

def blank():
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.5

# ═══════════════════════════════════════════════════════════════════════════════
# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT
# ═══════════════════════════════════════════════════════════════════════════════
h2 = doc.add_paragraph(style='Heading 2')
h2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r2 = h2.add_run('CHƯƠNG 2. CƠ SỞ LÝ THUYẾT')
r2.font.name = 'Times New Roman'

# ═══════════════════════════════════════════════════════════════════════════════
# 2.1. Node.js
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.1. Node.js')

la_gi('Node.js là gì?')
body(
    'Node.js là một JavaScript runtime environment mã nguồn mở, chạy đa nền tảng, '
    'được xây dựng trên engine V8 của Google Chrome. Node.js cho phép thực thi mã '
    'JavaScript phía máy chủ, mang đến khả năng xây dựng các ứng dụng web có hiệu '
    'năng cao và khả năng mở rộng tốt. Trong dự án TMF Virtual Fitting Room 3D, '
    'Node.js đóng vai trò là nền tảng runtime để chạy toàn bộ backend HonoJS và '
    'toolchain của frontend Next.js.'
)

section_title('Ưu điểm:')
sub_item('Hiệu suất cao: ',
    'Node.js được xây dựng trên V8 engine của Google Chrome, cho phép biên dịch và '
    'thực thi JavaScript với tốc độ cao. Cơ chế non-blocking I/O và event-driven '
    'giúp Node.js xử lý đồng thời hàng nghìn kết nối mà không bị tắc nghẽn.')
sub_item('Khả năng mở rộng: ',
    'Node.js hoạt động theo mô hình single-threaded nhưng có thể mở rộng theo chiều '
    'ngang thông qua cluster module, phù hợp để triển khai microservice cho hệ thống '
    'thử đồ ảo quy mô lớn.')
sub_item('Ecosystem phong phú với NPM: ',
    'Node Package Manager (NPM) là một trong những kho thư viện lớn nhất, cung cấp '
    'hàng triệu package sẵn có, giúp tăng tốc độ phát triển các tính năng cho '
    'ứng dụng.')
sub_item('Dùng chung ngôn ngữ toàn stack: ',
    'Cả frontend (Next.js) và backend (HonoJS) đều sử dụng JavaScript/TypeScript, '
    'giúp nhóm phát triển dễ dàng chia sẻ code, kiểu dữ liệu và logic xử lý giữa '
    'hai tầng ứng dụng.')
sub_item('Cộng đồng lớn và hỗ trợ mạnh mẽ: ',
    'Node.js có cộng đồng đông đảo với nhiều tài liệu, thư viện mã nguồn mở và '
    'hỗ trợ kỹ thuật, giúp giải quyết nhanh các vấn đề phát sinh trong quá trình '
    'phát triển.')

section_title('Nhược điểm:')
sub_item('Hạn chế xử lý đa luồng: ',
    'Bản chất single-threaded của Node.js có thể trở thành nút cổ chai khi phải '
    'xử lý các tác vụ CPU-bound nặng. Đây là lý do dự án tách riêng phần '
    'inference AI (TailorNet, SMPL) sang backend Python/FastAPI.')
sub_item('Callback Hell: ',
    'Mặc dù async/await đã cải thiện đáng kể, các dự án lớn vẫn có thể gặp phải '
    'chuỗi callback lồng nhau phức tạp nếu không được quản lý cẩn thận.')
sub_item('Không phù hợp ứng dụng CPU-bound: ',
    'Node.js hoạt động tốt cho các ứng dụng I/O-bound nhưng không thích hợp cho '
    'các tác vụ tính toán nặng như xử lý mesh 3D hay training mô hình học sâu.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.2. MongoDB và Mongoose
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.2. MongoDB và Mongoose')

la_gi('MongoDB là gì?')
body(
    'MongoDB là một hệ quản trị cơ sở dữ liệu NoSQL document-based mã nguồn mở, '
    'lưu trữ dữ liệu dưới dạng các document JSON linh hoạt (BSON) thay vì bảng '
    'quan hệ cố định. Mongoose là một Object Document Mapper (ODM) cho Node.js, '
    'cung cấp lớp schema và validation trên MongoDB. Trong dự án TMF, MongoDB '
    'và Mongoose được sử dụng để lưu trữ toàn bộ dữ liệu nghiệp vụ: sản phẩm, '
    'người dùng, đơn hàng và bảng số đo sizeChart.'
)

section_title('Ưu điểm:')
sub_item('Schema linh hoạt: ',
    'MongoDB lưu trữ dữ liệu dạng document JSON, cho phép thêm trường mới vào '
    'collection mà không cần migrate schema như SQL. Điều này rất phù hợp khi '
    'cấu trúc dữ liệu sản phẩm thường xuyên thay đổi trong quá trình phát triển.')
sub_item('Hiệu suất đọc/ghi cao: ',
    'MongoDB được tối ưu cho các thao tác đọc/ghi nhanh trên dữ liệu phi cấu trúc, '
    'phù hợp với tải trọng của ứng dụng thương mại điện tử và phòng thử đồ ảo.')
sub_item('Tích hợp tốt với Node.js qua Mongoose: ',
    'Mongoose cung cấp schema validation, middleware (pre/post hooks) và populate '
    'để join document, giúp quản lý quan hệ giữa User, Order, Product và SizeChart '
    'một cách có cấu trúc dù MongoDB là NoSQL.')
sub_item('Khả năng mở rộng ngang: ',
    'MongoDB hỗ trợ sharding và replica set, cho phép mở rộng hệ thống theo chiều '
    'ngang khi lượng người dùng và dữ liệu sản phẩm tăng trưởng lớn.')
sub_item('Atlas Cloud miễn phí: ',
    'MongoDB Atlas cung cấp tier miễn phí với đầy đủ tính năng, phù hợp cho '
    'giai đoạn phát triển và demo của dự án KLTN.')

section_title('Nhược điểm:')
sub_item('Không hỗ trợ transaction phức tạp: ',
    'Mặc dù MongoDB đã hỗ trợ multi-document transaction từ phiên bản 4.0, '
    'nhưng hiệu năng và tính nhất quán vẫn thua kém so với các hệ RDBMS như '
    'PostgreSQL trong các nghiệp vụ tài chính phức tạp.')
sub_item('Tốn bộ nhớ hơn SQL: ',
    'Do lưu tên trường lặp lại trong từng document, MongoDB tiêu tốn dung lượng '
    'lưu trữ nhiều hơn so với cơ sở dữ liệu quan hệ với số lượng bản ghi lớn.')
sub_item('Thiếu ràng buộc toàn vẹn tham chiếu: ',
    'MongoDB không có foreign key constraint tự nhiên, nên việc đảm bảo toàn vẹn '
    'dữ liệu tham chiếu (ví dụ: Order phải trỏ đến User tồn tại) phải được xử lý '
    'ở tầng ứng dụng thông qua Mongoose.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.3. HonoJS
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.3. HonoJS')

la_gi('HonoJS là gì?')
body(
    'HonoJS là một framework web backend nhẹ, nhanh và hiện đại cho JavaScript/TypeScript, '
    'được thiết kế để chạy trên nhiều runtime khác nhau như Node.js, Bun, Deno, Cloudflare '
    'Workers và Edge Runtime. Tên "Hono" xuất phát từ tiếng Nhật có nghĩa là "lửa", '
    'phản ánh triết lý thiết kế tốc độ cao và tối giản. Trong dự án TMF Virtual Fitting '
    'Room 3D, HonoJS được sử dụng làm framework chính để xây dựng toàn bộ RESTful API '
    'backend, bao gồm quản lý sản phẩm, đơn hàng, xác thực người dùng và tích hợp '
    'AI Advisor.'
)

section_title('Ưu điểm:')
sub_item('Hiệu suất vượt trội: ',
    'HonoJS được đo hiệu suất thuộc nhóm nhanh nhất trong các Node.js framework, '
    'vượt qua Express và Fastify trong nhiều benchmark. Bộ định tuyến trie-based '
    'giúp xử lý routing cực kỳ nhanh ngay cả với số lượng route lớn.')
sub_item('API đơn giản và trực quan: ',
    'HonoJS có API thiết kế gọn gàng, dễ học, tương tự Express nhưng hỗ trợ TypeScript '
    'native. Các khái niệm như middleware, routing, context handler đều nhất quán '
    'và dễ tổ chức theo module cho từng nghiệp vụ (auth, product, order).')
sub_item('Hỗ trợ TypeScript toàn diện: ',
    'HonoJS được viết hoàn toàn bằng TypeScript và cung cấp type inference mạnh mẽ '
    'cho request, response và middleware chain, giúp phát hiện lỗi sớm trong quá '
    'trình phát triển API.')
sub_item('Middleware phong phú: ',
    'HonoJS đi kèm sẵn các middleware phổ biến như CORS, JWT authentication, logger, '
    'rate limiter và compress, giúp thiết lập nhanh các layer bảo mật và hiệu năng '
    'cho API mà không cần cài thêm thư viện ngoài.')
sub_item('Đa runtime - hướng tới Edge: ',
    'Cùng một codebase HonoJS có thể deploy lên Node.js, Bun, Cloudflare Workers '
    'hay Vercel Edge, tạo tính linh hoạt cao khi mở rộng hệ thống.')

section_title('Nhược điểm:')
sub_item('Ecosystem còn non trẻ: ',
    'So với Express hay Fastify, HonoJS ra đời muộn hơn nên số lượng plugin, '
    'tài liệu cộng đồng và ví dụ thực tế còn ít hơn, đòi hỏi nhà phát triển '
    'phải tự giải quyết nhiều vấn đề hơn.')
sub_item('Thiếu opinionated structure: ',
    'HonoJS không ép buộc cấu trúc dự án, nên với nhóm lớn hoặc dự án phức tạp, '
    'cần tự xây dựng convention rõ ràng để tránh code phân tán và khó bảo trì.')
sub_item('Chưa phổ biến tại Việt Nam: ',
    'Cộng đồng HonoJS tại Việt Nam còn nhỏ, tài liệu tiếng Việt hạn chế, gây '
    'khó khăn cho các thành viên mới khi tiếp cận và debug các vấn đề phức tạp.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.4. RESTful API
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.4. RESTful API')

la_gi('RESTful API là gì?')
body(
    'RESTful API (Representational State Transfer) là một kiến trúc thiết kế API web '
    'dựa trên các nguyên tắc của giao thức HTTP. REST sử dụng các phương thức HTTP '
    'chuẩn (GET, POST, PUT, PATCH, DELETE) để thao tác với tài nguyên (resource) được '
    'định danh bằng URI. Mỗi request là stateless, tức là server không lưu trạng thái '
    'client giữa các lần gọi. Trong dự án TMF Virtual Fitting Room 3D, RESTful API '
    'là chuẩn giao tiếp thống nhất giữa frontend Next.js, backend HonoJS và các '
    'service Python (FastAPI), đảm bảo các tầng ứng dụng độc lập và có thể thay thế '
    'nhau linh hoạt.'
)

section_title('Ưu điểm:')
sub_item('Đơn giản và phổ biến: ',
    'RESTful API sử dụng HTTP chuẩn nên được hỗ trợ trên mọi ngôn ngữ và nền tảng. '
    'Frontend Next.js và backend Python FastAPI có thể giao tiếp với HonoJS mà '
    'không cần thêm thư viện đặc biệt.')
sub_item('Stateless - dễ mở rộng: ',
    'Mỗi request chứa đầy đủ thông tin cần thiết (token, payload), server không '
    'cần lưu session. Điều này cho phép horizontal scaling dễ dàng khi lượng '
    'người dùng tăng cao.')
sub_item('Dễ test và debug: ',
    'Các endpoint REST có thể được test trực tiếp qua công cụ như Postman, curl '
    'hay Thunder Client, giúp nhóm phát triển kiểm tra API độc lập mà không cần '
    'giao diện người dùng.')
sub_item('Tách biệt frontend và backend rõ ràng: ',
    'RESTful API tạo ra ranh giới rõ ràng giữa frontend và backend, cho phép '
    'hai nhóm phát triển song song và độc lập, đặc biệt hữu ích trong mô hình '
    'microservice của dự án với nhiều service khác nhau.')
sub_item('Hỗ trợ nhiều định dạng dữ liệu: ',
    'Dù phổ biến nhất với JSON, RESTful API cũng hỗ trợ XML, multipart/form-data '
    'và binary, phù hợp để truyền cả dữ liệu text lẫn dữ liệu mesh 3D (OBJ buffer) '
    'giữa các service trong hệ thống.')

section_title('Nhược điểm:')
sub_item('Over-fetching và Under-fetching: ',
    'Endpoint REST trả về dữ liệu cố định, có thể nhiều hơn hoặc ít hơn những gì '
    'client cần. Frontend đôi khi phải gọi nhiều API để tổng hợp đủ thông tin '
    'hiển thị cho một màn hình.')
sub_item('Không có schema chuẩn hóa: ',
    'REST không có cơ chế ép buộc schema như GraphQL, dễ dẫn đến việc API response '
    'không nhất quán giữa các endpoint nếu không có convention và documentation '
    'rõ ràng từ đầu.')
sub_item('Versioning phức tạp khi mở rộng: ',
    'Khi API thay đổi breaking change, cần quản lý versioning (v1, v2,...) cẩn thận '
    'để không làm hỏng các client cũ, đây là bài toán thường gặp trong các hệ '
    'thống lâu dài.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.5. Next.js
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.5. Next.js')

la_gi('Next.js là gì?')
body(
    'Next.js là một framework React full-stack mã nguồn mở, được phát triển bởi Vercel, '
    'cho phép xây dựng ứng dụng web hiện đại với khả năng render phía máy chủ (Server-Side '
    'Rendering - SSR), tạo trang tĩnh (Static Site Generation - SSG) và hỗ trợ App Router '
    'với React Server Components. Next.js đơn giản hóa việc cấu hình webpack, routing và '
    'tối ưu hóa ảnh. Trong dự án TMF Virtual Fitting Room 3D, Next.js là nền tảng xây '
    'dựng toàn bộ giao diện người dùng, bao gồm trang danh mục sản phẩm, trang chi tiết, '
    'giỏ hàng và phòng thử đồ ảo 3D.'
)

section_title('Ưu điểm:')
sub_item('Hỗ trợ SSR và SSG tích hợp sẵn: ',
    'Next.js cho phép chọn chiến lược render phù hợp cho từng trang: SSR để đảm bảo '
    'dữ liệu luôn mới nhất, SSG để tăng tốc độ tải trang sản phẩm. Điều này cải '
    'thiện đáng kể SEO và trải nghiệm người dùng lần đầu truy cập.')
sub_item('App Router và React Server Components: ',
    'Next.js 13+ với App Router cho phép render component trực tiếp trên server, '
    'giảm lượng JavaScript gửi xuống client. Dynamic import và lazy loading được '
    'hỗ trợ tích hợp, giúp tối ưu bundle size cho scene 3D nặng.')
sub_item('File-based Routing đơn giản: ',
    'Cấu trúc thư mục /app tự động sinh route, giúp tổ chức các trang như '
    '/products, /fitting-room, /checkout rõ ràng mà không cần cấu hình router '
    'phức tạp.')
sub_item('Tối ưu hóa ảnh và font tự động: ',
    'Next.js Image component tự động lazy load, resize và serve định dạng WebP, '
    'giảm thời gian tải trang sản phẩm. next/font tối ưu hóa Google Fonts tải '
    'cục bộ không phụ thuộc vào CDN bên ngoài.')
sub_item('Tích hợp dễ dàng với hệ sinh thái React: ',
    'Next.js tương thích hoàn toàn với toàn bộ hệ sinh thái React bao gồm '
    'Three.js, React Three Fiber, Zustand và TailwindCSS, phù hợp để xây dựng '
    'phòng thử đồ ảo tương tác cao.')

section_title('Nhược điểm:')
sub_item('Độ phức tạp tăng khi dùng App Router: ',
    'App Router với Server Components, Client Components và streaming có learning '
    'curve cao. Việc phân biệt đúng khi nào dùng "use client" / "use server" '
    'đòi hỏi hiểu biết sâu để tránh lỗi hydration.')
sub_item('Thời gian build lâu với dự án lớn: ',
    'Khi số lượng trang và component tăng, thời gian build production của Next.js '
    'có thể kéo dài, ảnh hưởng đến CI/CD pipeline.')
sub_item('Phụ thuộc vào Vercel để tối ưu tốt nhất: ',
    'Một số tính năng của Next.js (Edge Runtime, ISR, Image Optimization) hoạt '
    'động tối ưu nhất khi deploy trên Vercel, có thể gặp hạn chế khi tự host '
    'trên các server khác.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.6. TypeScript
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.6. TypeScript')

la_gi('TypeScript là gì?')
body(
    'TypeScript là một ngôn ngữ lập trình mã nguồn mở được Microsoft phát triển, '
    'là tập mở rộng (superset) của JavaScript với hệ thống kiểu tĩnh tùy chọn. '
    'TypeScript được biên dịch xuống JavaScript thuần, cho phép chạy trên mọi môi '
    'trường hỗ trợ JavaScript. Hệ thống kiểu của TypeScript giúp phát hiện lỗi ngay '
    'trong quá trình viết code thay vì lúc runtime. Trong dự án TMF Virtual Fitting '
    'Room 3D, TypeScript được áp dụng toàn bộ trên cả frontend Next.js và backend '
    'HonoJS để định nghĩa kiểu dữ liệu cho Product, User, Order, mesh 3D và các '
    'response API, đảm bảo tính nhất quán dữ liệu giữa các tầng ứng dụng.'
)

section_title('Ưu điểm:')
sub_item('Phát hiện lỗi sớm tại compile time: ',
    'TypeScript kiểm tra kiểu dữ liệu ngay khi viết code, giúp bắt các lỗi như '
    'truyền sai kiểu tham số, truy cập thuộc tính không tồn tại hay gán nhầm '
    'kiểu dữ liệu trước khi chạy ứng dụng.')
sub_item('Tăng khả năng đọc và bảo trì code: ',
    'Interface và type rõ ràng giúp các thành viên trong nhóm hiểu ngay cấu trúc '
    'dữ liệu (ví dụ: kiểu Product có những trường gì, mesh 3D trả về dạng nào) '
    'mà không cần xem document riêng.')
sub_item('Hỗ trợ IDE và autocomplete tốt: ',
    'TypeScript cung cấp IntelliSense mạnh mẽ trên VS Code, tự động gợi ý thuộc '
    'tính, phương thức và kiểu trả về, giúp tăng tốc độ viết code đáng kể khi '
    'làm việc với các object phức tạp như mesh vertex data.')
sub_item('Tương thích ngược hoàn toàn với JavaScript: ',
    'Mọi code JavaScript hợp lệ đều là TypeScript hợp lệ. Các thư viện JavaScript '
    'có thể dùng trong dự án TypeScript thông qua @types declaration, giúp tích '
    'hợp dễ dàng với hệ sinh thái NPM phong phú.')
sub_item('Chia sẻ kiểu dữ liệu giữa frontend và backend: ',
    'Trong dự án TMF, các interface như ProductType, UserType, SizeChartType được '
    'định nghĩa một lần và dùng chung trên cả frontend Next.js lẫn backend HonoJS, '
    'đảm bảo dữ liệu đồng nhất xuyên suốt ứng dụng.')

section_title('Nhược điểm:')
sub_item('Thêm bước biên dịch: ',
    'TypeScript phải biên dịch sang JavaScript trước khi chạy, cần thiết lập '
    'tsconfig và toolchain (tsc, ts-node, esbuild). Điều này thêm độ phức tạp '
    'vào quy trình build so với JavaScript thuần.')
sub_item('Cần học thêm khái niệm mới: ',
    'Generics, Utility Types (Partial, Pick, Omit), Conditional Types và Decorators '
    'đòi hỏi thời gian làm quen, đặc biệt với những người mới chuyển từ JavaScript.')
sub_item('Type definition không phải lúc nào cũng chính xác: ',
    'Một số thư viện bên thứ ba có @types không đầy đủ hoặc lỗi thời, buộc nhà '
    'phát triển phải tự viết declaration file hoặc dùng any, giảm giá trị '
    'type-safety trong một số trường hợp.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.7. TailwindCSS
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.7. TailwindCSS')

la_gi('TailwindCSS là gì?')
body(
    'TailwindCSS là một framework CSS theo hướng tiện ích (utility-first), cung cấp '
    'hàng trăm class CSS nguyên tử sẵn có như flex, pt-4, text-center, rotate-90 '
    'để xây dựng giao diện trực tiếp trong HTML/JSX mà không cần rời khỏi file '
    'component. Thay vì viết CSS riêng theo BEM hay module, nhà phát triển kết hợp '
    'các utility class để tạo ra giao diện tùy biến hoàn toàn. Trong dự án TMF '
    'Virtual Fitting Room 3D, TailwindCSS được dùng để xây dựng toàn bộ giao diện '
    'responsive từ trang sản phẩm, giỏ hàng, trang thanh toán đến giao diện phòng '
    'thử đồ ảo.'
)

section_title('Ưu điểm:')
sub_item('Tốc độ phát triển giao diện nhanh: ',
    'Với TailwindCSS, nhà phát triển không cần chuyển qua lại giữa file JSX và CSS. '
    'Toàn bộ styling được thực hiện ngay trong JSX bằng class name, giúp chu kỳ '
    'thiết kế - xem kết quả - chỉnh sửa diễn ra cực nhanh.')
sub_item('Thiết kế linh hoạt và tùy biến cao: ',
    'TailwindCSS không áp đặt giao diện mặc định như Bootstrap, nhà phát triển '
    'tự do tạo ra design system riêng thông qua tailwind.config.js để định nghĩa '
    'màu sắc, font chữ, spacing và breakpoint phù hợp với thương hiệu TMF.')
sub_item('Responsive Design dễ dàng: ',
    'Các prefix breakpoint như sm:, md:, lg:, xl: cho phép điều chỉnh layout '
    'theo kích thước màn hình trực tiếp trong class name, giúp giao diện phòng '
    'thử đồ ảo hoạt động tốt trên cả desktop lẫn tablet.')
sub_item('Bundle size nhỏ nhờ PurgeCSS: ',
    'TailwindCSS tích hợp sẵn PurgeCSS để loại bỏ tất cả class không sử dụng '
    'khi build production, đảm bảo file CSS cuối cùng chỉ vài KB dù Tailwind '
    'gốc có hàng nghìn class.')
sub_item('Tích hợp tốt với Next.js và React: ',
    'TailwindCSS là lựa chọn mặc định được khuyến nghị trong các dự án Next.js, '
    'tích hợp liền mạch với PostCSS và hỗ trợ đầy đủ các pseudo-class như '
    'hover:, focus:, dark: cho các component tương tác.')

section_title('Nhược điểm:')
sub_item('Class name dài và khó đọc: ',
    'Khi một component có nhiều style, dòng className có thể trở nên rất dài và '
    'khó đọc, ví dụ: "flex items-center justify-between px-4 py-2 bg-white '
    'rounded-lg shadow-md hover:shadow-xl transition-all duration-300". Cần dùng '
    'công cụ như clsx hoặc cva để quản lý class có điều kiện.')
sub_item('Đường cong học tập ban đầu: ',
    'Người mới cần thời gian để nhớ tên các utility class và quy ước đặt tên '
    'của Tailwind, đặc biệt với các giá trị spacing, color scale và '
    'responsive prefix.')
sub_item('Khó tái sử dụng style phức tạp: ',
    'TailwindCSS không có cơ chế tạo mixin như SCSS, các component có cùng style '
    'phức tạp phải trùng lặp class name hoặc phải đóng gói thành React component '
    'riêng để tái sử dụng.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.8. Zustand
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.8. Zustand')

la_gi('Zustand là gì?')
body(
    'Zustand là một thư viện quản lý trạng thái (state management) nhỏ gọn, nhanh '
    'và linh hoạt cho React, được phát triển bởi Pmndrs (cùng nhóm tác giả của '
    'React Three Fiber). Zustand sử dụng hook API đơn giản, không yêu cầu Provider '
    'bọc ở root component như Redux hay Context API, và hỗ trợ devtools để debug '
    'trạng thái ứng dụng. Trong dự án TMF Virtual Fitting Room 3D, Zustand được '
    'dùng để quản lý các trạng thái toàn cục quan trọng: giỏ hàng, dữ liệu mesh 3D '
    'của cơ thể người dùng, danh sách sản phẩm đã chọn thử và thông tin người dùng '
    'đã đăng nhập.'
)

section_title('Ưu điểm:')
sub_item('API cực kỳ đơn giản: ',
    'Zustand chỉ cần một hàm create() để định nghĩa store với state và action, '
    'sau đó dùng hook useStore() để truy cập ở bất kỳ component nào mà không cần '
    'Provider, giảm đáng kể boilerplate so với Redux.')
sub_item('Hiệu năng cao với selector tối ưu: ',
    'Zustand chỉ re-render component khi đúng phần state mà component đó subscribe '
    'thay đổi. Selector function giúp component chỉ nhận đúng dữ liệu cần thiết, '
    'tránh re-render không cần thiết trong scene 3D phức tạp.')
sub_item('Hỗ trợ middleware tốt: ',
    'Zustand có middleware immer (cập nhật state bất biến dễ dàng), persist '
    '(lưu state vào localStorage để giữ giỏ hàng khi reload) và devtools '
    '(debug state qua Redux DevTools Extension).')
sub_item('Phù hợp với React Three Fiber: ',
    'Zustand được thiết kế bởi cùng nhóm tác giả với React Three Fiber, tích hợp '
    'tự nhiên để chia sẻ dữ liệu mesh 3D giữa scene Three.js và các component '
    'React như bảng điều khiển size và nút chọn sản phẩm.')
sub_item('Bundle size nhỏ: ',
    'Toàn bộ thư viện Zustand chỉ khoảng 1KB (gzip), không ảnh hưởng đáng kể đến '
    'bundle size của ứng dụng Next.js.')

section_title('Nhược điểm:')
sub_item('Thiếu cấu trúc cứng cho dự án lớn: ',
    'Zustand không ép buộc cách tổ chức store, các nhóm lớn cần tự đặt ra '
    'convention rõ ràng (slice pattern, tách store theo domain) để tránh '
    'state bị phân tán và khó bảo trì khi số lượng store tăng lên.')
sub_item('Ít tài liệu hơn Redux: ',
    'Cộng đồng và số lượng tài liệu hướng dẫn Zustand ít hơn Redux đáng kể, '
    'các pattern phức tạp như optimistic update hay undo/redo cần nhà phát '
    'triển tự thiết kế mà không có best practice rõ ràng.')
sub_item('Không có time-travel debugging đầy đủ: ',
    'Mặc dù Zustand hỗ trợ Redux DevTools, tính năng time-travel debugging '
    '(replay lại các action) không hoạt động đầy đủ như Redux Toolkit, '
    'gây khó khăn khi debug các luồng state phức tạp.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.9. Three.js và React Three Fiber
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.9. Three.js và React Three Fiber')

la_gi('Three.js và React Three Fiber là gì?')
body(
    'Three.js là một thư viện JavaScript mã nguồn mở cho phép tạo và hiển thị '
    'đồ họa 3D trên trình duyệt thông qua WebGL mà không cần cài đặt plugin. '
    'Three.js cung cấp các abstraction cấp cao như Scene, Camera, Mesh, Light, '
    'Material để xây dựng môi trường 3D phức tạp. React Three Fiber (R3F) là một '
    'renderer React cho Three.js, cho phép mô tả scene 3D bằng cú pháp JSX khai '
    'báo thay vì lệnh imperative, tích hợp hoàn toàn với hệ thống state và hook '
    'của React. Trong dự án TMF Virtual Fitting Room 3D, Two.js và React Three '
    'Fiber là lõi đồ họa để render mesh cơ thể người (SMPL) và trang phục '
    '(TailorNet) trực tiếp trên trình duyệt, cho phép người dùng xem và tương '
    'tác với avatar 3D trong thời gian thực.'
)

section_title('Ưu điểm:')
sub_item('Render 3D trực tiếp trên trình duyệt qua WebGL: ',
    'Three.js tận dụng GPU của máy người dùng thông qua WebGL để render mesh 3D '
    'với 6890 đỉnh (SMPL body) và hàng chục nghìn polygon trang phục ở tốc độ '
    '60fps mà không cần plugin hay phần mềm bổ sung.')
sub_item('React Three Fiber tích hợp tự nhiên với React: ',
    'R3F cho phép mô tả scene 3D bằng JSX khai báo, sử dụng useRef, useState, '
    'useEffect và Zustand store để điều khiển mesh, camera và ánh sáng như với '
    'bất kỳ component React nào, giảm đáng kể độ phức tạp tích hợp.')
sub_item('Hệ sinh thái Drei phong phú: ',
    'Thư viện @react-three/drei cung cấp sẵn các helper như OrbitControls, '
    'Environment, useGLTF, Html, giúp thiết lập nhanh tính năng xoay camera, '
    'ánh sáng môi trường và overlay UI trên scene 3D của phòng thử đồ ảo.')
sub_item('Hỗ trợ vật liệu và shader tùy chỉnh: ',
    'Three.js hỗ trợ đầy đủ các loại material như MeshStandardMaterial, '
    'MeshPhysicalMaterial và GLSL shader tùy chỉnh, cho phép render trang phục '
    'với chất liệu vải thực tế (PBR) và hiệu ứng ánh sáng chuyên nghiệp.')
sub_item('Kiểm soát camera linh hoạt: ',
    'OrbitControls cho phép người dùng xoay, phóng to, thu nhỏ và di chuyển '
    'camera quanh avatar 3D bằng chuột hoặc cảm ứng, cải thiện trải nghiệm '
    'xem trang phục từ nhiều góc độ khác nhau.')

section_title('Nhược điểm:')
sub_item('Hiệu năng phụ thuộc vào GPU client: ',
    'Render mesh 3D phức tạp với nhiều trang phục đồng thời đòi hỏi GPU tốt. '
    'Trên thiết bị cũ hoặc integrated graphics, framerate có thể giảm, ảnh '
    'hưởng đến trải nghiệm người dùng.')
sub_item('Bundle size lớn: ',
    'Three.js là thư viện nặng (khoảng 600KB gzip), cần tree-shaking cẩn thận '
    'và dynamic import để tránh làm tăng thời gian tải trang lần đầu của '
    'ứng dụng Next.js.')
sub_item('Debugging 3D phức tạp: ',
    'Lỗi render 3D (z-fighting, mesh interpenetration, normal flipping) khó '
    'phát hiện hơn lỗi UI thông thường và đòi hỏi hiểu biết về đồ họa máy '
    'tính để chẩn đoán và xử lý chính xác.')

blank()

# ── Lưu file ──────────────────────────────────────────────────────────────────
out = 'Chuong2_partial.docx'
# ═══════════════════════════════════════════════════════════════════════════════
# 2.10. FastAPI
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.10. FastAPI')

la_gi('FastAPI là gì?')
body(
    'FastAPI là một framework web Python hiệu năng cao, hiện đại, được xây dựng '
    'trên Starlette và Pydantic, hỗ trợ lập trình bất đồng bộ (async/await) và '
    'tự động sinh tài liệu API theo chuẩn OpenAPI (Swagger). FastAPI sử dụng '
    'Python type hints để validate dữ liệu đầu vào và đầu ra, giúp giảm đáng '
    'kể lỗi runtime. Trong dự án TMF Virtual Fitting Room 3D, FastAPI đóng vai '
    'trò là backend Python chuyên biệt, nhận số đo cơ thể từ frontend, chạy '
    'inference mô hình SMPL để tạo mesh avatar 3D và mô hình TailorNet để biến '
    'dạng trang phục 3D theo hình dáng cơ thể người dùng, sau đó trả về dữ liệu '
    'mesh dạng OBJ cho frontend hiển thị.'
)

section_title('Ưu điểm:')
sub_item('Hiệu năng cao ngang ngửa Node.js và Go: ',
    'FastAPI dựa trên ASGI (Asynchronous Server Gateway Interface) với Uvicorn, '
    'cho phép xử lý hàng nghìn request đồng thời. Các benchmark thực tế cho '
    'thấy FastAPI nhanh hơn Flask và Django REST Framework từ 2-3 lần.')
sub_item('Tự động sinh tài liệu API: ',
    'FastAPI tự động tạo giao diện Swagger UI tại /docs và ReDoc tại /redoc '
    'dựa trên type annotation, giúp nhóm phát triển frontend dễ dàng khám phá '
    'và test các endpoint AI mà không cần viết tài liệu thủ công.')
sub_item('Validation dữ liệu tự động với Pydantic: ',
    'Pydantic model tự động kiểm tra và ép kiểu dữ liệu đầu vào (số đo chiều '
    'cao, cân nặng, kích thước), trả về lỗi rõ ràng khi dữ liệu không hợp lệ, '
    'bảo vệ các mô hình AI khỏi đầu vào sai định dạng.')
sub_item('Tích hợp tự nhiên với PyTorch và NumPy: ',
    'FastAPI chạy trong môi trường Python, cho phép import và chạy trực tiếp '
    'các mô hình PyTorch (TailorNet), thư viện NumPy và psbody-mesh mà không '
    'cần serialization phức tạp như khi gọi từ ngôn ngữ khác.')
sub_item('Hỗ trợ async và background tasks: ',
    'FastAPI cho phép xử lý các tác vụ inference nặng trong background task '
    'hoặc async endpoint, tránh blocking server khi chạy inference TailorNet '
    'mất vài giây trên một request.')

section_title('Nhược điểm:')
sub_item('Thời gian khởi động chậm khi load mô hình: ',
    'Khi server FastAPI khởi động, việc load các mô hình TailorNet và SMPL vào '
    'RAM mất thời gian đáng kể (10-30 giây). Điều này cần được quản lý bằng '
    'cơ chế warm-up và cache để không ảnh hưởng đến trải nghiệm người dùng.')
sub_item('Tiêu tốn nhiều RAM: ',
    'Các mô hình TailorNet cho nhiều loại trang phục và giới tính cùng lúc '
    'tiêu tốn hàng GB RAM. Dự án phải triển khai LRU cache để evict các mô '
    'hình không dùng, tránh lỗi Out-of-Memory trong môi trường Docker.')
sub_item('Phụ thuộc vào môi trường Python nặng: ',
    'FastAPI backend yêu cầu cài đặt PyTorch, psbody-mesh, PyOpenGL và nhiều '
    'thư viện native phức tạp, buộc phải đóng gói bằng Docker để đảm bảo môi '
    'trường chạy nhất quán trên mọi máy.')

blank()

# ── Lưu file ──────────────────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════
# 2.11. SMPL
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.11. SMPL (Skinned Multi-Person Linear Model)')

la_gi('SMPL là gì?')
body(
    'SMPL (Skinned Multi-Person Linear Model) là một mô hình toán học thống kê '
    'biểu diễn hình dạng và tư thế cơ thể người 3D, được phát triển bởi nhóm '
    'nghiên cứu Max Planck Institute for Intelligent Systems. SMPL biểu diễn cơ '
    'thể người bằng một mesh 3D gồm 6890 đỉnh và 13776 tam giác, được điều khiển '
    'bởi hai tập tham số chính: tham số hình dạng (shape parameters β, 10 chiều) '
    'mã hóa các đặc trưng cơ thể như chiều cao, cân nặng, tỉ lệ cơ thể, và tham '
    'số tư thế (pose parameters θ, 72 chiều) mã hóa góc xoay của 24 khớp cơ thể. '
    'Trong dự án TMF Virtual Fitting Room 3D, SMPL được dùng để tạo mesh avatar '
    '3D cá nhân hóa từ số đo chiều cao và cân nặng của người dùng, làm đầu vào '
    'cho TailorNet biến dạng trang phục.'
)

section_title('Ưu điểm:')
sub_item('Biểu diễn cơ thể người chính xác và nhẹ: ',
    'SMPL chỉ cần 10 tham số shape và 72 tham số pose để tạo ra toàn bộ mesh '
    '6890 đỉnh, cực kỳ nhẹ so với việc lưu trữ trực tiếp tọa độ của từng đỉnh. '
    'Điều này cho phép truyền tải và xử lý nhanh chóng qua API.')
sub_item('Cá nhân hóa avatar theo số đo thực tế: ',
    'Bằng cách ánh xạ chiều cao và cân nặng người dùng sang không gian tham số '
    'β của SMPL, hệ thống tạo ra avatar 3D phản ánh đúng tỉ lệ cơ thể thực tế '
    'của từng người dùng, tăng độ chính xác khi thử đồ ảo.')
sub_item('Tương thích với TailorNet: ',
    'SMPL là định dạng đầu vào chuẩn của TailorNet. Mesh SMPL được tạo ra trực '
    'tiếp làm đầu vào cho TailorNet để tính toán biến dạng trang phục, đảm bảo '
    'trang phục ôm đúng hình dáng avatar mà không cần bước chuyển đổi trung gian.')
sub_item('Hỗ trợ đa dạng tư thế và giới tính: ',
    'SMPL cung cấp model riêng cho nam (SMPL-male) và nữ (SMPL-female), và hỗ '
    'trợ thay đổi tư thế cơ thể qua tham số pose, cho phép hiển thị avatar ở '
    'tư thế đứng thẳng chuẩn (A-pose, T-pose) để thử đồ.')
sub_item('Được chứng minh bởi nghiên cứu khoa học: ',
    'SMPL được công bố tại SIGGRAPH Asia 2015 và được sử dụng rộng rãi trong '
    'hàng trăm nghiên cứu về computer vision và đồ họa máy tính, đảm bảo độ '
    'tin cậy và chính xác của mô hình trong ứng dụng thực tế.')

section_title('Nhược điểm:')
sub_item('Không biểu diễn chi tiết bề mặt cơ thể: ',
    'SMPL chỉ nắm bắt hình dạng cơ thể ở mức độ tổng quát, không mô tả được '
    'các chi tiết bề mặt nhỏ như nếp nhăn da, cơ bắp chi tiết hay đặc điểm '
    'khuôn mặt, ảnh hưởng đến tính chân thực của avatar.')
sub_item('Yêu cầu file model weights lớn: ',
    'Các file model SMPL (.pkl) chứa ma trận blend shape và skinning weights '
    'có dung lượng lớn (hàng trăm MB), cần quản lý cẩn thận trong môi trường '
    'Docker với bộ nhớ hạn chế.')
sub_item('Giới hạn trong việc nắm bắt hình dạng cực đoan: ',
    'Không gian tham số β của SMPL được học từ một tập dữ liệu thống kê, nên '
    'có thể không biểu diễn chính xác các hình dạng cơ thể quá khác biệt so '
    'với phân phối huấn luyện (ví dụ: người rất béo phì hoặc quá gầy).')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.12. TailorNet
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.12. TailorNet')

la_gi('TailorNet là gì?')
body(
    'TailorNet là một mô hình học sâu (deep learning) dự đoán biến dạng 3D của '
    'trang phục theo hình dáng cơ thể (shape) và tư thế (pose) của người mặc, '
    'được phát triển bởi Patel et al. và công bố tại CVPR 2020. TailorNet nhận '
    'đầu vào là tham số shape (β) và pose (θ) của mô hình SMPL, sau đó dự đoán '
    'trường dịch chuyển đỉnh (vertex displacement field) của mesh trang phục, '
    'tạo ra trang phục 3D biến dạng tự nhiên theo hình dáng cơ thể cụ thể. Mô '
    'hình được huấn luyện riêng cho từng loại trang phục (áo sơ mi, quần, váy) '
    'và từng giới tính. Trong dự án TMF Virtual Fitting Room 3D, TailorNet là lõi '
    'AI cốt lõi của hệ thống thử đồ ảo, biến dạng mesh trang phục để khớp với '
    'avatar SMPL của người dùng, tạo trải nghiệm thử đồ chân thực.'
)

section_title('Ưu điểm:')
sub_item('Biến dạng trang phục chân thực theo cơ thể: ',
    'TailorNet dự đoán được sự biến dạng chi tiết của trang phục theo từng hình '
    'dáng cơ thể khác nhau, bao gồm cả nếp nhăn vải và vùng căng, tạo ra '
    'trang phục 3D trông tự nhiên hơn nhiều so với phương pháp biến dạng '
    'hình học đơn giản.')
sub_item('Inference nhanh sau khi load mô hình: ',
    'Sau khi mô hình TailorNet đã được load vào RAM, thời gian inference cho '
    'một bộ trang phục chỉ mất vài giây, đủ nhanh để cung cấp phản hồi '
    'tương tác trong thời gian thực cho người dùng thử đồ.')
sub_item('Hỗ trợ nhiều loại trang phục và giới tính: ',
    'TailorNet cung cấp các model riêng biệt cho áo sơ mi nam/nữ và quần '
    'nam/nữ, cho phép hệ thống TMF hỗ trợ đa dạng danh mục sản phẩm với '
    'độ chính xác cao cho từng loại.')
sub_item('Kết quả được chứng minh bởi nghiên cứu học thuật: ',
    'TailorNet được công bố tại CVPR 2020 - một trong những hội nghị khoa '
    'học máy tính hàng đầu thế giới, và đạt kết quả state-of-the-art tại '
    'thời điểm công bố về độ chính xác biến dạng trang phục 3D.')
sub_item('Có thể fine-tune với dữ liệu tùy chỉnh: ',
    'Kiến trúc TailorNet cho phép huấn luyện thêm với dữ liệu trang phục '
    'riêng, mở ra khả năng mở rộng hệ thống để hỗ trợ thêm các loại '
    'trang phục mới trong tương lai.')

section_title('Nhược điểm:')
sub_item('Tiêu tốn tài nguyên phần cứng rất lớn: ',
    'Mỗi model TailorNet cho một loại trang phục và giới tính chiếm hàng '
    'GB RAM. Khi chạy đồng thời nhiều model (shirt_male, shirt_female, '
    'pant_male, pant_female), hệ thống có thể gặp lỗi Out-of-Memory, '
    'buộc phải triển khai LRU cache và exclusive resource strategy.')
sub_item('Phụ thuộc vào môi trường phức tạp: ',
    'TailorNet yêu cầu PyTorch, psbody-mesh (thư viện xử lý mesh), '
    'PyOpenGL và cấu hình CUDA/CPU cụ thể. Việc thiết lập môi trường '
    'đúng đòi hỏi Docker hóa cẩn thận để tránh xung đột thư viện.')
sub_item('Giới hạn về loại trang phục hỗ trợ: ',
    'TailorNet chỉ hỗ trợ các loại trang phục được huấn luyện sẵn (áo '
    'sơ mi và quần). Các loại trang phục khác như áo khoác, váy dài, '
    'áo len đòi hỏi phải thu thập dữ liệu mô phỏng vật lý và huấn '
    'luyện lại từ đầu, tốn nhiều thời gian và tài nguyên.')

blank()

# ═══════════════════════════════════════════════════════════════════════════════
# 2.13. OpenAI API
# ═══════════════════════════════════════════════════════════════════════════════
heading3('2.13. OpenAI API')

la_gi('OpenAI API là gì?')
body(
    'OpenAI API là dịch vụ cung cấp quyền truy cập vào các mô hình ngôn ngữ lớn '
    '(Large Language Model - LLM) của OpenAI, bao gồm GPT-4o, GPT-4o-mini và các '
    'mô hình thế hệ mới, thông qua giao diện RESTful API. Các mô hình này có khả '
    'năng hiểu và sinh ngôn ngữ tự nhiên, phân tích ngữ cảnh, lý luận và trả lời '
    'câu hỏi phức tạp trong nhiều lĩnh vực. Trong dự án TMF Virtual Fitting Room '
    '3D, OpenAI API (GPT-4o-mini) được tích hợp để xây dựng tính năng AI Advisor - '
    'một trợ lý tư vấn thông minh có khả năng phân tích số đo cơ thể người dùng, '
    'so sánh với bảng size của sản phẩm và đưa ra gợi ý size trang phục phù hợp '
    'bằng tiếng Việt một cách tự nhiên và chính xác.'
)

section_title('Ưu điểm:')
sub_item('Khả năng hiểu ngôn ngữ tự nhiên xuất sắc: ',
    'GPT-4o-mini hiểu được các câu hỏi tư vấn phức tạp bằng tiếng Việt như '
    '"Tôi cao 170cm, nặng 65kg, nên mặc size gì?" và trả lời tự nhiên, '
    'chính xác dựa trên bảng size sản phẩm được cung cấp qua system prompt.')
sub_item('Tích hợp nhanh qua API đơn giản: ',
    'OpenAI API cung cấp SDK cho Node.js, cho phép tích hợp AI Advisor vào '
    'backend HonoJS chỉ với vài dòng code. Không cần setup infrastructure '
    'phức tạp hay quản lý model weights như TailorNet hay SMPL.')
sub_item('Hỗ trợ function calling và structured output: ',
    'GPT-4o-mini hỗ trợ function calling để trả về kết quả tư vấn dạng JSON '
    'có cấu trúc (size đề xuất, điểm fit, cảnh báo), giúp frontend dễ dàng '
    'parse và hiển thị kết quả một cách nhất quán.')
sub_item('Chi phí thấp với GPT-4o-mini: ',
    'GPT-4o-mini có chi phí API thấp hơn GPT-4o khoảng 15 lần trong khi '
    'vẫn đủ năng lực cho bài toán tư vấn size đơn giản, phù hợp với ngân '
    'sách hạn chế của dự án KLTN.')
sub_item('Không cần training dữ liệu: ',
    'Thay vì phải huấn luyện mô hình tư vấn riêng, hệ thống chỉ cần cung '
    'cấp bảng size sản phẩm và số đo người dùng qua prompt, GPT-4o-mini '
    'tự động suy luận và đưa ra gợi ý phù hợp.')

section_title('Nhược điểm:')
sub_item('Phụ thuộc vào dịch vụ bên thứ ba: ',
    'AI Advisor hoàn toàn phụ thuộc vào tính khả dụng của OpenAI API. Khi '
    'API gặp sự cố hoặc bảo trì, tính năng tư vấn sẽ không hoạt động, '
    'ảnh hưởng đến trải nghiệm người dùng.')
sub_item('Chi phí tăng theo lượng request: ',
    'Chi phí OpenAI API tính theo số token sử dụng. Khi số lượng người '
    'dùng tăng cao, chi phí API có thể tăng đáng kể và cần kiểm soát '
    'bằng rate limiting và caching kết quả tư vấn.')
sub_item('Không kiểm soát được model hoàn toàn: ',
    'OpenAI có thể cập nhật hoặc deprecate model bất kỳ lúc nào, buộc '
    'nhà phát triển phải theo dõi và cập nhật migration theo lịch của '
    'OpenAI. Ngoài ra, dữ liệu người dùng được gửi lên server của '
    'OpenAI, cần lưu ý về chính sách bảo mật và quyền riêng tư.')

blank()

# ── Lưu file ──────────────────────────────────────────────────────────────────
out = 'Chuong2_CoSoLyThuyet.docx'
doc.save(out)
print(f'Saved: {out}')
