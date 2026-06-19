// Product Schema
import mongoose, { Schema, Document } from 'mongoose';

// Extends là kế thừa từ lớp Document của Mongoose, để có thêm mấy cái thuộc tính như
// _id, createdAt, updatedAt, save(), remove(),....
export interface IProduct extends Document {
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    description: string;
    imageUrl: string;
    categorySlug: string;
    rating: number;
    soldCount: number;
    brand: string;
    expiryDate?: string;
    stock: number;
    shippingInfo: string;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number, required: false },
        description: { type: String, required: true },
        imageUrl: { type: String, required: false },
        categorySlug: { type: String, required: true },
        rating: { type: Number, default: 0 },
        soldCount: { type: Number, default: 0 },
        brand: { type: String, required: true, default: 'TMF' },
        expiryDate: { type: String, required: false },
        stock: { type: Number, default: 100 },
        shippingInfo: { type: String, default: 'Miễn phí vận chuyển' }
    }
)



export const Product = mongoose.model<IProduct>('Product', ProductSchema)



//Tôi đang hiểu rằng cái interface là tạo ra cái kiểu dữ liệu cho Product.
// ProductSchema là ta định nghĩa cái collection ở MongoDB cho Product ( Tức là ta tạo ra một bảng tên là Product với 4 thuộc tính đó bao gồm 3 cột đầu là bắt buộc còn cột cuối không bắt buộc ).
// Mongoose.model() chưa tạo collection ngay. Nó chỉ tạo "bản vẽ" (model).
// tạo Model Product để làm việc với collection products trong MongoDB. - Hiểu sang tạo Object cũng được, OBject có những phương thức như find, create, updateOne, deleteMany để CRUD dữ liệu trong collection products. 
// Model này có sẵn các hàm như find, findById, create, updateOne, deleteMany để CRUD dữ liệu
// Lúc này collection "products" CHƯA có trong MongoDB Compass : const Product = mongoose.model('Product', ProductSchema)
// Lúc này MongoDB mới tạo collection "products" : await Product.create({ name: 'Áo', price: 100000, description: 'Áo đẹp' })
// Tóm lại :
// interface → Kiểu dữ liệu TypeScript (chỉ dùng lúc code, không ảnh hưởng DB)
// Schema → Cấu trúc document trong MongoDB
// model() → Tạo "class" để thao tác với collection (find, create, update, delete)
// Collection thật → Tạo khi insert data đầu tiên

