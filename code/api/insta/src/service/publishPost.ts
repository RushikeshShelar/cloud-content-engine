import { createCarouselContainer } from "../utils/createCaraouselContainer";
import { getCaption } from "../utils/getCaption";
import { getPublicS3Urls } from "../utils/getPublicS3Urls";
import { publishContainer } from "../utils/publishContainer";


export const publishPost = async () => {
    const { captionUrl, imageUrls } = await getPublicS3Urls();
    if (!imageUrls || imageUrls.length === 0) {
        throw new Error("Invalid S3 URLs");
    }
    const caption = await getCaption(captionUrl);

    if (!caption) {
        throw new Error("Failed to fetch caption");
    }

    const response = await createCarouselContainer({
        igUserId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID as string,
        imageUrls: imageUrls,
        caption,
        accessToken: process.env.ACCESS_TOKEN as string
    })

    if (!response || response.length === 0) {
        throw new Error("Failed to create image container");
    }

    const publishResponse = await publishContainer({
        igUserId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID as string,
        creationId: response,
        accessToken: process.env.ACCESS_TOKEN as string
    })

    if (!publishResponse) {
        throw new Error("Failed to publish post");
    }

    return {
        containerId: response
    };
}