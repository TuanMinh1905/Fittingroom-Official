/**
 * seed-from-scraped.ts
 * ──────────────────────────────────────────────────────────
 * Đọc dữ liệu đã format từ data/formatted-products.json
 * và import vào MongoDB thông qua Mongoose models từ backend-hono
 * 
 * Cần file .env với MONGODB_URI
 * ──────────────────────────────────────────────────────────
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '..', 'data')

// ── Mongoose Schema (duplicate nhẹ từ backend-hono để tránh dependency phức tạp) ─
const SizeMeasurementSchema = new mongoose.Schema({
    size: { type: String, required: true },
    length_cm: { type: Number },
    chest_half_cm: { type: Number },
    shoulder_cm: { type: Number },
    waist_cm: { type: Number },
    hip_cm: { type: Number },
}, { _id: false })

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    categorySlug: { type: String, required: true },
    rating: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    brand: { type: String, required: true, default: 'YODY' },
    expiryDate: { type: String, required: false },
    stock: { type: Number, default: 100 },
    shippingInfo: { type: String, default: 'Miễn phí vận chuyển' },
    colorCodes: [{ type: String }],
    sizes: [{ type: String }],
    sizeChart: [SizeMeasurementSchema],
    garment_type: { type: String, required: false, default: null },
})

const Product = mongoose.model('Product', ProductSchema)

// ── Category Schema (để seed subcategories) ─────────────────────────────────
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    sortOder: { type: Number, required: true },
    imageCategory: { type: String, required: false },
    parentSlug: { type: String, required: false, default: null },
})
const CategoryModel = mongoose.model('Category', CategorySchema)

const SUBCATEGORIES = [
    { name: 'Áo thun', slug: 'ao-thun', sortOder: 1, parentSlug: 'ao', imageCategory: '/category_shirt.png' },
    { name: 'Áo tay dài', slug: 'ao-tay-dai', sortOder: 2, parentSlug: 'ao', imageCategory: '/category_shirt.png' },
    { name: 'Áo sơ mi', slug: 'ao-so-mi', sortOder: 3, parentSlug: 'ao', imageCategory: '/category_shirt.png' },
    { name: 'Quần dài', slug: 'quan-dai', sortOder: 1, parentSlug: 'quan', imageCategory: '/category_short.png' },
    { name: 'Quần short', slug: 'quan-short', sortOder: 2, parentSlug: 'quan', imageCategory: '/category_short.png' },
]

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🚀 Bắt đầu import dữ liệu sản phẩm YODY vào database...\n')

    // Đọc file formatted
    const dataPath = path.join(DATA_DIR, 'formatted-products.json')
    if (!fs.existsSync(dataPath)) {
        console.error('❌ Không tìm thấy file formatted-products.json!')
        console.error('   Hãy chạy "pnpm format" trước.')
        process.exit(1)
    }

    const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    console.log(`📖 Đọc được ${products.length} sản phẩm đã format`)

    // Kết nối MongoDB
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
        console.error('❌ Chưa cấu hình MONGODB_URI trong file .env!')
        console.error('   Tạo file .env trong thư mục scraper với nội dung:')
        console.error('   MONGODB_URI=mongodb://localhost:27017/tmf')
        process.exit(1)
    }

    try {
        await mongoose.connect(mongoUri)
        console.log('✅ Đã kết nối MongoDB\n')

        // Hỏi user muốn xoá dữ liệu cũ không
        console.log('⚠️  Sẽ XOÁ toàn bộ products cũ và thay bằng dữ liệu YODY!')
        console.log('   (Ctrl+C để huỷ trong 3 giây...)\n')
        
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Xoá products cũ
        const deleteResult = await Product.deleteMany({})
        console.log(`🗑️  Đã xoá ${deleteResult.deletedCount} sản phẩm cũ`)

        // Seed subcategories (xoá cũ rồi thêm mới)
        await CategoryModel.deleteMany({ parentSlug: { $ne: null } })
        const insertedSubs = await CategoryModel.insertMany(SUBCATEGORIES)
        console.log(`📂 Đã seed ${insertedSubs.length} subcategories`)

        // Insert batch (chia thành chunks nhỏ để tránh timeout)
        const BATCH_SIZE = 20
        let totalInserted = 0

        for (let i = 0; i < products.length; i += BATCH_SIZE) {
            const batch = products.slice(i, i + BATCH_SIZE)
            try {
                const inserted = await Product.insertMany(batch, { ordered: false })
                totalInserted += inserted.length
                console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${inserted.length} sản phẩm`)
            } catch (error: any) {
                // Xử lý duplicate key errors
                if (error.code === 11000) {
                    const successCount = error.insertedDocs?.length || 0
                    totalInserted += successCount
                    console.log(`   ⚠️  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${successCount} sản phẩm (một số bị trùng slug)`)
                } else {
                    console.error(`   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} lỗi:`, error.message)
                }
            }
        }

        console.log(`\n🎉 Import thành công ${totalInserted}/${products.length} sản phẩm!`)

        // Thống kê trong DB
        const dbStats = await Product.aggregate([
            { $group: { _id: '$categorySlug', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
        
        console.log('\n📊 Thống kê trong database:')
        for (const stat of dbStats) {
            console.log(`   ${stat._id}: ${stat.count} sản phẩm`)
        }

        const totalInDB = await Product.countDocuments()
        console.log(`\n   Tổng: ${totalInDB} sản phẩm`)

    } catch (error: any) {
        console.error('❌ Lỗi:', error.message)
    } finally {
        await mongoose.connection.close()
        console.log('\n🔌 Đã đóng kết nối MongoDB')
    }
}

main()
