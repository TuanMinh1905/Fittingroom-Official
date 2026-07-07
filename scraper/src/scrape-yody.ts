/**
 * scrape-yody.ts
 * ──────────────────────────────────────────────────────────
 * Script cào dữ liệu sản phẩm từ YODY.vn
 * 
 * Cào từ các category pages chính:
 * - Áo nam (polo, sơ mi, thun)
 * - Quần nam (jeans, âu, kaki, short)
 * - Áo nữ  
 * - Quần nữ
 * - Phụ kiện (giày, tất, thắt lưng)
 *
 * Output: data/raw-products.json
 * ──────────────────────────────────────────────────────────
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '..', 'data')

// ── Cấu hình các category cần cào ──────────────────────────────────────────
interface CategoryConfig {
    name: string
    slug: string
    url: string
    /** Map sang categorySlug trong DB của TMF */
    tmfCategorySlug: string
}

const CATEGORIES: CategoryConfig[] = [
    // ── Áo nam ──
    { name: 'Áo polo nam', slug: 'ao-polo-nam', url: 'https://yody.vn/category/ao-polo-nam', tmfCategorySlug: 'ao' },
    { name: 'Áo sơ mi nam', slug: 'ao-so-mi-nam', url: 'https://yody.vn/category/ao-so-mi-nam', tmfCategorySlug: 'ao' },
    { name: 'Áo thun nam', slug: 'ao-thun-nam', url: 'https://yody.vn/category/ao-thun-nam', tmfCategorySlug: 'ao' },
    { name: 'Áo hoodie - Áo nỉ nam', slug: 'ao-hoodie-ao-ni-nam', url: 'https://yody.vn/category/ao-hoodie-ao-ni-nam', tmfCategorySlug: 'ao' },
    // ── Quần nam ──
    { name: 'Quần jeans nam', slug: 'quan-jeans-nam', url: 'https://yody.vn/category/quan-jeans-nam', tmfCategorySlug: 'quan' },
    { name: 'Quần âu nam', slug: 'quan-au-nam', url: 'https://yody.vn/category/quan-au-nam', tmfCategorySlug: 'quan' },
    { name: 'Quần short nam', slug: 'quan-short-nam', url: 'https://yody.vn/category/quan-short-nam', tmfCategorySlug: 'quan' },
    { name: 'Quần kaki nam', slug: 'quan-kaki-nam', url: 'https://yody.vn/category/quan-kaki-nam', tmfCategorySlug: 'quan' },
    // ── Áo nữ ──
    { name: 'Áo polo nữ', slug: 'ao-polo-nu', url: 'https://yody.vn/category/ao-polo-nu', tmfCategorySlug: 'ao' },
    { name: 'Áo thun nữ', slug: 'ao-thun-nu', url: 'https://yody.vn/category/ao-thun-nu', tmfCategorySlug: 'ao' },
    { name: 'Áo sơ mi nữ', slug: 'ao-so-mi-nu', url: 'https://yody.vn/category/ao-so-mi-nu', tmfCategorySlug: 'ao' },
    // ── Quần nữ ──
    { name: 'Quần jeans nữ', slug: 'quan-jeans-nu', url: 'https://yody.vn/category/quan-jeans-nu', tmfCategorySlug: 'quan' },
    { name: 'Quần short nữ', slug: 'quan-short-nu', url: 'https://yody.vn/category/quan-short-nu', tmfCategorySlug: 'quan' },
    // ── Phụ kiện ──
    { name: 'Giày nam', slug: 'giay-nam', url: 'https://yody.vn/category/giay-nam', tmfCategorySlug: 'giay' },
    { name: 'Tất nam', slug: 'tat-nam', url: 'https://yody.vn/category/tat-nam', tmfCategorySlug: 'tat' },
    { name: 'Phụ kiện nam', slug: 'phu-kien-nam', url: 'https://yody.vn/category/phu-kien-nam', tmfCategorySlug: 'phu-kien' },
]

// ── Interface cho raw product ───────────────────────────────────────────────
interface RawProduct {
    name: string
    price: number
    originalPrice?: number
    imageUrl: string
    productUrl: string
    yodyCategory: string
    tmfCategorySlug: string
}

// ── Delay helper (tránh bị block) ───────────────────────────────────────────
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ── Parse giá tiền từ text VNĐ ──────────────────────────────────────────────
function parsePrice(priceText: string): number {
    // "349.000đ" → 349000
    // "1.299.000đ" → 1299000
    const cleaned = priceText.replace(/[^\d]/g, '')
    return parseInt(cleaned, 10) || 0
}

