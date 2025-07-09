import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;
const BASE_PATH = process.env.AWS_S3_BUCKET_BASE_PATH as string;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;
const AWS_REGION = process.env.AWS_REGION as string;

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});



const generateUrls = (key: string): string => {
    return `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

export const getPublicS3Urls = async (): Promise<{
    imageUrls: string[];
    captionUrl: string;
}> => {

    console.log(BUCKET_NAME, BASE_PATH);
    const configPath = path.resolve('/app/content/config.json');
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configRaw);
    const pathToContent = BASE_PATH + '/' + config.path;

    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: pathToContent,
        });

        const response = await s3Client.send(listCommand);

        if (!response.Contents) {
            throw new Error("No contents found in the S3 bucket.");
        }

        const keys = response.Contents.map((obj) => obj.Key!);

        // Filter Keys
        const canvaKey = keys.find(key =>
            key.endsWith('canva.png') || key.endsWith('canva.jpg')
        );

        const captionKey = keys.find(key =>
            key.startsWith(`${BASE_PATH}/${config.path}/captions/instagram.txt`)
        );

        const imageKeys = keys.filter(key =>
            key.startsWith(`${BASE_PATH}/${config.path}/images/`) &&
            (key.endsWith('.jpg') || key.endsWith('.jpeg') || key.endsWith('.png'))
        );

        if (!canvaKey) {
            throw new Error("Canva image not found in the S3 bucket.");
        }
        const imageUrls: string[] = [];

        const canvaUrl = generateUrls(canvaKey);
        imageUrls.push(canvaUrl);
        imageKeys.sort();

        for (const key of imageKeys) {
            const newKey = key.replace(/ /g, "+");
            console.log(newKey);
            const url = generateUrls(newKey);
            imageUrls.push(url);
        }

        const captionUrl = captionKey ? generateUrls(captionKey) : '';

        return {
            imageUrls,
            captionUrl,
        };

    } catch (error) {
        console.log(["S3 FETCH ERROR", error]);
        throw new Error(`Failed to fetch S3 URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }


}