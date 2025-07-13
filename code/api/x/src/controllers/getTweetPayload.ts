import fs from 'fs';
import path from 'path';

import { PostTweetPayload } from '../utils/types';
import { getCaption } from './getCaption';
import { uploadMediaToX } from '../services/uploadMediaToX';


/**
 * This function retrieves the tweet payload by reading the caption from a file and uploading media
 * @param localContentDir - The local directory containing content files.
 * @returns {Promise<XTweetPayload>} - A promise that resolves to the tweet payload containing caption and media IDs.
 * @throws {Error} - If the content directory or required files are not found.
 */
export async function getTweetPayload(localContentDir: string): Promise<PostTweetPayload | undefined> {
    try {
        if (!fs.existsSync(localContentDir)) {
            throw new Error(`Content directory not found: ${localContentDir}`);
        }

        const captionFilePath = path.join(localContentDir, 'captions', 'twitter.txt');

        // Check if caption file exists
        if (!fs.existsSync(captionFilePath)) {
            throw new Error(`Caption file not found: ${captionFilePath}`);
        }

        // Retrieve the caption
        const caption = await getCaption(captionFilePath);

        const mediaIds: string[] = [];

        // Upload Gauranteed Canva Image
        const canvaImagePath = path.join(localContentDir, 'canva.png');

        if (!fs.existsSync(canvaImagePath)) {
            throw new Error(`Canva image not found: ${canvaImagePath}`);
        }
        const canvaMediaId = await uploadMediaToX(canvaImagePath);

        if (!canvaMediaId) {
            throw new Error(`Failed to upload Canva image: ${canvaImagePath}`);
        }
        // Add Canva media ID to the list
        mediaIds.push(canvaMediaId);

        // Upload Images from the images directory
        const imagesDir = path.join(localContentDir, 'images');

        // Check if images directory exists
        if (!fs.existsSync(imagesDir)) {
            throw new Error(`Images directory not found: ${imagesDir}`);
        }

        // Get all image files in the images directory
        const imageFiles = fs.readdirSync(imagesDir).filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif';
        });

        if (imageFiles.length > 0) {
            // Upload Images
            imageFiles.sort(); // Sort to ensure consistent order
            for (const img of imageFiles) {
                const imgFilePath = path.join(imagesDir, img);
                const mediaId = await uploadMediaToX(imgFilePath);
                if (mediaId) {
                    mediaIds.push(mediaId);
                } else {
                    console.warn(`Failed to upload media: ${imgFilePath}`);
                }
            }
        }

        // Return the tweet payload
        return {
            text: caption,
            media: {
                media_ids: mediaIds
            }
        };
    } catch (error) {
        console.error("Error getting tweet payload:", error);
    }
}