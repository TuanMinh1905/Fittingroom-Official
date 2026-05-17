import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../db/mongoose.js'
import { Brand } from '../models/brand.js'
import { Category } from '../models/category.js'
import { Product } from '../models/product.js'

async function seed() {
  await connectDB()

  await Promise.all([
    Brand.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ])

  const brands = await Brand.insertMany([
    {
      name: 'Nike',
      slug: 'nike',
      sortOder: 1,
      description: 'Thuong hieu do the thao va streetwear',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
    {
      name: 'Adidas',
      slug: 'adidas',
      sortOder: 2,
      description: 'Thuong hieu thoi trang the thao quoc te',
      logo: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    },
    {
      name: 'Routine',
      slug: 'routine',
      sortOder: 3,
      description: 'Thuong hieu local brand thoi trang tre',
      logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400',
    },
  ])

  const categories = await Category.insertMany([
    {
      name: 'Thoi trang Nam',
      slug: 'thoi-trang-nam',
      sortOder: 1,
      imageCategory: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400',
    },
    {
      name: 'Thoi trang Nu',
      slug: 'thoi-trang-nu',
      sortOder: 2,
      imageCategory: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    },
    {
      name: 'Giay dep',
      slug: 'giay-dep',
      sortOder: 3,
      imageCategory: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
  ])

  const products = await Product.insertMany([
    {
      name: 'Ao so mi trang',
      price: 299000,
      description: 'Ao so mi form regular mac hang ngay',
      imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
    },
    {
      name: 'Quan jeans xanh',
      price: 499000,
      description: 'Quan jeans ong dung de phoi do',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    },
    {
      name: 'Ao khoac nhe',
      price: 699000,
      description: 'Ao khoac chat lieu nhe, phu hop mua dong',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    },
  ])

  console.log(`Seed completed. brands=${brands.length}, categories=${categories.length}, products=${products.length}`)
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.connection.close()
  })
