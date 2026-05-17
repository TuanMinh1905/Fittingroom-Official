dev_notes.md : Lưu những thứ linh tinh khi phát hiện ra, như gh auth login

<Vòng đời của Backend>
Bạn chạy lệnh start server
FastAPI tạo app
FastAPI gọi hàm lifespan
Phần trước yield chạy 1 lần duy nhất
Server bắt đầu nhận request
Mỗi request đi qua middleware rồi vào API
Khi tắt server, phần sau yield chạy 1 lần duy nhất

# Các Code đều sẽ đứng yên đó, chẳng chạy gì cả khi và chỉ khi <=>
# 'Đoạn code lifespan trước yeild' sẽ chạy khi ta bật server và 'đoạn code sau yeild' sẽ chạy khi ta tắt server  
# Đoạn code route API sẽ chạy khi nhận đc request từ Frontend
# Đoạn code middelware sẽ chạy khi cũng nhận được request từ frontend nhưng chạy trước rồi mới tới RouteAPI chạy

Ngoài lề : Vòng đời Frontend là mấy cái CSR, SSR trước học á, rồi plugin rồi middelware đồ á

<Promt gõ AI hướng dẫn học đúng> 
Đây là một cái folder ở project khác trong việc sử dụng SMPL để xây dựng Model hình người và đưa lên giao diện NextJS. Project đó đã chạy thành công

Gõ theo từng yêu cầu và từng bước mình hiểu

Tôi cần bạn hướng dẫn từng bước -> Đưa code -> Nêu rõ mục đích của bước làm

VL bạn đừng đưa cả cục code dài như thế. Tôi cần bạn chỉ từng bước tôi làm như là

Đây là đoạn code để khai báo model
Sau đây là từng bước để sử dụng hàm foward(Betas). Đầu tiên ta cần có hàm này, chúng ta cần hàm này là vì abcxyz. Sau đó chúng ta tạo lớp này, ta cần lớp này vì abcxyz.
Tôi cần bạn chỉ thế chứ quăng cả cục code cho tôi làm gì

Rồi code đâu clm. TÔi cần bạn vừa chỉ vừa đưa code. Viết code đơn giản nhất có thể, cho người mới học python á, đừng ghi tắt


<file requirement>
requirements.txt trong Python như package.json ở JS — khai báo c thư viện cần dùng và Pip install là nó cài hết. Như pnpm i

<python -m venv venv>
venv là module có sẵn trong Python (từ Python 3.3+), không cần cài thêm gì cả. 

Khi bạn cài Python lên máy → venv đã có sẵn luôn rồi, chỉ việc dùng: python -m venv tên_thư_mục

=> Tóm lại khi chạy python -m venv venv, bạn nhận được folder venv chứa: 
+ python riêng cho project => Ko liên quan gì đến python hệ thống và các python project khác
+ pip riêng cho project => Xài pip riêng này và sẽ cài riêng
thư viện chỉ cho project này. ( Thay vì ngày xưa cứ bật terminal của máy lên và pip install cho cả hệ thống rồi mới xài được)
+ file activate.ps1 để chạy cái python của project này => venv\Scripts\activate kích hoạt venv — từ lúc này trở đi, mọi lệnh python và pip trong terminal đó đều dùng phiên bản riêng của project, không phải của hệ thống ( Nó sẽ hiện cái (venv) màu xanh lá ở đầu mỗi câu lệnh terminal ^^ )

<_convert_chumpy>
Dấu _ ở đầu tên hàm trong Python là convention (quy ước) nghĩa là "hàm nội bộ, không nên gọi từ bên ngoài".

<app = FastAPI()>
Tạo app — giống như tạo server. Tức là hoàn toàn có thể :
app1 = FastAPI() 
app2 = FastAPI()
có thể tạo được mấy cái backend tùy mình thích :D. Muốn chạy cùng lúc 3 cái server backend app, app1, app2 thì xài port khác là được :D ( Tất nhiên méo ai làm thế)

<Chia file princible>
Tính toán/logic → tách ra file riêng (model, utils...)
# Route/API → chỉ nhận request, gọi logic, trả response

