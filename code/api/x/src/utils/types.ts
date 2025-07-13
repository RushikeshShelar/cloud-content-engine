/**
 * Represents the payload for posting a tweet.
 * @property {string} text - The text content of the tweet.
 * @property {string[]} [mediaIds] - Optional array of media IDs to attach to
 */
export interface PostTweetPayload {
    text: string;
    media?: {
        media_ids: string[];
    };
}

/** 
 * Represents the response from posting a tweet.
 * This interface defines the structure of the response returned by the postTweet function.
 * @property {string} id - The ID of the posted tweet.
 * @property {string} text - The text content of the posted tweet.
 */
export interface PostTweetResponse {
    id: string;
    text: string;
}