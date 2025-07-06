import express from 'express';
import { getChallengeDay } from '../controllers/getDay';
import { downloadFolderFromS3 } from '../controllers/s3Download';
import { getTweetPayload } from '../controllers/getTweetPayload';
import { postTweet } from '../controllers/postTweet';


const router = express.Router();

router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const currentChallengeDay = getChallengeDay("2025-06-10");

        await downloadFolderFromS3(process.env.AWS_S3_BUCKET_NAME as string, `content/day-${currentChallengeDay}/`);

        const payload = await getTweetPayload("../../tmp");

        const tweet = await postTweet(payload);

        if (!tweet) {
            res.status(500).json({ error: 'Failed to create tweet' });
            return;
        }

        res.status(200).json({
            success: true,
            data: tweet
        })

    } catch (error) {
        console.log(['POST ROUTE ERROR'], error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;