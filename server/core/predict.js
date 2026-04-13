import fetch from "node-fetch";
import FormData from "form-data";

const MODEL_URL = process.env.PYTHON_API_URL;

export async function predictBuffer(pngBuffer) {
    try {
        console.log("MODEL_URL:", MODEL_URL);

        const form = new FormData();
        form.append("file", pngBuffer, "drawing.png");

        console.log("Sending request to Python...");

        const response = await fetch(MODEL_URL, {
            method: "POST",
            body: form,
            headers: form.getHeaders()
        });

        console.log("Python status:", response.status);

        const text = await response.text();
        console.log("Python raw response:", text);

        if (!response.ok) {
            throw new Error(`Python backend error: ${text}`);
        }

        return JSON.parse(text);

    } catch (err) {
        console.error("Node error:", err);
        throw err; // let the route handler send the 500
    }
}
