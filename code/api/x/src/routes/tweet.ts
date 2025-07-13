import express from 'express';

import { getContentPath } from '../controllers/getContentpath';
import { fetchContentFolder } from '../controllers/fetchContentFolder';
import { getTweetPayload } from '../controllers/getTweetPayload';
import { postTweet } from '../services/postTweet';

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || '30-days-of-devops'; // Ensure you have a default bucket name

const router = express.Router();

/**
 * Route to post a tweet with content fetched from S3
 * @route POST /api/tweet
 * @param {string} topic - The topic to fetch content for, which corresponds to the S3 folder path.
 * @returns {object} - Returns a success message and the posted tweet
 * @throws {Error} - If the content path is not found, or if there is an error in fetching content or posting the tweet.
 * @description This route fetches content from an S3 bucket based on the provided topic, retrieves the tweet payload, and posts the tweet to X (formerly Twitter).
 */
router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        if (!req.body || !req.body.topic) {
            res.status(400).json({ error: "Request body with 'topic' is required" });
            return;
        }
        // Extract topic from request body
        const { topic } = req.body;
        // Fetch the content path from AWS SSM Parameter Store
        const s3FolderPath = await getContentPath(topic);
        if (!s3FolderPath) {
            res.status(404).json({ error: "Content path not found" });
            return;
        }

        // Define the local content directory
        const localContentDir = `/app/content`;

        // Fetch Content from AWS S3
        await fetchContentFolder(AWS_BUCKET_NAME, s3FolderPath, localContentDir);

        // Get the tweet payload
        const tweetPayload = await getTweetPayload(localContentDir);
        if (!tweetPayload) {
            res.status(404).json({ error: "Error in Fetching Tweet Payload" });
            return;
        }

        const tweet = await postTweet(tweetPayload);
        if (!tweet) {
            res.status(500).json({ error: "Error in Posting Tweet" });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Tweet posted successfully',
            data: tweet
        });
        return

    } catch (error) {
        console.log(['POST ROUTE ERROR'], error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;