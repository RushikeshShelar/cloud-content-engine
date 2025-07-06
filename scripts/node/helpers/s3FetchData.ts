import {
    S3Client,
    ListObjectsV2Command,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { createWriteStream, mkdirSync } from "fs";
import { join, dirname } from "path";
import { pipeline } from "stream";
import { promisify } from "util";

import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: join(__dirname, "../../../.env") });
}

const pipe = promisify(pipeline);

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
});

// AWS S3 client config
export async function downloadFolderFromS3(
    bucketName: string,
    prefix: string, // Folder path in S3, like 'content/images/'
    localBasePath: string
) {
    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix,
        });

        const listResult = await s3Client.send(listCommand);

        if (!listResult.Contents || listResult.Contents.length === 0) {
            console.log("No files found in the specified folder.");
            return;
        }

        for (const obj of listResult.Contents) {
            if (!obj.Key || obj.Key.endsWith("/")) continue;

            const getCommand = new GetObjectCommand({
                Bucket: bucketName,
                Key: obj.Key,
            });

            const objectResponse = await s3Client.send(getCommand);

            const relativePath = obj.Key.replace(prefix, "");
            const localFilePath = join(localBasePath, relativePath);
            const dir = dirname(localFilePath);
            mkdirSync(dir, { recursive: true });

            const writeStream = createWriteStream(localFilePath);
            await pipe(objectResponse.Body as NodeJS.ReadableStream, writeStream);

            console.log(`Downloaded: ${obj.Key} → ${localFilePath}`);
        }
    } catch (error) {
        console.log(['BUCKET FETCH ERROR'], error)
    }
}
