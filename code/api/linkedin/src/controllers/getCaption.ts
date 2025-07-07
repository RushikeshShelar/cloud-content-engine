import fs from 'fs';
import path from 'path';

export const getCaption = async (contentDir: string): Promise<string> => {
    try {
        const captionPath = path.join(contentDir, 'captions', 'linkedin.txt');
        const caption = fs.readFileSync(captionPath, 'utf-8').trim();
        return caption;
    } catch (error) {
        console.log(["Caption File Read Error"], error);
        return '';
    }

}