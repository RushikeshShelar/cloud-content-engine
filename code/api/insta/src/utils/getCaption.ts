import fs from 'fs';
import path from 'path';

function isUrl(path: string): boolean {
    return path.startsWith('http://') || path.startsWith('https://');
}

export const getCaption = async (url: string): Promise<string> => {
    try {
        if (isUrl(url)) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch caption from URL: ${response.statusText}`);
            }
            const caption = await response.text();
            console.log(caption)
            return caption.trim();
        }

        const captionPath = path.join(url);
        const caption = fs.readFileSync(captionPath, 'utf-8').trim();
        return caption;
    } catch (error) {
        console.log(["Caption File Read Error"], error);
        return '';
    }

}