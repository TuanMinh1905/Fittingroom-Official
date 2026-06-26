import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: string;
    address?: string;
    phone?: string;
    gender?: string;
    birthday?: string;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false, select: false },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        address: { type: String, required: false },
        phone: { type: String, required: false },
        gender: { type: String, required: false },
        birthday: { type: String, required: false },
    },
    { timestamps: true }
)

// Mã hóa mật khẩu trước khi lưu vào database
UserSchema.pre('save', async function () {
    const user = this;
    if (!user.isModified('password')) return;

    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Phương thức so sánh mật khẩu
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema)
