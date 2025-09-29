
import type { Part } from "@google/genai";

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URI prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
}

export async function fileToGenerativePart(file: File): Promise<Part> {
    const base64EncodedData = await fileToBase64(file);
    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
}