// ── Cào 1 category page ────────────────────────────────────────────────────
async function scrapeCategory(config: CategoryConfig): Promise<RawProduct[]> {
    const products: RawProduct[] = []

    try {
        console.log(`  📦 Đang cào: ${config.name} (${config.url})`)

        const response = await axios.get(config.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
            },
            timeout: 15000,
        })

        const $ = cheerio.load(response.data)

        // ── Tìm product cards ──
        // YODY dùng nhiều pattern khác nhau cho product cards, ta thử lần lượt
        const selectors = [
            // Pattern 1: Next.js data trong __NEXT_DATA__
            'script#__NEXT_DATA__',
            // Pattern 2: Product card items phổ biến
            '.product-item',
            '.product-card',
            '[class*="product"]',
            // Pattern 3: List items
            '.collection-product-item',
        ]

        // Thử lấy dữ liệu từ __NEXT_DATA__ (SSR data)
        const nextDataScript = $('script#__NEXT_DATA__').text()
        if (nextDataScript) {
            try {
                const nextData = JSON.parse(nextDataScript)
                const pageProps = nextData?.props?.pageProps

                // Tìm products trong pageProps
                const productsData = findProductsInObject(pageProps)
                if (productsData.length > 0) {
                    console.log(`    ✅ Tìm thấy ${productsData.length} sản phẩm từ __NEXT_DATA__`)
                    for (const p of productsData) {
                        const name = p.name || p.title || p.product_name || ''
                        const price = p.price || p.retail_price || p.min_price || 0
                        const originalPrice = p.original_price || p.compare_at_price || p.max_price || undefined
                        
                        // Tìm image URL 
                        let imageUrl = ''
                        if (p.image_url) imageUrl = p.image_url
                        else if (p.featured_image) imageUrl = p.featured_image
                        else if (p.images && p.images.length > 0) {
                            imageUrl = typeof p.images[0] === 'string' ? p.images[0] : (p.images[0]?.src || p.images[0]?.url || '')
                        }
                        else if (p.image) {
                            imageUrl = typeof p.image === 'string' ? p.image : (p.image?.src || p.image?.url || '')
                        }
                        else if (p.thumbnail) imageUrl = p.thumbnail

                        // Tìm product URL/handle
                        const handle = p.handle || p.slug || p.url_key || ''
                        const productUrl = handle ? `https://yody.vn/product/${handle}` : ''

                        if (name && price > 0) {
                            // Đảm bảo image URL đầy đủ
                            if (imageUrl && !imageUrl.startsWith('http')) {
                                imageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : `https://yody.vn${imageUrl}`
                            }

                            products.push({
                                name,
                                price,
                                originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
                                imageUrl,
                                productUrl,
                                yodyCategory: config.slug,
                                tmfCategorySlug: config.tmfCategorySlug,
                            })
                        }
                    }
                    return products
                }
            } catch (e) {
                console.log(`    ⚠️  Không parse được __NEXT_DATA__, thử fallback HTML...`)
            }
        }

        // ── Fallback: Parse từ HTML trực tiếp ──
        // Tìm tất cả <a> tags có chứa product info
        $('a[href*="/product/"]').each((_, el) => {
            const $el = $(el)
            const href = $el.attr('href') || ''
            const productUrl = href.startsWith('http') ? href : `https://yody.vn${href}`
            
            // Tìm tên sản phẩm  
            const name = $el.find('h3, h4, [class*="name"], [class*="title"]').first().text().trim()
            
            // Tìm hình ảnh
            const $img = $el.find('img').first()
            let imageUrl = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src') || ''
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : `https://yody.vn${imageUrl}`
            }

            // Tìm giá
            const priceTexts = $el.find('[class*="price"]').map((_, priceEl) => $(priceEl).text().trim()).get()
            let price = 0
            let originalPrice: number | undefined

            for (const pt of priceTexts) {
                const parsed = parsePrice(pt)
                if (parsed > 0) {
                    if (price === 0) {
                        price = parsed
                    } else if (parsed !== price) {
                        // Nếu có 2 giá khác nhau, giá lớn hơn là giá gốc
                        if (parsed > price) {
                            originalPrice = parsed
                        } else {
                            originalPrice = price
                            price = parsed
                        }
                    }
                }
            }

            if (name && name.length > 3) {
                products.push({
                    name,
                    price,
                    originalPrice,
                    imageUrl,
                    productUrl,
                    yodyCategory: config.slug,
                    tmfCategorySlug: config.tmfCategorySlug,
                })
            }
        })

        // ── Fallback 2: Parse h3 headings + price patterns ──
        if (products.length === 0) {
            console.log(`    ⚠️  Không tìm thấy product links, thử parse h3 + prices...`)
            const h3Elements = $('h3').toArray()
            const allImages = $('img').toArray()
            
            for (const h3El of h3Elements) {
                const name = $(h3El).text().trim()
                if (!name || name.length < 5) continue
                
                // Tìm giá gần nhất (thường ở trước hoặc cùng parent)
                const parent = $(h3El).parent()
                const grandParent = parent.parent()
                
                const priceText = grandParent.text()
                const priceMatches = priceText.match(/(\d{1,3}(?:\.\d{3})+)đ/g)
                
                let price = 0
                let originalPrice: number | undefined
                
                if (priceMatches) {
                    for (const pm of priceMatches) {
                        const parsed = parsePrice(pm)
                        if (parsed > 0) {
                            if (price === 0) {
                                price = parsed
                            } else if (parsed > price) {
                                originalPrice = parsed
                            }
                        }
                    }
                }

                // Tìm ảnh gần nhất
                const nearbyImg = grandParent.find('img').first()
                let imageUrl = nearbyImg.attr('src') || nearbyImg.attr('data-src') || ''
                if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : `https://yody.vn${imageUrl}`
                }

                if (price > 0) {
                    products.push({
                        name,
                        price,
                        originalPrice,
                        imageUrl,
                        productUrl: '',
                        yodyCategory: config.slug,
                        tmfCategorySlug: config.tmfCategorySlug,
                    })
                }
            }
        }

        console.log(`    ✅ Cào được ${products.length} sản phẩm`)
    } catch (error: any) {
        console.error(`    ❌ Lỗi khi cào ${config.name}: ${error.message}`)
    }

    return products
}

