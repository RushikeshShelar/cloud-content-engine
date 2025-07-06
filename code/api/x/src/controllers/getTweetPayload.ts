import fs from 'fs';
import path from 'path';
import { XClient } from '../utils/client';


export async function getTweetPayload(contentDir: string): Promise<{ caption: string; mediaIds: string[] }> {
    try {
        const imagePath = path.join(contentDir, 'canva.png');

        const captionPath = path.join(contentDir, 'captions', 'twitter.txt');

        const caption = fs.readFileSync(captionPath, 'utf-8').trim();

        const mediaId = await XClient.v1.uploadMedia(imagePath);

        return {
            caption,
            mediaIds: [mediaId]
        };

    } catch (error) {
        console.log(['GET TWITTER PAYLOAD ERROR'], error);
        return { caption: '', mediaIds: [] };
    }
}
