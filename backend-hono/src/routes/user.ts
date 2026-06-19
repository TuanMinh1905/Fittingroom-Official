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
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name: body.name,
                email: body.email,
                address: body.address,
                phone: body.phone,
            },
            { new: true } // Return the updated document
        );
        
        if (!updatedUser) {
            return c.json({ message: 'User not found' }, 404);
        }
        
        return c.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        return c.json({ message: 'Internal server error', error }, 500);
    }
})

export default user
