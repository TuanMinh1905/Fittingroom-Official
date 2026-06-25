import { Hono } from 'hono'
import { User } from '../models/user.js'

const user = new Hono()

user.get('/', async (c) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return c.json(users);
    } catch (error) {
        return c.json({ message: 'Internal server error', error }, 500);
    }
})

user.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return c.json({ message: 'User not found' }, 404);
        }
        
        // Kiểm tra và cập nhật mật khẩu nếu có yêu cầu đổi mật khẩu
        if (body.password !== undefined && body.newPassword !== undefined) {
            if (existingUser.password !== body.password) {
                return c.json({ message: 'Mật khẩu hiện tại không chính xác' }, 400);
            }
            existingUser.password = body.newPassword;
        }
        
        // Cập nhật các thông tin khác
        if (body.name !== undefined) existingUser.name = body.name;
        if (body.email !== undefined) existingUser.email = body.email;
        if (body.address !== undefined) existingUser.address = body.address;
        if (body.phone !== undefined) existingUser.phone = body.phone;
        if (body.gender !== undefined) existingUser.gender = body.gender;
        if (body.birthday !== undefined) existingUser.birthday = body.birthday;
        
        const updatedUser = await existingUser.save();
        
        return c.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        return c.json({ message: 'Internal server error', error }, 500);
    }
})

export default user
