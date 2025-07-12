import { XClient } from "../utils/client";
import { PostTweetPayload, PostTweetResponse } from "../utils/types";

/**
 * Posts a tweet to X (formerly Twitter) with the given payload.
 * @param {XTweetPayload} payload - The payload containing the tweet text and optional media IDs.
 * @returns {Promise<PostTweetResponse | undefined>} - A promise that resolves to the response data or undefined if an error occurs.
 * @throws {Error} - If the text is not provided or if there is an error posting the tweet.
 */
// Note: This function assumes that the XClient is properly configured to interact with the X API
export async function postTweet(payload: PostTweetPayload): Promise<PostTweetResponse | undefined> {
    try {

        const { text, media } = payload;
        // Validate text
        if (!text || typeof text !== 'string') {
            throw new Error("text is required and must be a string.");
        }
        // Validate mediaIds
        if (media && !Array.isArray(media.media_ids)) {
            throw new Error("mediaIds must be an array of strings.");
        }

        // Prepare the tweet payload
        const tweetPayload: any = {
            text: text,
        };

        // Add media IDs if provided
        if (media && media.media_ids.length > 0) {
            tweetPayload.media = media;
        }

        // Post the tweet using the XClient
        const response = await XClient.v2.tweet(tweetPayload);
        if (!response || !response.data) {
            throw new Error("Failed to post tweet. No response data received.");
        }

        return response.data;

    } catch (error) {
        console.log("[Post Tweet Error]", error);
    }
}