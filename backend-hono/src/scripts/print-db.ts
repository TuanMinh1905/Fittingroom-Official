import mongoose from 'mongoose'
import { connectDB } from '../db/mongoose.js'
import { Product } from '../models/product.js'

async function printDB() {
  await connectDB()
  const products = await Product.find({}, 'name categorySlug imageUrl')
  console.log(JSON.stringify(products, null, 2))
  await mongoose.connection.close()
}

printDB()
