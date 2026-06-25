import { Hono } from 'hono'
import { Blog } from '../models/blog.js'

const blog = new Hono()

// Lấy tất cả blogs
blog.get('/', async (c) => {
    try {
        const allBlogs = await Blog.find().sort({ createdAt: -1 })
        return c.json(allBlogs)
    } catch (error) {
        return c.json({ error: 'Failed to fetch blogs' }, 500)
    }
})

// Lấy blog theo slug
blog.get('/post/:slug', async (c) => {
    try {
        const slug = c.req.param('slug')
        const blogItem = await Blog.findOne({ slug })
        if (!blogItem) return c.json({ message: 'Blog not found' }, 404)
        return c.json(blogItem)
    } catch (error) {
        return c.json({ error: 'Failed to fetch blog' }, 500)
    }
})

// Lấy blog theo id
blog.get('/:id', async (c) => {
    try {
        const { id } = c.req.param()
        const blogItem = await Blog.findById(id)
        if (!blogItem) return c.json({ message: 'Blog not found' }, 404)
        return c.json(blogItem)
    } catch (error) {
        return c.json({ error: 'Invalid ID' }, 400)
    }
})

// Tạo mới blog
blog.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const newBlog = await Blog.create(body)
        return c.json(newBlog, 201)
    } catch (error) {
        return c.json({ error: 'Failed to create blog' }, 400)
    }
})

// Cập nhật blog
blog.put('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const body = await c.req.json()
        const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
        if (!updatedBlog) return c.json({ message: 'Blog not found' }, 404)
        return c.json(updatedBlog)
    } catch (error) {
        return c.json({ error: 'Failed to update blog' }, 400)
    }
})

// Xóa blog
blog.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const deletedBlog = await Blog.findByIdAndDelete(id)
        if (!deletedBlog) return c.json({ message: 'Blog not found' }, 404)
        return c.json({ message: 'Deleted successfully' })
    } catch (error) {
        return c.json({ error: 'Failed to delete blog' }, 400)
    }
})

export default blog