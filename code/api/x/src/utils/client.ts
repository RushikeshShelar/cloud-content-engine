import TwitterApi from 'twitter-api-v2';
import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const userClient = new TwitterApi({
    appKey: process.env.X_API_KEY as string,
    appSecret: process.env.X_API_KEY_SECRET as string,

    accessToken: process.env.X_ACCESS_TOKEN as string,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET as string,
});

const XClient = userClient.readWrite;
const twitterBearer = new TwitterApi(process.env.X_BEARER_TOKEN as string);

export { XClient };