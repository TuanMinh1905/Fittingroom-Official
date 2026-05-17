import { Hono } from 'hono'

import { Category } from '../models/category.js'

// Tạo router riêng cho products
const category = new Hono()

// Ở đây là dựng API tạo nè
category.get('/', async (c) => {
    const allCategory = await Category.find() // Lấy tất cả danh mục từ MongoDB
    return c.json(allCategory) // Trả về JSON cho client
})

// GET category theo ID
category.get('/:id', async (c) => {
    const { id } = c.req.param()
    try {
        const cat = await Category.findById(id)
        if (!cat) {
            return c.json({ error: 'Category not found' }, 404)
        }
        return c.json(cat) // Trả về JSON cho client
    } catch (error) {
        return c.json({ error: 'Invalid category ID' }, 400)
    }
})

// POST tạo category mới
category.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const { name, slug, sortOder, imageCategory } = body
        
        if (!name || !slug) {
            return c.json({ error: 'Name and slug are required' }, 400)
        }
        
        const newCategory = new Category({
            name,
            slug,
            sortOder: sortOder || 0,
            imageCategory: imageCategory || '',
        })
        
        const saved = await newCategory.save()
        return c.json(saved, 201)
    } catch (error) {
        return c.json({ error: 'Failed to create category' }, 500)
    }
})

// PUT cập nhật category
category.put('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const body = await c.req.json()
        
        const updated = await Category.findByIdAndUpdate(id, body, { new: true })
        if (!updated) {
            return c.json({ error: 'Category not found' }, 404)
        }
        return c.json(updated)
    } catch (error) {
        return c.json({ error: 'Failed to update category' }, 500)
    }
})

// DELETE category
category.delete('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const deleted = await Category.findByIdAndDelete(id)
        if (!deleted) {
            return c.json({ error: 'Category not found' }, 404)
        }
        return c.json({ message: 'Category deleted', data: deleted })
    } catch (error) {
        return c.json({ error: 'Failed to delete category' }, 500)
    }
})

export default category