<CORS, AJAX, REST API>
+ CORS
Frontend: localhost:3000  →  gọi API  →  Backend: localhost:8001
                              ↑
                     Khác port = khác origin → bị chặn!
# Phải bật CORS ở backend để nói "cho phép frontend gọi thoải mái":

+ AJAX 
Cách gọi API từ frontend mà không reload trang. Tên cũ thôi, giờ ai cũng dùng JSON chứ không ai dùng XML

// "AJAX" ngày xưa
const xhr = new XMLHttpRequest()

// "AJAX" bây giờ — vẫn cùng khái niệm, chỉ viết gọn hơn
const res = await fetch("/api/products")
const data = await res.json()

# Nói "gọi AJAX" = nói "gọi API từ frontend". Vậy thôi.

+ REST API 
Quy ước đặt tên URL + dùng HTTP method cho API
GET    /products        → lấy danh sách
GET    /products/3      → lấy sản phẩm số 3
POST   /products        → tạo mới
PUT    /products/3      → cập nhật sản phẩm số 3
DELETE /products/3      → xóa sản phẩm số 3
# API viết theo quy ước này gọi là REST API hay RESTful API. Cái bạn đang viết (@app.get("/products"), @app.post("/smpl")) chính là REST API.


<Middleware>
Middleware = "người trung gian" — code chạy ở giữa request đến và response đi, trước khi vào hàm xử lý chính.

Client gửi request
       ↓
   [Middleware 1]  ← kiểm tra CORS
   [Middleware 2]  ← log request
   [Middleware 3]  ← check auth token
       ↓
   Route handler   ← hàm post_mesh() của bạn
       ↓
   [Middleware]     ← (có thể xử lý response trước khi trả)
       ↓
Client nhận response

app.add_middleware(
    CORSMiddleware,                    # loại middleware
    allow_origins=["localhost:3000"],   # cho phép frontend nào gọi
    allow_methods=["GET", "POST"],     # cho phép HTTP method nào
    allow_headers=["Content-Type"],    # cho phép header nào
)

# Mỗi request đến → middleware tự kiểm tra:
# "Request này từ localhost:3000 không? → OK, cho qua"
# "Request này từ localhost:9999 không? → Chặn"
# Rồi mới tới hàm xử lý chính

<Model và Thư viện>

- Model: dữ liệu + cấu trúc dữ liệu của bài toán (ví dụ mesh, vertices, faces, betas).
- Thư viện: tập code/hàm/class có sẵn để xử lý hoặc hiển thị dữ liệu đó (ví dụ Three.js, NumPy, FastAPI).

<Callback>
Hai cái này giống nhau :

1. 
function B(fn) {
    const result = fn(); // B tu goi callback
    console.log("B nhan duoc:", result);
}

B(() => {
    return 999;
});

2. 
function A() {
    return 999;
}

function B(fn) {
const result = fn(); // B tu goi callback
console.log("B nhan duoc:", result);
}

B(A);

Chú ý ta truyền tên hàm chứ ko phải truyền cả cái hàm ( Truyền A chứ ko truyền A())

# Script Python cơ bản thường viết tuyến tính, ít event-driven UI/frontend.: 
# Vẫn có callback ví dụ : names.sort(key=str.lower). str.lower là callback.
# JS frontend thì event nhiều (click, input, fetch, effect), nên callback xuất hiện dày đặc hơn.
# không phải Python không có callback, mà môi trường bạn dùng Python hiện tại ít cần callback hơn JS frontend

<Tại sao cần Callback >

Ủa vậy tại sao ta không truyền vào mà gọi thẳng nó ở trong hàm

Ví dụ như B () {
    A()
}

Được, gọi thẳng trong B hoàn toàn hợp lệ. Nhưng callback có lợi khi bạn muốn B linh hoạt, tái sử dụng:
function A() { console.log("A"); }

function B() {
  console.log("B bat dau");
  A(); // khóa cứng chỉ gọi A
}

# Xài callback thì như onMouted( () = {} )
# Nếu khóa cứng như t làm thì onMouted xài kiểu gì ? Buộc phải xài Callback thằng nào thích đưa hàm như nào vô thì đưa chứ

<Asycn await>
async/await dùng để viết code bất đồng bộ cho dễ đọc như đồng bộ.

