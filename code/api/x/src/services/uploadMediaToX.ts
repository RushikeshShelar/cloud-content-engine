import { XClient } from "../utils/client";

import { existsSync } from "fs";

/**
 * Uploads media to X (formerly Twitter) and returns the media ID.
 * @param {string} filepath - The path to the media file to be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the media ID.
 */
export async function uploadMediaToX(filepath: string): Promise<string> {
    try {
        // Ensure the file exists
        if (!existsSync(filepath)) {
            throw new Error(`File not found: ${filepath}`);
        }

        const mediaId = await XClient.v1.uploadMedia(filepath);

        return mediaId;

    } catch (error) {
        console.log(['UPLOAD MEDIA TO X ERROR'], error);
        return "";
    }
}