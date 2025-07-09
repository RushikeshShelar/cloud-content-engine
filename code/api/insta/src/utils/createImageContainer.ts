import axios from "axios";

interface CreateImageContainerOptions {
    igUserId: string;
    imageUrl: string;
    caption?: string;
    accessToken: string;
    isCarouselItem?: boolean;
}

export const createImageContainer = async ({
    igUserId,
    imageUrl,
    caption,
    accessToken,
    isCarouselItem = false }: CreateImageContainerOptions
): Promise<string> => {

    try {
        const endpoint = `https://graph.facebook.com/v23.0/${igUserId}/media`;

        const params = new URLSearchParams({
            image_url: imageUrl,
            media_type: 'IMAGE',
            is_carousel_item: isCarouselItem.toString(), // important if you're later attaching it in a carousel
            access_token: accessToken,
        });

        if (caption) params.append('caption', caption);

        const response = await axios.post(endpoint, params);

        if (!(response.status === 200) || !response.data || !response.data.id) {
            throw new Error("Invalid response from Instagram API");
        }

        return response.data.id;

    } catch (error) {
        console.log(["Error in createImageContainer", error]);
        throw new Error(`Failed to create image container: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

}