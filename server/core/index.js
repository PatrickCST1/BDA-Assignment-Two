import express from "express";
import multer from "multer";
import { predictBuffer } from "./predict.js";
import cors from "cors";

const app = express();
const upload = multer(); // memory storage by default

app.use(cors({
    origin: "http://localhost:4000",
    methods: ["POST", "GET"],
}));


app.post("/predict", upload.single("file"), async (req, res) => {
    console.log("Got request");
    try {
        console.log("req.file:", req.file);

        const pngBuffer = req.file.buffer;
        const result = await predictBuffer(pngBuffer);

        res.json(result);
    } catch (err) {
        console.error("Route error:", err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => {
    console.log("Node server running on http://localhost:3000");
});
