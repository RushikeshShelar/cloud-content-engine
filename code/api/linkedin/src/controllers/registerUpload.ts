import axios from "axios";

interface RegisterUploadResponse {
    uploadUrl: string;
    assetId: string;
}

export const registerUpload = async (sub: string, accessToken: string, type: string): Promise<RegisterUploadResponse> => {
    try {
        const registerUploadUrl = "https://api.linkedin.com/v2/assets?action=registerUpload";
        const requestBody = {
            "registerUploadRequest": {
                "recipes": [
                    `urn:li:digitalmediaRecipe:feedshare-${type}`
                ],
                "owner": `urn:li:person:${sub}`,
                "serviceRelationships": [
                    {
                        "relationshipType": "OWNER",
                        "identifier": "urn:li:userGeneratedContent"
                    }
                ]
            }
        }

        const response = await axios.post(registerUploadUrl, requestBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        const asset = response.data.value.asset;
        if (!asset) {
            throw new Error("Asset not found in response");
        }

        const uploadUrl = response.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
        if (!uploadUrl) {
            throw new Error("Upload URL not found in response");
        }

        return { uploadUrl, assetId: asset };

    } catch (error) {
        console.error("[REGISTER UPLOAD ERROR]:", error);
        throw new Error("Failed to register upload");
    }
}