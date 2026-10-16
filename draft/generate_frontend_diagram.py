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
skinparam ArrowColor Black
skinparam usecase {
    BackgroundColor White
    BorderColor Black
    BorderThickness 1.5
}

(Start) as start
rectangle "Tệp lưới không gian\\n(3D Mesh .obj)" as step1
rectangle "Bộ máy WebGL\\n(Three.js & R3F)" as step2
rectangle "Vật liệu & Ánh sáng\\n(Materials/Lighting)" as step3
rectangle "Không gian tương tác\\n(3D Canvas)" as step4
(End) as end

start -right-> step1
step1 -right-> step2 : " Nạp dữ liệu "
step2 -down-> step3 : " Pipeline"
step3 -left-> step4 : " Kết xuất đồ họa "
step4 -left-> end
@enduml"""

compressed = zlib.compress(puml_code.encode('utf-8'), 9)
encoded = base64.urlsafe_b64encode(compressed).decode('utf-8')

url = f"https://kroki.io/plantuml/png/{encoded}"
output_path = r"C:\Users\GP\Desktop\TMF-Official\TMF-NodeJS-FittingRoom3D\apps\frontend_diagram.png"

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
