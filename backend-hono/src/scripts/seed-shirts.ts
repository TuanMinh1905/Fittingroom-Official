/**
 * seed-shirts.ts
 * ──────────────────────────────────────────────────────────
 * Seed 5 sản phẩm áo sơ mi nam (garment_type: "shirt") vào MongoDB.
 * Mỗi sản phẩm có sizeChart chuẩn (cm) để TailorNet shirt_male model
 * tính toán gamma và render đúng form áo trên model 3D.
 *
 * Chạy: pnpm tsx src/scripts/seed-shirts.ts
 * ──────────────────────────────────────────────────────────
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../db/mongoose.js'
import { Product } from '../models/product.js'
import { Category } from '../models/category.js'

// ── Size chart áo sơ mi nam (cm) ────────────────────────────────────────────
// chest_half_cm = nửa vòng ngực (đo 1 mặt áo trải phẳng)
// shoulder_cm   = chiều rộng vai
// length_cm     = chiều dài áo từ đỉnh vai xuống lai
const SHIRT_MALE_SIZE_CHART = [
    { size: 'S',   length_cm: 70,  chest_half_cm: 48,  shoulder_cm: 43 },
    { size: 'M',   length_cm: 73,  chest_half_cm: 51,  shoulder_cm: 46 },
    { size: 'L',   length_cm: 76,  chest_half_cm: 54,  shoulder_cm: 49 },
    { size: 'XL',  length_cm: 79,  chest_half_cm: 57,  shoulder_cm: 52 },
    { size: 'XXL', length_cm: 82,  chest_half_cm: 60,  shoulder_cm: 55 },
]

// ── Dữ liệu 5 sản phẩm áo sơ mi nam ────────────────────────────────────────
const SHIRT_PRODUCTS = [
    {
        name: 'Áo Sơ Mi Oxford Dài Tay TMF Classic',
        description: 'Áo sơ mi Oxford dài tay form regular fit, chất liệu cotton 100% thoáng mát. Thiết kế lịch lãm phù hợp đi làm và đi chơi. Cổ áo button-down chắc chắn, đường may tỉ mỉ chống xộc xệch.',
        price: 389000,
        discountPrice: 329000,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
        colorCodes: ['#FFFFFF', '#87CEEB', '#4169E1', '#2F4F4F'],
        brand: 'TMF',
        rating: 4.8,
        soldCount: 312,
    },
    {
        name: 'Áo Sơ Mi Kẻ Caro Nam TMF Plaid',
        description: 'Áo sơ mi kẻ caro nam phong cách casual chic, chất liệu cotton pha polyester co giãn nhẹ. Màu sắc phong phú, dễ phối đồ với quần jeans hoặc quần chino. Form slim fit tôn dáng.',
        price: 299000,
        discountPrice: undefined,
        imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80',
        colorCodes: ['#8B0000', '#003153', '#2E8B57', '#4B0082'],
        brand: 'TMF',
        rating: 4.6,
        soldCount: 245,
    },
    {
        name: 'Áo Sơ Mi Linen Cao Cấp TMF Premium Linen',
        description: 'Áo sơ mi linen (vải lanh) cao cấp, siêu thoáng mát và thấm hút mồ hôi tốt. Màu trơn tinh tế thích hợp mặc đi biển, dạo phố hay dự tiệc nhẹ nhàng. Vải tự nhiên 100% kháng khuẩn tự nhiên.',
        price: 549000,
        discountPrice: 469000,
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
        colorCodes: ['#F5F5DC', '#D2B48C', '#C0C0C0', '#708090'],
        brand: 'TMF',
        rating: 4.9,
        soldCount: 178,
    },
    {
        name: 'Áo Sơ Mi Công Sở TMF Business Fit',
        description: 'Áo sơ mi công sở nam form slim fit, chất liệu microfiber cao cấp chống nhăn. Thiết kế trang nhã với cổ đứng và nút bấm bền chắc. Hoàn hảo kết hợp với suit hoặc vest trong môi trường văn phòng chuyên nghiệp.',
        price: 459000,
        discountPrice: 399000,
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
        colorCodes: ['#FFFFFF', '#000080', '#36454F', '#708090'],
        brand: 'TMF',
        rating: 4.7,
        soldCount: 421,
    },
    {
        name: 'Áo Sơ Mi Flannel Mùa Đông TMF Flannel',
        description: 'Áo sơ mi flannel giữ ấm mùa đông, chất liệu bông flannel dày dặn mềm mịn. Họa tiết kẻ caro vintage đậm chất Hàn Quốc, form oversize tạo cảm giác thoải mái. Phù hợp layering với áo khoác ngoài.',
        price: 429000,
        discountPrice: undefined,
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
        colorCodes: ['#800020', '#1B4D3E', '#4F4F4F', '#8B4513'],
        brand: 'TMF',
        rating: 4.5,
        soldCount: 156,
    },
]

function createSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

async function seedShirts() {
    try {
        await connectDB()
        console.log('✅ Connected to database')

        // Tìm category "ao"
        const aoCategory = await Category.findOne({ slug: 'ao' })
        if (!aoCategory) {
            console.error('❌ Category "ao" không tồn tại. Hãy chạy seed chính trước: pnpm run seed')
            process.exit(1)
        }
        console.log(`✅ Found category: ${aoCategory.name} (${aoCategory.slug})`)

        // Xoá các sản phẩm shirt cũ nếu có
        const deleted = await Product.deleteMany({ garment_type: 'shirt' })
        console.log(`🗑️  Đã xoá ${deleted.deletedCount} sản phẩm shirt cũ`)

        // Tạo 5 sản phẩm mới
        const productsToInsert = SHIRT_PRODUCTS.map((p, idx) => ({
            name: p.name,
            slug: createSlug(p.name) + '-' + (idx + 1).toString().padStart(2, '0'),
            price: p.price,
            discountPrice: p.discountPrice,
            description: p.description,
            imageUrl: p.imageUrl,
            categorySlug: 'ao',
            rating: p.rating,
            soldCount: p.soldCount,
            brand: p.brand,
            expiryDate: '>1 năm',
            stock: Math.floor(Math.random() * 80) + 20,
            shippingInfo: 'Miễn phí vận chuyển',
            colorCodes: p.colorCodes,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            sizeChart: SHIRT_MALE_SIZE_CHART,
            // ← Key field: TailorNet sẽ dùng trường này để load shirt_male model
            garment_type: 'shirt',
        }))

        const inserted = await Product.insertMany(productsToInsert)
        console.log(`\n🎉 Đã seed thành công ${inserted.length} sản phẩm áo sơ mi nam:\n`)
        inserted.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name}`)
            console.log(`     slug       : ${p.slug}`)
            console.log(`     garment_type: ${(p as any).garment_type}`)
            console.log(`     price      : ${p.price.toLocaleString('vi-VN')}đ`)
            console.log(`     sizeChart  : ${(p as any).sizeChart.length} sizes (S→XXL)\n`)
        })

        process.exit(0)
    } catch (error) {
        console.error('❌ Lỗi khi seed shirts:', error)
        process.exit(1)
    }
}

seedShirts()
