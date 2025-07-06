import TwitterApi from 'twitter-api-v2';
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// TWITTER API KEYS
// These are the keys you get from the Twitter Developer Portal
// Make sure to set them in your .env file
const X_CLIENT_ID = process.env.X_CLIENT_ID || "";
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET || ""

const X_APP_ID = "952493342469705728"

// AWS S3 CLIENT

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    }
});



const userClient = new TwitterApi({
    appKey: process.env.X_API_KEY as string,
    appSecret: process.env.X_API_KEY_SECRET as string,

    accessToken: process.env.X_ACCESS_TOKEN as string,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET as string,
});

const XClient = userClient.readWrite;
const twitterBearer = new TwitterApi(process.env.X_BEARER_TOKEN as string);



export { XClient, s3Client };