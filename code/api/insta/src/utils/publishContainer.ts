import axios from "axios";

interface PublishContainerOptions {
    igUserId: string;
    creationId: string;
    accessToken: string;
}

export const publishContainer = async ({
    igUserId,
    creationId,
    accessToken
}: PublishContainerOptions) => {
    try {
        const endpoint = `https://graph.facebook.com/v23.0/${igUserId}/media_publish`;

        const params = new URLSearchParams({
            creation_id: creationId,
            access_token: accessToken,
        });

        const response = await axios.post(endpoint, params);

        if (response.status !== 200 || !response.data || !response.data.id) {
            throw new Error("Invalid response from Instagram API");
        }

        return response.data.id; // This is the ID of the published post

    } catch (error) {
        console.log(["Error in publishContainer", error]);

    }
};
