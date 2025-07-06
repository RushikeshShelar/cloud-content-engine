import fs from 'fs';
import path from 'path';
import { XClient } from '../utils/client';


export async function getTweetPayload(localPath: string): Promise<any> {
    try {

        const contentDir = path.resolve(__dirname, localPath);

        const imagePath = `${contentDir}/canva.png`;

        const caption = fs.readFileSync(`${contentDir}/caption.txt`, 'utf-8').trim();

        const mediaIds = await Promise.all([
            XClient.v1.uploadMedia(imagePath)
        ]);

        return {
            caption,
            mediaIds
        }

    } catch (error) {
        console.log(['GET TWITTER PAYLOAD ERROR'], error);
    }
}
