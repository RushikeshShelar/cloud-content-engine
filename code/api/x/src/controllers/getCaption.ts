import fs from "fs";

/**
 * Retrieves the caption from a file at the specified path.
 * @param {string} filePath - The path to the file containing the caption.
 * @returns {Promise<string>} - A promise that resolves to the caption text.
 */
export async function getCaption(filePath: string): Promise<string> {
    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    // Read the file content
    const content = fs.readFileSync(filePath, "utf-8");

    return content.trim(); // Return the content as caption, trimming any extra whitespace
}
