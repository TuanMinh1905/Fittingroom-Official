import { Hono } from 'hono'
import { Order } from '../models/order.js'
import { Product } from '../models/product.js'

const app = new Hono()

// Lấy thống kê doanh thu và báo cáo cho Admin
app.get('/stats', async (c) => {
    try {
        const orders = await Order.find().sort({ createdAt: 1 })
        const products = await Product.find({})

        // Tạo map để tra cứu thông tin sản phẩm nhanh hơn
        const productMap = new Map()
        products.forEach(p => {
            productMap.set(p._id.toString(), {
                categorySlug: p.categorySlug || 'khac',
                imageUrl: p.imageUrl || '',
                name: p.name,
                price: p.price
            })
        })

        // Tính toán các chỉ số cơ bản
        let totalRevenue = 0
        let totalOrdersCount = orders.length
        let totalItemsSold = 0

        let pendingCount = 0
        let processingCount = 0
        let deliveredCount = 0
        let cancelledCount = 0

        const paymentMethodsBreakdown: Record<string, number> = {
            'COD': 0,
            'VNPay': 0,
            'Momo': 0,
            'Khác': 0
        }

        // Bản đồ doanh thu theo danh mục
        const categoryRevenueMap: Record<string, number> = {}

        // Bản đồ sản phẩm bán chạy
        const productSalesMap: Record<string, {
            name: string;
            imageUrl: string;
            price: number;
            soldCount: number;
            totalRevenue: number;
        }> = {}

        // Trích xuất thống kê từ danh sách đơn hàng
        orders.forEach(order => {
            // Đếm trạng thái đơn hàng
            if (order.status === 'Pending') pendingCount++
            else if (order.status === 'Processing') processingCount++
            else if (order.status === 'Delivered') deliveredCount++
            else if (order.status === 'Cancelled') cancelledCount++

            // Đếm phương thức thanh toán
            const method = order.paymentMethod || 'COD'
            if (method in paymentMethodsBreakdown) {
                paymentMethodsBreakdown[method]++
            } else {
                paymentMethodsBreakdown['Khác']++
            }

            // Chỉ tính doanh thu và thống kê bán hàng cho các đơn hàng ĐÃ GIAO THÀNH CÔNG (Delivered)
            if (order.status === 'Delivered') {
                totalRevenue += order.totalPrice - order.shippingFee // Doanh thu thuần không gồm phí ship

                order.items.forEach(item => {
                    totalItemsSold += item.quantity

                    // Thống kê doanh thu theo danh mục sản phẩm
                    const pInfo = productMap.get(item.productId)
                    const category = pInfo ? pInfo.categorySlug : 'khac'
                    categoryRevenueMap[category] = (categoryRevenueMap[category] || 0) + (item.price * item.quantity)

                    // Thống kê sản phẩm bán chạy
                    if (productSalesMap[item.productId]) {
                        productSalesMap[item.productId].soldCount += item.quantity
                        productSalesMap[item.productId].totalRevenue += item.price * item.quantity
                    } else {
                        productSalesMap[item.productId] = {
                            name: item.name,
                            imageUrl: item.imageUrl || (pInfo ? pInfo.imageUrl : ''),
                            price: item.price,
                            soldCount: item.quantity,
                            totalRevenue: item.price * item.quantity
                        }
                    }
                })
            }
        })

        // Xử lý dữ liệu biểu đồ doanh thu theo 12 tháng gần nhất
        const last12MonthsData: { month: string; monthIndex: number; year: number; revenue: number; orders: number }[] = []
        const now = new Date()

        // Khởi tạo mảng 12 tháng gần nhất trống để tránh mất tháng không có doanh thu
        for (let i = 11; i >= 0; i--) {
            const d = new Date()
            d.setDate(1) // Tránh lỗi ngày 31 nhảy tháng
            d.setMonth(now.getMonth() - i)
            const monthLabel = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
            last12MonthsData.push({
                month: monthLabel,
                monthIndex: d.getMonth(),
                year: d.getFullYear(),
                revenue: 0,
                orders: 0
            })
        }

        // Điền dữ liệu từ đơn hàng vào mảng 12 tháng
        orders.forEach(order => {
            if (!order.createdAt) return
            const orderDate = new Date(order.createdAt)
            const oMonth = orderDate.getMonth()
            const oYear = orderDate.getFullYear()

            // Tìm tháng phù hợp trong mảng 12 tháng gần nhất
            const targetMonth = last12MonthsData.find(m => m.monthIndex === oMonth && m.year === oYear)
            if (targetMonth) {
                targetMonth.orders++
                if (order.status === 'Delivered') {
                    targetMonth.revenue += order.totalPrice - order.shippingFee
                }
            }
        })

        // Chuyển đổi map sản phẩm bán chạy sang dạng mảng để sắp xếp
        const bestSellers = Object.entries(productSalesMap).map(([productId, data]) => ({
            productId,
            ...data
        })).sort((a, b) => b.soldCount - a.soldCount).slice(0, 8)

        // Tính tăng trưởng doanh thu so với tháng trước
        const currentMonthIndex = last12MonthsData.length - 1
        const prevMonthIndex = last12MonthsData.length - 2
        const currentMonthRevenue = last12MonthsData[currentMonthIndex]?.revenue || 0
        const prevMonthRevenue = last12MonthsData[prevMonthIndex]?.revenue || 0
        let revenueGrowthPercent = 0
        if (prevMonthRevenue > 0) {
            revenueGrowthPercent = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
        } else if (currentMonthRevenue > 0) {
            revenueGrowthPercent = 100 // Tăng trưởng 100% nếu tháng trước không có gì
        }

        // Đếm số khách hàng duy nhất (Unique Customers)
        const uniqueCustomers = new Set(orders.map(o => o.phoneNumber || o.userId)).size

        return c.json({
            summary: {
                totalRevenue,
                totalOrders: totalOrdersCount,
                totalItemsSold,
                uniqueCustomers,
                revenueGrowthPercent,
                averageOrderValue: deliveredCount > 0 ? Math.round(totalRevenue / deliveredCount) : 0
            },
            statusBreakdown: {
                pending: pendingCount,
                processing: processingCount,
                delivered: deliveredCount,
                cancelled: cancelledCount
            },
            paymentMethods: paymentMethodsBreakdown,
            categoryRevenue: categoryRevenueMap,
            monthlyRevenue: last12MonthsData.map(m => ({ month: m.month, revenue: m.revenue, orders: m.orders })),
            bestSellers
        })
    } catch (error) {
        console.error('Lỗi khi lấy thống kê doanh thu:', error)
        return c.json({ error: 'Không thể tính toán thống kê doanh thu' }, 500)
    }
})