// ── Helper: tìm mảng products trong nested object ──────────────────────────
function findProductsInObject(obj: any, depth = 0): any[] {
    if (depth > 8 || !obj) return []

    // Nếu obj là array có items dạng product
    if (Array.isArray(obj)) {
        const hasProductLikeItems = obj.some(item =>
            item && typeof item === 'object' &&
            (item.name || item.title || item.product_name) &&
            (item.price || item.retail_price || item.min_price)
        )
        if (hasProductLikeItems) return obj
    }

    // Nếu obj là object, tìm đệ quy
    if (typeof obj === 'object' && !Array.isArray(obj)) {
        // Ưu tiên các key phổ biến
        const priorityKeys = ['products', 'items', 'data', 'results', 'product_list', 'productList', 'variants']
        for (const key of priorityKeys) {
            if (obj[key]) {
                const result = findProductsInObject(obj[key], depth + 1)
                if (result.length > 0) return result
            }
        }

        // Tìm trong tất cả keys
        for (const key of Object.keys(obj)) {
            if (priorityKeys.includes(key)) continue
            const result = findProductsInObject(obj[key], depth + 1)
            if (result.length > 0) return result
        }
    }

    return []
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🚀 Bắt đầu cào dữ liệu từ YODY.vn...\n')

    // Tạo thư mục data nếu chưa có
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    const allProducts: RawProduct[] = []

    for (const category of CATEGORIES) {
        const products = await scrapeCategory(category)
        allProducts.push(...products)

        // Delay 1-2 giây giữa mỗi request (tránh bị rate limit)
        await delay(1500 + Math.random() * 1000)
    }

    // Loại bỏ trùng lặp theo tên
    const uniqueProducts = allProducts.filter((product, index, self) =>
        index === self.findIndex(p => p.name === product.name)
    )

    // Lưu ra file
    const outputPath = path.join(DATA_DIR, 'raw-products.json')
    fs.writeFileSync(outputPath, JSON.stringify(uniqueProducts, null, 2), 'utf-8')

    console.log(`\n🎉 Hoàn tất! Đã cào ${uniqueProducts.length} sản phẩm (loại bỏ ${allProducts.length - uniqueProducts.length} trùng lặp)`)
    console.log(`📁 Dữ liệu lưu tại: ${outputPath}`)

    // Thống kê theo category
    console.log('\n📊 Thống kê:')
    const stats: Record<string, number> = {}
    for (const p of uniqueProducts) {
        stats[p.tmfCategorySlug] = (stats[p.tmfCategorySlug] || 0) + 1
    }
    for (const [cat, count] of Object.entries(stats)) {
        console.log(`   ${cat}: ${count} sản phẩm`)
    }
}

main().catch(err => {
    console.error('❌ Lỗi chương trình:', err)
    process.exit(1)
})
