import { XClient } from "../utils/client";
import { XPostPayload } from "../utils/types";

export async function postTweet(payload: XPostPayload) {

    try {
        const { caption, mediaIds } = payload;

        const tweetOptions: any = {
            text: caption,
        }

        if (mediaIds && mediaIds.length > 0) {
            tweetOptions.media = {
                media_ids: mediaIds,
            };
        }

        const tweetResponse = await XClient.v2.tweet(tweetOptions);
        return tweetResponse.data;
    } catch (error) {
        console.log(["TWEET POST ERROR"], error);
    }
}