# YODY Product Scraper 🛒

Scraper để cào dữ liệu sản phẩm thật từ [YODY.vn](https://yody.vn) và import vào database TMF.

## Cấu trúc

```
scraper/
├── src/
│   ├── scrape-yody.ts      # Script cào dữ liệu từ YODY.vn
│   ├── format-for-db.ts    # Format dữ liệu cho TMF Product schema
│   └── seed-from-scraped.ts # Import vào MongoDB
├── data/                    # Dữ liệu output (auto-generated)
│   ├── raw-products.json    # Dữ liệu thô từ YODY
│   └── formatted-products.json # Dữ liệu đã format cho DB
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## Cài đặt

```bash
cd apps/scraper
pnpm install
```

## Sử dụng

### Bước 1: Cào dữ liệu từ YODY.vn
```bash
pnpm scrape
```
Output: `data/raw-products.json`

### Bước 2: Format cho TMF database
```bash
pnpm format
```
Output: `data/formatted-products.json`

### Bước 3: Import vào MongoDB
```bash
pnpm seed
```
⚠️ Script sẽ XOÁ toàn bộ products cũ trước khi import!

### Chạy tất cả 1 lần
```bash
pnpm all
```

## Categories được cào

| Category YODY | Map sang TMF |
|---|---|
| Áo polo nam | `ao` |
| Áo sơ mi nam | `ao` |
| Áo thun nam | `ao` |
| Áo hoodie nam | `ao` |
| Quần jeans nam | `quan` |
| Quần âu nam | `quan` |
| Quần short nam | `quan` |
| Quần kaki nam | `quan` |
| Áo polo nữ | `ao` |
| Áo thun nữ | `ao` |
| Áo sơ mi nữ | `ao` |
| Quần jeans nữ | `quan` |
| Quần short nữ | `quan` |
| Giày nam | `giay` |
| Tất nam | `tat` |
| Phụ kiện nam | `phu-kien` |

## Garment Type Mapping (TailorNet)

Script tự động detect `garment_type` dựa trên tên sản phẩm:

- Áo sơ mi → `shirt`
- Áo thun/polo → `t-shirt`
- Quần dài → `pant`
- Quần short → `short-pant`
