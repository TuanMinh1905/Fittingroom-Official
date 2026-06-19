import { Hono } from 'hono'
import { User } from '../models/user.js'

const auth = new Hono()

auth.post('/login', async (c) => {
    try {
        const body = await c.req.json();
        const { email, password } = body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return c.json({ message: 'User not found' }, 404);
        }
        
        // So sánh password đơn giản theo yêu cầu (chưa cần mã hóa phức tạp)
        if (user.password !== password) {
            return c.json({ message: 'Invalid password' }, 401);
        }
        
        return c.json({ message: 'Login successful', user });
    } catch (error) {
        return c.json({ message: 'Internal server error', error }, 500);
    }
})

auth.post('/register', async (c) => {
    try {
        const body = await c.req.json();
        const { name, email, password } = body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return c.json({ message: 'Email already exists' }, 400);
        }
        
        const user = await User.create({ name, email, password, role: 'user' });
        return c.json({ message: 'Registration successful', user }, 201);
    } catch (error) {
        return c.json({ message: 'Internal server error', error }, 500);
    }
})

export default auth
