import express from 'express';
import { getTweetPayload } from '../controllers/getTweetPayload';
import { postTweet } from '../controllers/postTweet';

import fs from 'fs';
import path from 'path';


const router = express.Router();

router.post('/', async (req: express.Request, res: express.Response) => {
    try {

        const configPath = path.resolve('/app/content/config.json');
        const configRaw = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configRaw);

        const localPath = path.resolve('/app/content', config.path);

        const payload = await getTweetPayload(localPath);

        if (!payload) {
            res.status(500).json({ error: 'Payload generation failed' });
            return;
        }

        const tweet = await postTweet(payload);

        if (!tweet) {
            res.status(500).json({ error: 'Failed to create tweet' });
            return
        }

        res.status(200).json({
            success: true,
            massage: 'Tweet posted successfully',
        });
        return

    } catch (error) {
        console.log(['POST ROUTE ERROR'], error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;