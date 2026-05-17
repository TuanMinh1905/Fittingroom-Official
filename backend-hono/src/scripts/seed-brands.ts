import mongoose from 'mongoose'
import { Brand } from '../models/brand.js'
import { connectDB } from '../db/mongoose.js'

const seedBrands = async () => {
    try {
        await connectDB()
        console.log('Connected to database')

        // Clear existing brands if any
        await Brand.deleteMany({})
        console.log('Cleared existing brands')

        const brands = [
            { name: "Nike", slug: "nike", sortOder: 1, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", description: "Nike Sports & Fashion" },
            { name: "Adidas", slug: "adidas", sortOder: 2, logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", description: "Adidas brand" },
            { name: "Zara", slug: "zara", sortOder: 3, logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg", description: "Zara Fashion" },
            { name: "H&M", slug: "h-and-m", sortOder: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg", description: "H&M Clothing" },
            { name: "Gucci", slug: "gucci", sortOder: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg", description: "Gucci Luxury" },
            { name: "Chanel", slug: "chanel", sortOder: 6, logo: "https://upload.wikimedia.org/wikipedia/en/9/92/Chanel_logo_interlocking_cs.svg", description: "Chanel Fashion" },
            { name: "Louis Vuitton", slug: "louis-vuitton", sortOder: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/d/da/Louis_Vuitton_Logo.svg", description: "Louis Vuitton" },
            { name: "Dior", slug: "dior", sortOder: 8, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Dior_Logo.svg", description: "Christian Dior" },
            { name: "Uniqlo", slug: "uniqlo", sortOder: 9, logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg", description: "Uniqlo LifeWear" },
            { name: "Levi's", slug: "levis", sortOder: 10, logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Levi%27s_logo.svg", description: "Levi's Denim" }
        ]

        await Brand.insertMany(brands)
        console.log(`Successfully seeded ${brands.length} brands!`)

        process.exit(0)
    } catch (error) {
        console.error('Error seeding brands:', error)
        process.exit(1)
    }
}

seedBrands()