import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export interface IOrder extends Document {
    userId?: string;
    customerName: string;
    phoneNumber: string;
    address: string;
    paymentMethod: string;
    items: IOrderItem[];
    totalPrice: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: false },
});

const OrderSchema = new Schema<IOrder>({
    userId: { type: String, required: false },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, default: 'COD' },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
