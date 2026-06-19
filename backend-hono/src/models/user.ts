import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: string;
    address?: string;
    phone?: string;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        address: { type: String, required: false },
        phone: { type: String, required: false },
    },
    { timestamps: true }
)

export const User = mongoose.model<IUser>('User', UserSchema)
