import { Hono } from 'hono'
import { Brand } from '../models/brand.js'

const brand = new Hono()

// Lấy tất cả brands
brand.get('/', async (c) => {
    const allBrand = await Brand.find().sort({ sortOder: 1 })
    return c.json(allBrand)
})

// Lấy brand theo id
brand.get('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const brandItem = await Brand.findById(id)
        if (!brandItem) return c.json({ message: 'Brand not found' }, 404)
        return c.json(brandItem)
    } catch (error) {
        return c.json({ error: 'Invalid ID' }, 400)
    }
})

// Tạo mới brand
brand.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const newBrand = await Brand.create(body)
        return c.json(newBrand, 201)
    } catch (error) {
        return c.json({ error: 'Failed to create brand' }, 400)
    }
})

// Cập nhật brand
brand.put('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const body = await c.req.json()
        const updatedBrand = await Brand.findByIdAndUpdate(id, body, { new: true })
        if (!updatedBrand) return c.json({ message: 'Brand not found' }, 404)
        return c.json(updatedBrand)
    } catch (error) {
        return c.json({ error: 'Failed to update brand' }, 400)
    }
})

// Xóa brand
brand.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const deletedBrand = await Brand.findByIdAndDelete(id)
        if (!deletedBrand) return c.json({ message: 'Brand not found' }, 404)
        return c.json({ message: 'Deleted successfully' })
    } catch (error) {
        return c.json({ error: 'Failed to delete brand' }, 400)
    }
})

export default brand