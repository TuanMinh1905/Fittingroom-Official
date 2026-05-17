import mongoose, { Schema, Document } from 'mongoose';

export interface Brand extends Document {
    name: string;
    slug: string;
    sortOder: number; // Để hiển thị thứ tự của Brand, thằng nào bỏ tiền nhiều hơn thì cho lên đầu :))
    description: string; 
    logo: string;
}

const BrandSchema = new Schema<Brand>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        sortOder: { type: Number, required: true },
        description: { type: String, required: false },
        logo: { type: String, required: false },
    }
)

export const Brand = mongoose.model<Brand>('Brand', BrandSchema)

// Đọc giải thích thì bên Product nhé