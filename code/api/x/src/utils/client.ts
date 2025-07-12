import { SSMClient } from "@aws-sdk/client-ssm"
import { S3Client } from "@aws-sdk/client-s3";
import TwitterApi from 'twitter-api-v2';

import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: path.resolve(__dirname, "../../.env.x.local") });
}

// Environment variables for Twitter API credentials
const X_API_KEY = process.env.X_API_KEY as string;
const X_API_KEY_SECRET = process.env.X_API_KEY_SECRET as string
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN as string
const X_ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET as string

// Environment variables for AWS credentials
const AWS_REGION = process.env.AWS_REGION as string;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
const AWS_ACCESS_KEY_SECRET = process.env.AWS_SECRET_ACCESS_KEY as string;

/**
    * Initialize Twitter API client with user credentials.
    * The client is used to interact with the Twitter API for posting tweets and uploading media.
    * @returns {TwitterApi} An instance of the TwitterApi client configured with user credentials.
    * @throws {Error} If the required environment variables are not set.
    * @description This client is used for read-write operations on Twitter, such as posting tweets
*/
const userClient = new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_KEY_SECRET,

    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_TOKEN_SECRET,
});

/**
 * XClient is the Twitter API client instance used for making requests to the Twitter API.
 * @returns {TwitterApi} The Twitter API client instance configured for read-write operations.
 */
const XClient = userClient.readWrite;


/**
 * AWS S3 Bucket Client 
 * @returns {S3Client} an Instance of AWS S3 Client with Authenicated Secrets
 * @description This client is used to interact with AWS S3 for media uploads and other storage operations.
 */
const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_ACCESS_KEY_SECRET
    }
})


/**
 * AWS SSM Client
 * @returns {SSMClient} an Instance of AWS SSM Client with Authenicated Secrets
 * @description This client is used to interact with AWS SSM for fetching configuration parameters.
 */
const ssmClient = new SSMClient({
    region: AWS_REGION
});


export {
    XClient,
    ssmClient,
    s3Client
};