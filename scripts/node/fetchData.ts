import path from "path";
import fs from "fs";
import dotenv from "dotenv";

import { getChallengeDay } from "./helpers/dayNumber";
import { downloadFolderFromS3 } from "./helpers/s3FetchData";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });


const STRT_DATE = process.env.START_DATE || "2025-06-10";
const TMP_DIR = path.resolve(__dirname, "../../tmp/shared");

async function main() {
    const day = getChallengeDay(STRT_DATE);
    const s3Prefix = `content/day-${day}/`;
    const targetDir = path.join(TMP_DIR, `day-${day}`);

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
        console.error("AWS_S3_BUCKET_NAME not Defined in .env");
        process.exit(1);
    }

    console.log(`Downloading content for Day ${day} → ${targetDir}`);

    try {
        await downloadFolderFromS3(
            bucketName,
            s3Prefix,
            targetDir
        );

        const config = {
            day,
            path: `day-${day}`,
            date: new Date().toISOString().split("T")[0]
        };

        fs.mkdirSync(TMP_DIR, { recursive: true });
        fs.writeFileSync(path.join(TMP_DIR, "config.json"), JSON.stringify(config, null, 2));

    } catch (error) {
        console.error(["FETCH CONTENT ERROR"], error);
        process.exit(1);
    }
}

main().then(() => {
    console.log("DONE FETCHING CONTENT");
}).catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
});