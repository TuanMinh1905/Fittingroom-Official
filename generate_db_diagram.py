import base64
import zlib
import urllib.request

puml_code = """@startuml
skinparam shadowing false
skinparam defaultFontName Arial
skinparam linetype ortho
skinparam EntityBackgroundColor White
skinparam EntityBorderColor Black
skinparam EntityBorderThickness 1.5
skinparam ArrowColor Black

entity "Order (Giao dịch)" as Order {
  * _id : ObjectId
  --
  user_id : ObjectId <<Ref>>
  order_date : Date
  status : String
  total_price : Number
  items : Array<Object>
  shipping_address : Object
  payment_method : String
}

entity "User (Người dùng)" as User {
  * _id : ObjectId
  --
  email : String
  password_hash : String
  full_name : String
  gender : String
  height_cm : Number
  weight_kg : Number
  role : String
}

entity "Product (Sản phẩm)" as Product {
  * _id : ObjectId
  --
  name : String
  category : String
  price : Number
  garment_type : String
  model_3d_path : String
  size_chart : Array<Object>
  stock_quantity : Number
}

entity "Review (Đánh giá)" as Review {
  * _id : ObjectId
  --
  product_id : ObjectId <<Ref>>
  user_id : ObjectId <<Ref>>
  rating : Number
  comment : String
  created_at : Date
}

Order }|..|| User
Order }|..|{ Product
Review }|..|| Product
Review }|..|| User
@enduml"""

compressed = zlib.compress(puml_code.encode('utf-8'), 9)
encoded = base64.urlsafe_b64encode(compressed).decode('utf-8')

url = f"https://kroki.io/plantuml/png/{encoded}"
output_path = r"C:\Users\GP\Desktop\TMF-Official\TMF-NodeJS-FittingRoom3D\apps\database_diagram.png"

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
