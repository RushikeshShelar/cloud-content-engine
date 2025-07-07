import axios from 'axios';

export const getUserSub = async (accessToken: string): Promise<string> => {
    try {
        const getUserInfoUrl = "https://api.linkedin.com/v2/userinfo";

        if (!accessToken) {
            throw new Error("LinkedIn Access Token Not Found");
        }

        const response = await axios.get(getUserInfoUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        const userData = response.data;

        if (!userData || !userData.sub) {
            console.log(userData)
            throw new Error("User Data Not Found");
        }
        return userData.sub;

    } catch (error) {
        console.log("[GET USER SUB]:", error);
        return "";
    }
}