# === 1. Import FastAPI ===
from fastapi import FastAPI
from pydantic import BaseModel

# === 2. Tạo app — giống như tạo server ===
app = FastAPI()
# Tương đương bên JS:  const app = new Hono()  hoặc  const app = express()


# === 3. Data cứng (thay cho database) ===
products = [
    {"number": 1, "size": "M", "color": "red", "price": 250000},
    {"number": 2, "size": "L", "color": "blue", "price": 350000},
    {"number": 3, "size": "S", "color": "black", "price": 150000},
    {"number": 4, "size": "XL", "color": "red", "price": 450000},
    {"number": 5, "size": "M", "color": "blue", "price": 200000},
]


class ProductCreate(BaseModel):
    size: str
    color: str
    price: int


# === 4. Khai báo route — đây là phần quan trọng nhất ===

@app.get("/products")          # ← decorator: khi có GET request đến /products → chạy hàm bên dưới
def get_products(size: str = None, color: str = None):
    #                 ↑                ↑
    #          query param         query param
    #          mặc định None       mặc định None
    #
    # FastAPI tự động đọc query string từ URL:
    #   /products?size=M&color=red  →  size="M", color="red"
    #   /products                   →  size=None, color=None
    #   /products?size=L            →  size="L", color=None

    result = products  # bắt đầu với tất cả sản phẩm

    if size:  # nếu user truyền size
        result = [p for p in result if p["size"] == size.upper()]

    if color:  # nếu user truyền color
        result = [p for p in result if p["color"] == color.lower()]

    total_price = sum(p["price"] for p in result)

    # Return dict → FastAPI TỰ ĐỘNG chuyển thành JSON response
    return {
        "count": len(result),
        "total_price": total_price,
        "products": result,
    }


@app.post("/products")
def create_product(body: ProductCreate):
    new_product = {
        "number": len(products) + 1,
        "size": body.size.upper(),
        "color": body.color.lower(),
        "price": body.price,
    }
    products.append(new_product)

    return {
        "message": "Created",
        "product": new_product,
        "count": len(products),
    }

"""
FastAPI (Python)                    Hono (JS)
─────────────────                   ─────────────
app = FastAPI()                     const app = new Hono()

@app.get("/products")               app.get("/products", (c) => {
def get_products(size=None):           const size = c.req.query("size")
    return {"data": ...}               return c.json({ data: ... })
                                     })

uvicorn main:app --port 8001        bun run dev / node index.ts
"""