import { Hono } from 'hono';
import { ChannelService } from '@repo/database';
import { z } from 'zod';

export const channelRoutes = new Hono();

// Schema validation
const channelSchema = z.object({
    name: z.string().min(1)
});

// Get all channels (for worker nodes)
channelRoutes.get('/', async (c) => {
    try {
        const channels = await ChannelService.list()
        return c.json({ channels })
    } catch (error) {
        return c.status(500);
    }
});

// Add a new channel
/*channelRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const parsed = channelSchema.parse(body);

        const newChannel = new Channel({ name: parsed.name });
        await newChannel.save();

        return c.json({ success: true, channel: parsed.name });
    } catch (error) {
        return c.json({ error: "Invalid input" }, 400);
    }
});*/
