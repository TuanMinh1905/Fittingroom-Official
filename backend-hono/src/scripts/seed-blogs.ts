import mongoose from 'mongoose'
import { Blog } from '../models/blog.js'
import { connectDB } from '../db/mongoose.js'

const seedBlogs = async () => {
    try {
        await connectDB()
        console.log('Connected to database')

        // Clear existing blogs如果 any
        await Blog.deleteMany({})
        console.log('Cleared existing blogs')

        const blogs = [
            {
                title: "8 Nguyên Tắc Phối Đồ Cơ Bản Cho Nam Giới",
                slug: "8-nguyen-tac-phoi-do-co-ban",
                image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=60",
                description: "Nguyên tắc phối đồ cơ bản được xem như một cẩm nang hữu ích... Hãy cùng tìm hiểu những cách kết hợp quần áo để luôn ghi điểm trong mắt người đối diện."
            },
            {
                title: "Các Lỗi Trang Phục Thường Gặp Nơi Công Sở",
                slug: "cac-loi-trang-phuc-thuong-gap-cong-so",
                image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60",
                description: "Những trang phục nào không nên mặc khi đi làm? Tại sao việc quá xuề xòa hay quá chải chuốt đều không phù hợp? Hãy phòng tránh ngay từ hôm nay."
            },
            {
                title: "Tips Lựa Chọn Giày Sneaker Theo Form Chân",
                slug: "tips-lua-chon-giay-sneaker-theo-form",
                image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=800&auto=format&fit=crop&q=60",
                description: "Form bàn chân của bạn mang hình dáng nào? Bạn hợp với dòng Chunky hay Classic? Mẹo sau đây sẽ giúp bạn không còn đau đầu khi đi mua giày."
            },
            {
                title: "Mẹo Bảo Quản Áo Thun Luôn Bền Màu Giá Trị",
                slug: "meo-bao-quan-ao-thun-luon-ben-mau",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
                description: "Chuyên mục: Vì sao áo thun hay bị phai màu nhanh? Nguyên nhân khiến vải áo bị dãn? Cách giặt và phơi để chiếc áo mãi như lúc ban đầu."
            },
            {
                title: "Có Nên Theo Đuổi Phong Cách Áo Tập Oversize",
                slug: "co-nen-theo-duoi-phong-cach-oversize",
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60",
                description: "Có nên đầu tư vào những chiếc áo form rộng hay không? Mặc làm sao để không bị nhận xét là bị lọt thỏm giữa bộ đồ dạo phố hôm nay?"
            },
            {
                title: "Những Lý Do Khiến Tủ Đồ Của Bạn Trở Nên Lộn Xộn",
                slug: "nhung-ly-do-khien-tu-do-lon-xon",
                image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800&auto=format&fit=crop&q=60",
                description: "Những lý do khiến quần áo của bạn thường xuyên nhăn nhúm là gì? Hãy để chúng tôi chia sẻ cách dọn dẹp tủ đồ thật khoa học ngay nhé..."
            }
        ]

        await Blog.insertMany(blogs)
        console.log(`Successfully seeded ${blogs.length} blogs!`)

        process.exit(0)
    } catch (error) {
        console.error('Error seeding blogs:', error)
        process.exit(1)
    }
}

seedBlogs()