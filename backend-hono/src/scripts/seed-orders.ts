import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../db/mongoose.js';
import { Order } from '../models/order.js';
import { Product } from '../models/product.js';

const customerNames = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Châu', 'Phạm Minh Đức', 
  'Hoàng Kim Dung', 'Vũ Quốc Anh', 'Phan Thanh Hải', 'Đỗ Thùy Linh',
  'Ngô Gia Huy', 'Bùi Minh Tuấn', 'Dương Quỳnh Chi', 'Lý Hải Đăng'
];

const phoneNumbers = [
  '0912345678', '0987654321', '0905556667', '0934123456',
  '0978999888', '0945678123', '0963332221', '0951112223'
];

const addresses = [
  '123 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh',
  '456 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh',
  '789 Cầu Giấy, Quận Cầu Giấy, Hà Nội',
  '12 Lê Lợi, Hải Châu, Đà Nẵng',
  '88 Hùng Vương, Ninh Kiều, Cần Thơ',
  '55 Lý Thường Kiệt, TP. Huế, Thừa Thiên Huế',
  '24 Trần Phú, Lộc Thọ, Nha Trang',
  '67 Quang Trung, Gò Vấp, TP. Hồ Chí Minh'
];

const paymentMethods = ['COD', 'VNPay', 'Momo'];
const statuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];

async function seedOrders() {
  try {
    await connectDB();
    console.log('Connected to DB successfully for seeding orders');

    // Xóa đơn hàng cũ
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Lấy danh sách sản phẩm để tạo đơn hàng từ đó
    const products = await Product.find({});
    if (products.length === 0) {
      console.error('No products found in DB! Please run product seeding first (npm run seed).');
      process.exit(1);
    }

    const ordersToInsert = [];
    const now = new Date();
    
    // Tạo khoảng 75 đơn hàng trải rộng trong 12 tháng qua
    for (let i = 0; i < 75; i++) {
      // Tính toán ngày ngẫu nhiên trong vòng 12 tháng qua
      const orderDate = new Date();
      // Ngẫu nhiên lùi lại từ 0 đến 360 ngày
      const daysAgo = Math.floor(Math.random() * 360);
      orderDate.setDate(now.getDate() - daysAgo);
      // Giờ ngẫu nhiên
      orderDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      // Lấy ngẫu nhiên 1 đến 3 sản phẩm khác nhau
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      const selectedProductIndexes = new Set<number>();
      
      while (selectedProductIndexes.size < numItems) {
        selectedProductIndexes.add(Math.floor(Math.random() * products.length));
      }

      let subtotal = 0;
      for (const idx of selectedProductIndexes) {
        const prod = products[idx];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1 hoặc 2 chiếc
        const price = prod.discountPrice || prod.price;
        subtotal += price * quantity;

        orderItems.push({
          productId: prod._id.toString(),
          name: prod.name,
          price: price,
          quantity: quantity,
          imageUrl: prod.imageUrl || ''
        });
      }

      const shippingFee = subtotal > 500000 ? 0 : 30000;
      const totalPrice = subtotal + shippingFee;

      // Trạng thái: 75% thành công, 10% đang xử lý, 8% chờ duyệt, 7% hủy
      const randStatusVal = Math.random();
      let status = 'Delivered';
      if (randStatusVal < 0.08) {
        status = 'Pending';
      } else if (randStatusVal < 0.18) {
        status = 'Processing';
      } else if (randStatusVal < 0.25) {
        status = 'Cancelled';
      }

      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
      const address = addresses[Math.floor(Math.random() * addresses.length)];

      const orderData = {
        customerName,
        phoneNumber,
        address,
        paymentMethod,
        items: orderItems,
        shippingFee,
        totalPrice,
        status,
        createdAt: orderDate,
        updatedAt: orderDate
      };

      ordersToInsert.push(orderData);
    }

    // Insert orders
    const createdOrders = await Order.insertMany(ordersToInsert);
    console.log(`Successfully seeded ${createdOrders.length} orders!`);

    // Đồng bộ số lượng đã bán (soldCount) của các sản phẩm
    console.log('Syncing product soldCount...');
    for (const prod of products) {
      // Tìm tất cả đơn hàng đã giao (Delivered) có chứa sản phẩm này
      const matchingOrders = createdOrders.filter(
        o => o.status === 'Delivered' && o.items.some(item => item.productId === prod._id.toString())
      );
      
      let totalSold = 0;
      for (const order of matchingOrders) {
        const item = order.items.find(it => it.productId === prod._id.toString());
        if (item) {
          totalSold += item.quantity;
        }
      }

      if (totalSold > 0) {
        prod.soldCount = totalSold;
        await prod.save();
      }
    }
    console.log('Syncing product soldCount completed.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders();
