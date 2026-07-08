// Đọc giải thích thì bên Product nhé
import mongoose, { Schema, Document } from 'mongoose';

export interface Category extends Document {
    name: string;
    slug: string;
    sortOder: number; // Để hiển thị thứ tự của Category
    imageCategory: string;
    // Nếu có parentSlug → đây là subcategory (ví dụ: ao-thun có parentSlug: "ao")
    // Nếu không có → đây là category cha (ví dụ: Áo, Quần, Giày...)
    parentSlug?: string;
}

const CategorySchema = new Schema<Category>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        sortOder: { type: Number, required: true },
        imageCategory: { type: String, required: false },
        parentSlug: { type: String, required: false, default: null },
    }
)

export const Category = mongoose.model<Category>('Category', CategorySchema)

