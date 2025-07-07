import { getCaption } from "../controllers/getCaption";
import { getUserSub } from "../controllers/getUserSub";
import { postImageShare } from "../controllers/postImageShare";
import { registerUpload } from "../controllers/registerUpload";
import { uploadMediaToLinkedIn } from "../controllers/uploadMedia";

import fs from 'fs';
import path from 'path';

export const postShare = async (accessToken: string, mediaType: string) => {
    try {
        const userSub = await getUserSub(accessToken);

        const { uploadUrl, assetId } = await registerUpload(userSub, accessToken, mediaType);

        const configPath = path.resolve('/app/content/config.json');
        const configRaw = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configRaw);

        const localpath = path.resolve('/app/content/', config.path);

        const caption = await getCaption(localpath);
        const imagePath = path.join(localpath, 'canva.png');

        await uploadMediaToLinkedIn(uploadUrl, imagePath, mediaType);

        const linkedInShare = postImageShare(accessToken, userSub, caption, assetId);
        if (!linkedInShare) {
            throw new Error("Failed to post share on LinkedIn");
        }
        return linkedInShare;

    } catch (error) {
        console.error("[POST SHARE ERROR]:", error);
        throw new Error("Failed to post share on LinkedIn");
    }
}