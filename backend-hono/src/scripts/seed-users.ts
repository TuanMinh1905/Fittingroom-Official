import mongoose from 'mongoose';
import { User } from '../models/user.js';
import dotenv from 'dotenv';
import { connectDB } from '../db/mongoose.js';

dotenv.config();

const users = [
  { name: 'Admin 1', email: 'admin1@tmf.com', password: 'password123', role: 'admin' },
  { name: 'Admin 2', email: 'admin2@tmf.com', password: 'password123', role: 'admin' },
  { name: 'User 1', email: 'user1@tmf.com', password: 'password123', role: 'user' },
  { name: 'User 2', email: 'user2@tmf.com', password: 'password123', role: 'user' },
  { name: 'User 3', email: 'user3@tmf.com', password: 'password123', role: 'user' },
  { name: 'User 4', email: 'user4@tmf.com', password: 'password123', role: 'user' },
  { name: 'User 5', email: 'user5@tmf.com', password: 'password123', role: 'user' },
];

const seedUsers = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Xóa dữ liệu cũ
    await User.deleteMany();
    console.log('Deleted old users');

    // Thêm dữ liệu mới
    await User.insertMany(users);
    console.log('Seeded users successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