// Lấy danh sách tất cả đơn hàng (cho Admin)
app.get('/', async (c) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
        return c.json(orders)
    } catch (error) {
        return c.json({ error: 'Không thể lấy danh sách đơn hàng' }, 500)
    }
})

// Cập nhật trạng thái đơn hàng (cho Admin)
app.put('/:id/status', async (c) => {
    try {
        const id = c.req.param('id')
        const body = await c.req.json()
        
        if (!body.status) {
            return c.json({ error: 'Vui lòng cung cấp trạng thái mới' }, 400)
        }

        const validStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled']
        if (!validStatuses.includes(body.status)) {
            return c.json({ error: 'Trạng thái không hợp lệ' }, 400)
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: body.status },
            { new: true }
        )

        if (!updatedOrder) {
            return c.json({ error: 'Không tìm thấy đơn hàng' }, 404)
        }

        return c.json({ message: 'Cập nhật trạng thái đơn hàng thành công', order: updatedOrder })
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error)
        return c.json({ error: 'Lỗi máy chủ khi cập nhật đơn hàng' }, 500)
    }
})

// Xóa đơn hàng (cho Admin)
app.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const deletedOrder = await Order.findByIdAndDelete(id)

        if (!deletedOrder) {
            return c.json({ error: 'Không tìm thấy đơn hàng để xóa' }, 404)
        }

        return c.json({ message: 'Xóa đơn hàng thành công' })
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error)
        return c.json({ error: 'Lỗi máy chủ khi xóa đơn hàng' }, 500)
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
            shippingFee: body.shippingFee || 0,
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

