// Đây là file chứa route chính được nhắc tới ở file route con product
// Route chính được gắn bởi cái app á

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { connect } from 'mongoose'
import { connectDB } from './db/mongoose.js'
import products from './routes/product.js'
import category from './routes/category.js'
import brand from './routes/brand.js'
import blog from './routes/blog.js'

const app = new Hono()

// Bật CROS và kết nối DB
app.use('*', cors({
  origin: 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))
connectDB() // Hàm này ở folder db . Tên file là mongoose.ts á

// Xuống đây mới gắn route con vào route chính

app.get('/', (c) => {
  return c.text('route gốc, c.text là khi gọi API này sẽ trả về cái text thôi')
})
app.route('/products', products) // Gắn route products vào app chính
app.route('/category', category) 
app.route('/brand', brand) 
app.route('/blog', blog) 

const port = Number(process.env.PORT) || 8000
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`)
})
