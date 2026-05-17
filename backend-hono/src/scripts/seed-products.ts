import mongoose from 'mongoose'
import { Product } from '../models/product.js'
import { Category } from '../models/category.js'
import { connectDB } from '../db/mongoose.js'

const seedProducts = async () => {
    try {
        await connectDB()
        console.log('Connected to database')

        // Clear existing mock products if any
        await Product.deleteMany({})
        console.log('Cleared existing products')

        const categories = await Category.find()
        if (categories.length === 0) {
            console.log('No categories found. Please seed categories first.')
            process.exit(1)
        }

        const productsToInsert = []

        // Dữ liệu mẫu (prefixes tùy theo danh mục)
        const mockData = {
            'ao': { names: ['Áo thun Pima', 'Áo sơ mi Oxford', 'Áo khoác Denim', 'Áo hoodie nỉ', 'Áo len Cardigan', 'Áo polo cộc tay', 'Áo khoác gió', 'Áo thun dài tay', 'Áo gile len', 'Áo vest công sở'], priceMin: 150000, priceMax: 800000 },
            'quan': { names: ['Quần jean dáng suông', 'Quần kaki ống rộng', 'Quần âu nam/nữ', 'Quần đùi dạo phố', 'Quần jogger thể thao', 'Quần baggy năng động', 'Quần lót lụa', 'Quần yếm bò', 'Quần thô túi hộp', 'Quần xếp ly'], priceMin: 200000, priceMax: 900000 },
            'giay': { names: ['Giày thể thao Runner', 'Giày Oxford da thật', 'Giày Sneaker cổ cao', 'Giày lười Loafer', 'Giày bốt Chelsea', 'Giày đi bộ mềm mại', 'Dép sandal da', 'Dép quai hậu', 'Giày gót nhọn', 'Boot da lộn'], priceMin: 300000, priceMax: 2500000 },
            'mu': { names: ['Mũ lưỡi trai chóp', 'Mũ bucket vải thô', 'Mũ len Beanie', 'Mũ cói đi biển', 'Mũ Beret cổ điển', 'Mũ nồi họa tiết', 'Mũ snapback', 'Mũ vành rộng', 'Nón rơm phong cách', 'Mũ phớt họa sĩ'], priceMin: 80000, priceMax: 300000 },
            'tat': { names: ['Tất gân cổ cao', 'Tất thuyền thể thao', 'Tất len dày dặn', 'Tất lười chống trượt', 'Tất họa tiết quả trám', 'Tất lưới mỏng', 'Tất đi ngủ lông cừu', 'Tất vớ hoạt hình', 'Tất cổ trung 5 màu', 'Tất nén chuyên dụng'], priceMin: 20000, priceMax: 100000 },
            'phu-kien': { names: ['Thắt lưng da bò', 'Kính râm chống nắng', 'Vòng cổ kim loại', 'Đồng hồ thanh lịch', 'Túi chéo canvas', 'Ví da nam/nữ', 'Khuyên tai nữ', 'Nhẫn bạc 925', 'Khăn quàng cổ lụa', 'Găng tay len mịn'], priceMin: 50000, priceMax: 1500000 }
        }

        // Tạo 10 sản phẩm cho mỗi category slug 
        for (const cat of categories) {
            const slug = cat.slug as keyof typeof mockData;
            const catSettings = mockData[slug];
            
            if (!catSettings) continue;

            for (let i = 0; i < 10; i++) {
                // Tạo giá ngẫu nhiên với độ làm tròn
                const randomPrice = Math.floor(Math.random() * (catSettings.priceMax - catSettings.priceMin) + catSettings.priceMin);
                const roundedPrice = Math.floor(randomPrice / 1000) * 1000;

                productsToInsert.push({
                    name: `${catSettings.names[i]} - Mẫu ${i + 1}`,
                    price: roundedPrice,
                    description: `Sản phẩm ${catSettings.names[i].toLowerCase()} thiết kế tinh tế, đem lại sự thoải mái khi sử dụng. Phù hợp cho nhiều mục đích khác nhau.`,
                    imageUrl: `https://picsum.photos/seed/${cat.slug}${i}/400/400`,
                    categorySlug: cat.slug
                });
            }
        }

        await Product.insertMany(productsToInsert)
        console.log(`Successfully seeded ${productsToInsert.length} products!`)

        process.exit(0)
    } catch (error) {
        console.error('Error seeding products:', error)
        process.exit(1)
    }
}

seedProducts()