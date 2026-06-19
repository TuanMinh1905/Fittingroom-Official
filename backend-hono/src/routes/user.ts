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

export default user
