import axios from "axios";
import { createImageContainer } from "./createImageContainer";

export interface CreateCarouselContainerOptions {
    igUserId: string;
    imageUrls: string[];
    caption?: string;
    accessToken: string;
}

export const createCarouselContainer = async ({
    igUserId,
    imageUrls,
    caption,
    accessToken
}: CreateCarouselContainerOptions): Promise<string> => {
    const containerIds: string[] = [];

    for (const imageUrl of imageUrls) {
        const containerId = await createImageContainer({
            igUserId,
            imageUrl,
            caption,
            accessToken,
            isCarouselItem: true
        });
        containerIds.push(containerId);
    }

    const endpoint = `https://graph.facebook.com/v23.0/${igUserId}/media`;
    const params = new URLSearchParams({
        media_type: 'CAROUSEL',
        children: containerIds.join(','),
        access_token: accessToken,
    });

    if (caption) {
        params.append('caption', caption);
    }

    const response = await axios.post(endpoint, params);
    if (response.status !== 200 || !response.data || !response.data.id) {
        throw new Error("Invalid response from Instagram API when creating carousel container");
    }

    return response.data.id;
};