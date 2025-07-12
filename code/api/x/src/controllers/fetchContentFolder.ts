import path from "path";
import fs, { createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "../utils/client";


const pipe = promisify(pipeline);


/**
 * Fetches all content from a specified folder in an S3 bucket and saves it to a local directory.
 * @param {string} bucketName - The name of the S3 bucket.
 * @param {string} folderPath - The path to the folder in the S3 bucket.
 * @param {string} localFolderPath - The local directory where the content will be saved.
 * @returns {Promise<void>}
 */
export async function fetchContentFolder(bucketName: string, folderPath: string, localFolderPath: string): Promise<void> {
    try {
        // Command to list objects in the specified folder
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: folderPath
        });

        const response = await s3Client.send(command);

        if (!response.Contents || response.Contents.length === 0) {
            throw new Error("[No Content Found in Folder]");
        }

        // Filter out undefined keys and ensure we have valid object keys
        const objectKeys = response.Contents.map((obj) => obj.Key).filter((key) => key !== undefined);

        // Create Promises to fetch each object
        const getObjectPromises = objectKeys.map(async (key) => {
            if (!key || key.endsWith("/")) return; // Skip directories

            // Get each object from S3
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key
            });

            const object = await s3Client.send(command);

            // Define the local file path (where the file will be saved)
            const localFilePath = path.join(localFolderPath, key.replace(folderPath, ""));

            // Ensure the directory exists
            fs.mkdirSync(path.dirname(localFilePath), { recursive: true });

            // Create a write stream to save the file locally
            const writeStream = createWriteStream(localFilePath);
            await pipe(object.Body as NodeJS.ReadableStream, writeStream);
        });

        // Wait for all fetch operations to complete
        await Promise.all(getObjectPromises);

    } catch (error) {
        console.log(`[Error Fetching Content Folder]: ${error}`);
    }
}