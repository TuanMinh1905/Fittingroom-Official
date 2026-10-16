import base64
import zlib
import urllib.request

puml_code = """@startuml
skinparam shadowing false
skinparam defaultFontName Arial
skinparam rectangle {
    BackgroundColor White
    BorderColor Black
    BorderThickness 1.5
}
skinparam database {
    BackgroundColor White
    BorderColor Black
    BorderThickness 1.5
}
skinparam ArrowColor Black

rectangle "Application Layer" as AppLayer #f4f6f8 {
    rectangle "Web Application\\n(Next.js & Three.js)" as WebApp
    rectangle "API Server\\n(HonoJS Node.js)" as APIServer
    database "Database\\n(MongoDB)" as DB
    
    WebApp -down-> APIServer : " REST/JSON"
    APIServer -down-> DB : " CRUD Operations"
}

rectangle "AI Processing Layer" as AILayer #f4f6f8 {
    rectangle "AI Advisor API\\n(OpenAI GPT)" as AIAdvisor
    rectangle "AI Inference Server\\n(Python FastAPI)" as FastAPI
    rectangle "Deep Learning Models\\n(TailorNet & SMPL)" as Models
    
    ' Ép xếp dọc bên trong lớp AI
    AIAdvisor -[hidden]down-> FastAPI
    FastAPI -down-> Models : " Forward Pass (PyTorch)"
}

' Liên kết giữa các lớp
APIServer -right-> AIAdvisor : " Prompt Query"

' Đẩy 2 đường link ra xa nhau một chút để không bị đè chữ
APIServer -right-> FastAPI : " Body Params"
FastAPI -left-> APIServer : " 3D Mesh (.obj)"

' Ép 2 khối nằm ngang hàng
AppLayer -[hidden]right- AILayer
@enduml"""

compressed = zlib.compress(puml_code.encode('utf-8'), 9)
encoded = base64.urlsafe_b64encode(compressed).decode('utf-8')

url = f"https://kroki.io/plantuml/png/{encoded}"
output_path = r"C:\Users\GP\Desktop\TMF-Official\TMF-NodeJS-FittingRoom3D\apps\architecture_diagram.png"

try:
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    with urllib.request.urlopen(req) as response, open(output_path, 'wb') as out_file:
        out_file.write(response.read())
    print(f"Success! Saved image to {output_path}")
except Exception as e:
    print(f"Error downloading image from Kroki: {e}")
