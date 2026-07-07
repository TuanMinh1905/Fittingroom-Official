/**
 * format-for-db.ts
 * ──────────────────────────────────────────────────────────
 * Đọc dữ liệu raw từ data/raw-products.json
 * Format lại cho phù hợp với Product schema của TMF
 * 
 * Output: data/formatted-products.json
 * ──────────────────────────────────────────────────────────
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '..', 'data')

// ── Interface khớp với Product schema của TMF ───────────────────────────────
interface TMFProduct {
    name: string
    slug: string
    price: number
    discountPrice?: number
    description: string
    imageUrl: string
    categorySlug: string
    rating: number
    soldCount: number
    brand: string
    expiryDate: string
    stock: number
    shippingInfo: string
    colorCodes: string[]
    sizes: string[]
    sizeChart?: SizeMeasurement[]
    garment_type?: string
}

interface SizeMeasurement {
    size: string
    length_cm?: number
    chest_half_cm?: number
    shoulder_cm?: number
    waist_cm?: number
    hip_cm?: number
}

interface RawProduct {
    name: string
    price: number
    originalPrice?: number
    imageUrl: string
    productUrl: string
    yodyCategory: string
    tmfCategorySlug: string
}

// ── Size charts chuẩn cho từng loại sản phẩm ───────────────────────────────
const SIZE_CHART_AO: SizeMeasurement[] = [
    { size: 'S', length_cm: 66, chest_half_cm: 46, shoulder_cm: 41 },
    { size: 'M', length_cm: 69, chest_half_cm: 49, shoulder_cm: 44 },
    { size: 'L', length_cm: 72, chest_half_cm: 52, shoulder_cm: 47 },
    { size: 'XL', length_cm: 75, chest_half_cm: 55, shoulder_cm: 50 },
]

const SIZE_CHART_QUAN: SizeMeasurement[] = [
    { size: 'S', length_cm: 98, waist_cm: 72, hip_cm: 90 },
    { size: 'M', length_cm: 100, waist_cm: 78, hip_cm: 96 },
    { size: 'L', length_cm: 102, waist_cm: 84, hip_cm: 102 },
    { size: 'XL', length_cm: 104, waist_cm: 90, hip_cm: 108 },
]

// ── Bảng màu phổ biến theo loại sản phẩm ───────────────────────────────────
const COLOR_PALETTES: Record<string, string[][]> = {
    'ao': [
        ['#FFFFFF', '#000000', '#1E3A5F', '#C0392B'],
        ['#2C3E50', '#ECF0F1', '#27AE60', '#8E44AD'],
        ['#F5F5DC', '#34495E', '#3498DB', '#E74C3C'],
        ['#1C1C1C', '#FFFFFF', '#4A90D9', '#2ECC71'],
        ['#FAF0E6', '#333333', '#D4A574', '#5B6EAE'],
    ],
    'quan': [
        ['#2C3E50', '#34495E', '#1A1A2E', '#F4F4F4'],
        ['#191970', '#4169E1', '#000000', '#D2B48C'],
        ['#36454F', '#8B7355', '#000000', '#F5F5DC'],
        ['#1C1C1C', '#4A4A4A', '#8B4513', '#DCDCDC'],
    ],
    'giay': [
        ['#000000', '#FFFFFF', '#8B4513', '#333333'],
        ['#1C1C1C', '#F5F5F5', '#C0C0C0', '#4169E1'],
    ],
    'tat': [
        ['#000000', '#FFFFFF', '#808080', '#1E3A5F'],
        ['#333333', '#F5F5F5', '#C0392B', '#2980B9'],
    ],
    'phu-kien': [
        ['#000000', '#8B4513', '#C0C0C0', '#1C1C1C'],
        ['#2C3E50', '#D4A574', '#F5F5DC', '#333333'],
    ],
}

// ── Tạo slug từ tên tiếng Việt ──────────────────────────────────────────────
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

// ── Tạo mô tả sản phẩm dựa trên tên ───────────────────────────────────────
function generateDescription(name: string, category: string): string {
    const descriptions: Record<string, string[]> = {
        'ao': [
            `${name} - Thiết kế tinh tế, chất liệu cao cấp mang lại cảm giác thoải mái suốt ngày dài. Phom dáng chuẩn, dễ phối đồ cho mọi hoàn cảnh.`,
            `${name} - Sản phẩm chính hãng YODY với chất vải mềm mại, thấm hút mồ hôi tốt. Đường may tỉ mỉ, bền đẹp theo thời gian.`,
            `${name} - Phong cách thời trang hiện đại, phù hợp đi làm và đi chơi. Chống nhăn, giữ phom tốt sau nhiều lần giặt.`,
        ],
        'quan': [
            `${name} - Quần thiết kế dáng chuẩn, tôn dáng người mặc. Chất liệu co giãn thoải mái, phù hợp mọi hoạt động.`,
            `${name} - Sản phẩm cao cấp với đường may chắc chắn, form dáng thanh lịch. Dễ phối với nhiều loại áo khác nhau.`,
            `${name} - Phong cách trẻ trung, năng động. Chất vải bền đẹp, giữ form tốt.`,
        ],
        'giay': [
            `${name} - Giày thiết kế phong cách, đế êm ái mang lại sự thoải mái tối đa. Chất liệu bền đẹp, phù hợp sử dụng hàng ngày.`,
        ],
        'tat': [
            `${name} - Tất chất liệu mềm mại, co giãn tốt, thấm hút mồ hôi hiệu quả. Thiết kế gọn gàng, phù hợp mọi đôi giày.`,
        ],
        'phu-kien': [
            `${name} - Phụ kiện thời trang cao cấp, thiết kế tinh tế nâng tầm phong cách. Chất liệu bền đẹp, hoàn thiện tỉ mỉ.`,
        ],
    }

    const categoryDescs = descriptions[category] || descriptions['ao']
    return categoryDescs[Math.floor(Math.random() * categoryDescs.length)]
}

// ── Xác định garment_type cho TailorNet ─────────────────────────────────────
function detectGarmentType(name: string, category: string): string | undefined {
    const nameLower = name.toLowerCase()
    
    if (category === 'ao') {
        if (nameLower.includes('sơ mi') || nameLower.includes('sơ-mi') || nameLower.includes('so mi')) return 'shirt'
        if (nameLower.includes('thun') || nameLower.includes('polo') || nameLower.includes('phông')) return 't-shirt'
        if (nameLower.includes('hoodie') || nameLower.includes('nỉ') || nameLower.includes('len')) return 't-shirt'
        return 't-shirt' // default cho áo
    }
    
    if (category === 'quan') {
        if (nameLower.includes('short') || nameLower.includes('đùi') || nameLower.includes('ngắn')) return 'short-pant'
        return 'pant' // default cho quần dài
    }

    return undefined // không map được cho giày/tất/phụ kiện
}

// ── Main formatting ─────────────────────────────────────────────────────────
function main() {
    console.log('🔄 Bắt đầu format dữ liệu cho TMF database...\n')

    const rawPath = path.join(DATA_DIR, 'raw-products.json')
    if (!fs.existsSync(rawPath)) {
        console.error('❌ Không tìm thấy file raw-products.json!')
        console.error('   Hãy chạy "pnpm scrape" trước.')
        process.exit(1)
    }

    const rawProducts: RawProduct[] = JSON.parse(fs.readFileSync(rawPath, 'utf-8'))
    console.log(`📖 Đọc được ${rawProducts.length} sản phẩm từ raw-products.json`)

    const formattedProducts: TMFProduct[] = []
    const usedSlugs = new Set<string>()

    for (const raw of rawProducts) {
        // Tạo slug unique
        let slug = createSlug(raw.name)
        let uniqueSlug = slug
        let counter = 1
        while (usedSlugs.has(uniqueSlug)) {
            uniqueSlug = `${slug}-${counter}`
            counter++
        }
        usedSlugs.add(uniqueSlug)

        // Xác định giá
        const price = raw.originalPrice && raw.originalPrice > raw.price
            ? raw.originalPrice
            : raw.price
        const discountPrice = raw.originalPrice && raw.originalPrice > raw.price
            ? raw.price
            : undefined

        // Chọn màu sắc random từ palette
        const palettes = COLOR_PALETTES[raw.tmfCategorySlug] || COLOR_PALETTES['ao']
        const colorCodes = palettes[Math.floor(Math.random() * palettes.length)]

        // Sizes phù hợp
        const sizes = raw.tmfCategorySlug === 'giay'
            ? ['39', '40', '41', '42', '43']
            : raw.tmfCategorySlug === 'tat'
                ? ['Free Size']
                : ['S', 'M', 'L', 'XL']

        // Size chart
        let sizeChart: SizeMeasurement[] | undefined
        if (raw.tmfCategorySlug === 'ao') sizeChart = SIZE_CHART_AO
        if (raw.tmfCategorySlug === 'quan') sizeChart = SIZE_CHART_QUAN

        // Garment type
        const garment_type = detectGarmentType(raw.name, raw.tmfCategorySlug)

        const product: TMFProduct = {
            name: raw.name,
            slug: uniqueSlug,
            price,
            discountPrice,
            description: generateDescription(raw.name, raw.tmfCategorySlug),
            imageUrl: raw.imageUrl || `https://picsum.photos/seed/${uniqueSlug}/400/400`,
            categorySlug: raw.tmfCategorySlug,
            rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
            soldCount: Math.floor(Math.random() * 800) + 50,
            brand: 'YODY',
            expiryDate: '>1 năm',
            stock: Math.floor(Math.random() * 150) + 10,
            shippingInfo: 'Miễn phí vận chuyển',
            colorCodes,
            sizes,
            ...(sizeChart ? { sizeChart } : {}),
            ...(garment_type ? { garment_type } : {}),
        }

        formattedProducts.push(product)
    }

    // Lưu ra file
    const outputPath = path.join(DATA_DIR, 'formatted-products.json')
    fs.writeFileSync(outputPath, JSON.stringify(formattedProducts, null, 2), 'utf-8')

    console.log(`\n🎉 Đã format ${formattedProducts.length} sản phẩm!`)
    console.log(`📁 Output: ${outputPath}`)

    // Thống kê
    console.log('\n📊 Thống kê theo category:')
    const stats: Record<string, number> = {}
    for (const p of formattedProducts) {
        stats[p.categorySlug] = (stats[p.categorySlug] || 0) + 1
    }
    for (const [cat, count] of Object.entries(stats)) {
        console.log(`   ${cat}: ${count} sản phẩm`)
    }

    console.log('\n📊 Thống kê garment_type:')
    const garmentStats: Record<string, number> = {}
    for (const p of formattedProducts) {
        const gt = p.garment_type || 'none'
        garmentStats[gt] = (garmentStats[gt] || 0) + 1
    }
    for (const [gt, count] of Object.entries(garmentStats)) {
        console.log(`   ${gt}: ${count} sản phẩm`)
    }

    // Hiện vài sản phẩm mẫu
    console.log('\n📋 Mẫu 3 sản phẩm đầu tiên:')
    for (const p of formattedProducts.slice(0, 3)) {
        console.log(`\n   🔹 ${p.name}`)
        console.log(`      slug: ${p.slug}`)
        console.log(`      price: ${p.price.toLocaleString('vi-VN')}đ`)
        if (p.discountPrice) console.log(`      discountPrice: ${p.discountPrice.toLocaleString('vi-VN')}đ`)
        console.log(`      category: ${p.categorySlug}`)
        console.log(`      garment_type: ${p.garment_type || 'N/A'}`)
        console.log(`      imageUrl: ${p.imageUrl.substring(0, 80)}...`)
    }
}

main()