Khi nào cần:
Gọi API (fetch, axios)
Đọc/ghi file async
Query DB async
Bất cứ hàm nào trả về Promise

# Là ví dụ như ta gọi API lấy JSON. Nếu ko xài Asycn await thì JS bất đồng bộ. Data chưa trả về mà nó chạy luôn đoạn code phía dưới gây ra lỗi

<Dkm>
- B( TênHàmA ) bằng B ( () => {})
- B( TênHàmA, TênHàmA1, TênHàmA2, Array1, Array2, Biến1, Biến2, biến3 ) 
bằng B ( () => {}, () => {}, () => {}, [], [], a, b, c)
- Con mẹ nó rõ ràng hai cái này là một mà sao cứ khó nhớ vậy ta

# Thì tùy hàm A B C của system or library nó cần tham số truyền vào như nào thì mình truyền theo chứ đâu phải lúc nào cũng là 

B ( () => {

} ) => Cái này nó là B ( tênHàmA )


# Đôi khi nó cũng là

B ( () => { 

}, []) => Cái này nó là B ( tênHàmA, A[])

<Axios to Statemangement to component to page>
- Axios: Dễ dàng quản lý base URL, timeout, và interceptor (ví dụ: tự động thêm token xác thực sau này) hơn là dùng fetch ở nhiều nơi
- State management : 
    + Tách biệt hoàn toàn logic "gọi API" và "quản lý dữ liệu" ra khỏi giao diện. 
    + Component chỉ cần gọi store.fetchMesh(betas) mà không cần biết chi tiết về fetch hay axios
    + Trạng thái loading, error, meshData được quản lý tập trung, nhiều component có thể cùng sử dụng mà không cần truyền props qua lại.

<JSX TSX và JS TS>
Tôi có thể hiểu rằng jsx và tsx là cách code js kết hợp với các thẻ HTML các thứ không ?

Tức là thay vì code JS hoặc TS thuần để tạo ra trang home, ta xài jsx và tsx và sử dụng các thẻ HTML cùng CSS sẽ dễ xây dựng hơn

# Ví dụ hai cái này là như nhau :
JS thuần :
const h1 = document.createElement("h1");
h1.textContent = "Hello";
document.body.appendChild(h1);

JSX/TSX:
return <h1>Hello</h1>;

<App router và Page router >

app/
  layout.tsx      // layout toàn cục
  page.tsx        // /
  fitting-room/
    page.tsx      // /fitting-room
    layout.tsx    // layout riêng cho fitting-room

# Chỉ cần quan tâm giờ xài Approuter
# App Router linh hoạt hơn, hỗ trợ nested layout, và là tương lai của Next.js. Dự án của bạn đang dùng App Router (thấy từ cấu trúc app/), đó là chuẩn hiện tại

<SSR và use client >
- SSR mạnh ở phần render ban đầu và data fetching.
- use client cần cho phần UI có tương tác.
- Không phải toàn bộ app phải là client. Cách đúng là giữ page càng server càng tốt, rồi tách phần điều khiển slider/input ra một component con client.

<Nuxt và Next >
Nuxt tối ưu cho trải nghiệm làm app nhanh
Next tối ưu cho hệ sinh thái React và độ linh hoạt
Cái giá của linh hoạt là nhiều cú pháp và nhiều quyết định thủ công hơn

# Project nhỏ, làm nhanh, ít cấu hình: Nuxt
# Project lớn, cần kiểm soát sâu, hệ sinh thái : React, dễ mở rộng: Next

<m-auto và cụm flex items-center justify-center>
Cha là A, con là B

A(flex items-center justify-center) sẽ bằng với B(m-auto)

Tức là A thì căn giữa thằng còn, còn B là tự căn giữa chính mình trong cha

< w-full max-w-[1200px] >
w-full = cho phần tử rộng bằng 100% chiều rộng của cha.
max-w-[1200px] = nhưng chiều rộng tối đa chỉ được là 1200px.

< Vcl >
# Vcl giờ mới biết nếu đặt text-[18px] text-[var(--text-primary)] ở ngoài thẻ div cha thì toàn bộ thẻ div con bên trong cũng đều nhận thuộc tính này