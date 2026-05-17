// File này để kết nối MongoDB

import mongoose from 'mongoose'

// Mục đích là tạo ra function connectDB để kết nối đến MongoDB. 
// Hàm này sẽ được gọi trong file index.ts để đảm bảo rằng khi server khởi động, nó sẽ kết nối đến MongoDB trước khi xử lý bất kỳ yêu cầu nào.
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/TMFDatabaseOfficial')
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1) // Exit process with failure
    }
}
