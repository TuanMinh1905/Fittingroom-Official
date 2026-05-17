import mongoose from 'mongoose'
import { Category } from '../models/category.js'
import { connectDB } from '../db/mongoose.js'

const seedCategories = async () => {
    await connectDB()
    
    const categories = [
        {
            name: 'Áo',
            slug: 'ao',
            sortOder: 1,
            imageCategory: '/category_shirt.png'
        },
        {
            name: 'Quần',
            slug: 'quan',
            sortOder: 2,
            imageCategory: '/category_short.png'
        },
        {
            name: 'Giày',
            slug: 'giay',
            sortOder: 3,
            imageCategory: '/category_shoe.png'
        },
        {
            name: 'Mũ',
            slug: 'mu',
            sortOder: 4,
            imageCategory: '/category_hat.png'
        },
        {
            name: 'Tất',
            slug: 'tat',
            sortOder: 5,
            imageCategory: '/category_pairOfSocks.png'
        },
        {
            name: 'Phụ kiện',
            slug: 'phu-kien',
            sortOder: 6,
            imageCategory: '/category_acessory.png'
        }
    ]

    try {
        // Xóa categories cũ
        await Category.deleteMany({})
        
        // Thêm categories mới
        const result = await Category.insertMany(categories)
        console.log(`✅ Đã thêm ${result.length} categories:`)
        result.forEach(cat => {
            console.log(`  - ${cat.name} (${cat.slug})`)
        })
        
        process.exit(0)
    } catch (error) {
        console.error('❌ Lỗi khi seed categories:', error)
        process.exit(1)
    }
}

seedCategories()
