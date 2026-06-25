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

        const productImages: Record<string, string[]> = {
            'ao': [
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80', // Áo thun Pima
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', // Áo sơ mi Oxford
                'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80', // Áo khoác Denim
                'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80', // Áo hoodie nỉ
                'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80', // Áo len Cardigan
                'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80', // Áo polo cộc tay
                'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80', // Áo khoác gió
                'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80', // Áo thun dài tay
                'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80', // Áo gile len
                'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80', // Áo vest công sở
            ],
            'quan': [
                'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', // Quần jean dáng suông
                'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80', // Quần kaki ống rộng
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80', // Quần âu nam/nữ
                'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80', // Quần đùi dạo phố
                'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=500&q=80', // Quần jogger thể thao
                'https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=500&q=80', // Quần baggy năng động
                'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&q=80', // Quần lót lụa
                'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=500&q=80', // Quần yếm bò
                'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=500&q=80', // Quần thô túi hộp
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80', // Quần xếp ly
            ],
            'giay': [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', // Giày thể thao Runner
                'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80', // Giày Oxford da thật
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', // Giày Sneaker cổ cao
                'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80', // Giày lười Loafer
                'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&q=80', // Giày bốt Chelsea
                'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80', // Giày đi bộ mềm mại
                'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80', // Dép sandal da
                'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80', // Dép quai hậu
                'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80', // Giày gót nhọn
                'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80', // Boot da lộn
            ],
            'mu': [
                'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80', // Mũ lưỡi trai chóp
                'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&q=80', // Mũ bucket vải thô
                'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=500&q=80', // Mũ len Beanie
                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80', // Mũ cói đi biển
                'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=500&q=80', // Mũ Beret cổ điển
                'https://images.unsplash.com/photo-1513105041248-6a2e4d61994a?w=500&q=80', // Mũ nồi họa tiết
                'https://images.unsplash.com/photo-1622263623241-2f310047916e?w=500&q=80', // Mũ snapback
                'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80', // Mũ vành rộng
                'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80', // Nón rơm phong cách
                'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=500&q=80', // Mũ phớt họa sĩ
            ],
            'tat': [
                'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&q=80', // Tất gân cổ cao
                'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500&q=80', // Tất thuyền thể thao
                'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500&q=80', // Tất len dày dặn
                'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80', // Tất lười chống trượt
                'https://images.unsplash.com/photo-1627041833314-8799e4013cc2?w=500&q=80', // Tất họa tiết quả trám
                'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&q=80', // Tất lưới mỏng
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', // Tất đi ngủ lông cừu
                'https://images.unsplash.com/photo-1606990260057-d2e850b4ec73?w=500&q=80', // Tất vớ hoạt hình
                'https://images.unsplash.com/photo-1608228079968-c7681afb7f1d?w=500&q=80', // Tất cổ trung 5 màu
                'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80', // Tất nén chuyên dụng
            ],
            'phu-kien': [
                'https://images.unsplash.com/photo-1624222247344-550fb8ec5519?w=500&q=80', // Thắt lưng da bò
                'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80', // Kính râm chống nắng
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80', // Vòng cổ kim loại
                'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80', // Đồng hồ thanh lịch
                'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80', // Túi chéo canvas
                'https://images.unsplash.com/photo-1627124118400-f925b1800584?w=500&q=80', // Ví da nam/nữ
                'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80', // Khuyên tai nữ
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80', // Nhẫn bạc 925
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', // Khăn quàng cổ lụa
                'https://images.unsplash.com/photo-1543330091-27228394c7dc?w=500&q=80', // Găng tay len mịn
            ]
        }

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

                // Giảm giá 5-20% cho khoảng 50% sản phẩm
                const hasDiscount = Math.random() > 0.5;
                const discountPrice = hasDiscount ? roundedPrice - Math.floor((roundedPrice * (Math.random() * 0.15 + 0.05)) / 1000) * 1000 : undefined;

                const productName = `${catSettings.names[i]} - Mẫu ${i + 1}`;

                // Tạo slug từ tên sản phẩm
                const createSlug = (str: string) => {
                    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/([^0-9a-z-\s])/g, "").replace(/(\s+)/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
                };
                const productSlug = createSlug(productName) + '-' + Math.random().toString(36).substring(2, 6);

                const categoryImages = productImages[cat.slug];
                const imageUrl = categoryImages && categoryImages[i] ? categoryImages[i] : `https://picsum.photos/seed/${cat.slug}${i}/400/400`;

                productsToInsert.push({
                    name: productName,
                    slug: productSlug,
                    price: roundedPrice,
                    discountPrice: discountPrice,
                    description: `Sản phẩm ${catSettings.names[i].toLowerCase()} thiết kế tinh tế, đem lại sự thoải mái khi sử dụng. 100% chính hãng tại TMF.`,
                    imageUrl: imageUrl,
                    categorySlug: cat.slug,
                    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), // Rating từ 3.5 đến 5.0
                    soldCount: Math.floor(Math.random() * 500) + 10,
                    brand: 'DoggyMan',
                    expiryDate: '>1 năm',
                    stock: Math.floor(Math.random() * 100) + 5,
                    shippingInfo: 'Miễn phí vận chuyển'
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