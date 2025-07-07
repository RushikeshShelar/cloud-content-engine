import axios from "axios";
import fs from "fs";

export const uploadMediaToLinkedIn = async (uploadUrl: string, filePath: string, accessToken: string): Promise<void> => {
    try {
        const imageData = fs.readFileSync(filePath);

        const response = await axios.post(uploadUrl, imageData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/octet-stream",
                "X-Restli-Protocol-Version": "2.0.0"
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        console.log('Upload successful:', response.status, response.statusText);
    } catch (error) {
        console.error("[UPLOAD MEDIA ERROR]:", error);
        throw new Error("Failed to upload media to LinkedIn");
    }
}