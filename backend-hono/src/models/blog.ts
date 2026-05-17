import mongoose, { Schema, Document } from 'mongoose';

export interface Blog extends Document {
    title: string;
    slug: string;
    image: string;
    description: string;
}

const BlogSchema = new Schema<Blog>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
)

export const Blog = mongoose.model<Blog>('Blog', BlogSchema)
