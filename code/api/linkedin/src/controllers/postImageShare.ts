import axios from "axios";

export const postImageShare = async (accessToken: string, userSub: string, caption: string, assetId: string): Promise<void> => {
    try {
        const postImageShareUrl = "https://api.linkedin.com/v2/ugcPosts";
        const requestBody = {
            "author": "urn:li:person:" + userSub,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": caption
                    },
                    "shareMediaCategory": "IMAGE",
                    "media": [
                        {
                            "status": "READY",
                            "description": {
                                "text": "DevOps automation post image"
                            },
                            "media": assetId,
                            "title": {
                                "text": "LinkedIn API Image Share"
                            }
                        }
                    ]
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        };

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0"
        };

        const response = await axios.post(postImageShareUrl, requestBody, {
            headers: headers
        });

        if (response.status !== 201) {
            throw new Error(`Failed to post image share: ${response.statusText}`);
        }
        console.log("Image share posted successfully:", response.data);
        return response.data;

    } catch (error) {
        console.log("[POST IMAGE SHARE ERROR]:", error);
    }

}