// Route ở các file ở folder này chỉ là route con, route chính được gắn ở index.ts với thằng app á
// Ví dụ route con : ở file product này thì / = gọi all product, /:id = gọi product theo id, /:name = gọi product theo name, /create = tạo product mới
// Route chính ở index.ts : Được cái route app gắn vô thì là / => /products/ : gọi all products, /:id => /products/:id = gọi product theo id, tương tự /:name => /products/:name, /create => /products/create

import { Hono } from 'hono'
// Trong ts config có cái dòng "module": "NodeNext" nên khi import thì phải có đuôi .js mới không báo lỗi
// Source code: product.ts
// Khi build: TypeScript compile thành product.js
// Khi chạy: Node.js đọc file .js
// Nên import path phải là .js để Node.js tìm được
import { Product } from '../models/product.js'
import { Brand } from '../models/brand.js'

// Tạo router riêng cho products
const products = new Hono()

// Ở đây là dựng API tạo nè
products.get('/', async (c) => {
    const allProducts = await Product.find() // Lấy tất cả sản phẩm từ MongoDB
    return c.json(allProducts) // Trả về JSON cho client
})

// API tìm kiếm sản phẩm theo tên
products.get('/search', async (c) => {
    const q = c.req.query('q')
    if (!q) {
        return c.json([])
    }
    try {
        const searchResults = await Product.find({ name: { $regex: q, $options: 'i' } })
        return c.json(searchResults)
    } catch (error) {
        return c.json({ error: 'Failed to search products' }, 500)
    }
})

// Thử tự làm thêm cái API get sản phẩm theo id 
// c đối tượng chứa thông tin request và các method để trả response.
products.get('/:id', async (c) => {
    const { id } = c.req.param() // Lúc này đang tìm hiểu c là gì, thì c.req.param() là lấy tham số id từ URL. Ví dụ: /products/123 thì id sẽ là 123
    const product = await Product.findById(id) // Tìm sản phẩm theo id trong MongoDB 
    if (!product) return c.json({ message: 'Product not found' }, 404)
    return c.json(product)
})

// API tìm sản phẩm theo slug
products.get('/slug/:slug', async (c) => {
    const slug = c.req.param('slug')
    const product = await Product.findOne({ slug })
    if (!product) return c.json({ message: 'Product not found' }, 404)
    return c.json(product)
})

// API lấy sản phẩm theo category cha (bao gồm tất cả subcategories)
// Ví dụ: /category-group/ao → trả tất cả sản phẩm có categorySlug là ao, ao-thun, ao-so-mi, ao-tay-dai
products.get('/category-group/:parentSlug', async (c) => {
    const parentSlug = c.req.param('parentSlug')
    try {
        // Tìm tất cả subcategory slugs từ Category collection
        const { Category } = await import('../models/category.js')
        const subcategories = await Category.find({ parentSlug })
        const subSlugs = subcategories.map(sub => sub.slug)

        // Tìm sản phẩm thuộc parent hoặc bất kỳ subcategory nào
        const allSlugs = [parentSlug, ...subSlugs]
        const groupProducts = await Product.find({ categorySlug: { $in: allSlugs } })
        return c.json(groupProducts)
    } catch (error) {
        return c.json({ error: 'Failed to fetch products for category group' }, 500)
    }
})

// API lấy sản phẩm theo categorySlug
products.get('/category/:categorySlug', async (c) => {
    const categorySlug = c.req.param('categorySlug')
    try {
        const categoryProducts = await Product.find({ categorySlug })
        return c.json(categoryProducts)
    } catch (error) {
        return c.json({ error: 'Failed to fetch products for category' }, 500)
    }
})

// API lấy sản phẩm theo brandSlug
products.get('/brand/:brandSlug', async (c) => {
    const brandSlug = c.req.param('brandSlug')
    try {
        const brandItem = await Brand.findOne({ slug: brandSlug })
        if (!brandItem) {
            return c.json([])
        }
        const brandProducts = await Product.find({ brand: brandItem.name })
        return c.json(brandProducts)
    } catch (error) {
        return c.json({ error: 'Failed to fetch products for brand' }, 500)
    }
})

// Create product
products.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const newProduct = await Product.create(body)
        return c.json(newProduct, 201)
    } catch (error) {
        return c.json({ error: 'Failed to create product' }, 400)
    }
})

// Update product
products.put('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const body = await c.req.json()
        const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true })
        if (!updatedProduct) return c.json({ message: 'Product not found' }, 404)
        return c.json(updatedProduct)
    } catch (error) {
        return c.json({ error: 'Failed to update product' }, 400)
    }
})

// Delete product
products.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) return c.json({ message: 'Product not found' }, 404)
        return c.json({ message: 'Deleted successfully' })
    } catch (error) {
        return c.json({ error: 'Failed to delete product' }, 400)
    }
})

export default products