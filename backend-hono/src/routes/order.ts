import { Hono } from 'hono'
import { Order } from '../models/order.js'

const app = new Hono()

// Lấy danh sách tất cả đơn hàng (cho Admin sau này)
app.get('/', async (c) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
        return c.json(orders)
    } catch (error) {
        return c.json({ error: 'Không thể lấy danh sách đơn hàng' }, 500)
    }
})

// Tạo đơn hàng mới
app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        
        // Validate dữ liệu cơ bản
        if (!body.customerName || !body.phoneNumber || !body.address || !body.items || body.items.length === 0) {
            return c.json({ error: 'Vui lòng cung cấp đủ thông tin đơn hàng' }, 400)
        }

        const newOrder = new Order({
            userId: body.userId,
            customerName: body.customerName,
            phoneNumber: body.phoneNumber,
            address: body.address,
            paymentMethod: body.paymentMethod || 'COD',
            items: body.items,
            totalPrice: body.totalPrice,
            status: 'Pending'
        })

        const savedOrder = await newOrder.save()
        
        return c.json(savedOrder, 201)
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error)
        return c.json({ error: 'Đã xảy ra lỗi khi tạo đơn hàng' }, 500)
    }
})

export default app
