import express from 'express';
import { getUserSub } from '../controllers/getUserSub';
import { registerUpload } from '../controllers/registerUpload';

import fs from 'fs';
import path from 'path';
import { postShare } from '../services/postShare';

const router = express.Router();

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN as string;

router.post("/share", async (req, res) => {
    try {
        const { mediaType } = req.body;
        if (!mediaType) {
            res.status(400).json({ error: "Media type is required" });
        }

        await postShare(accessToken, mediaType)

        res.status(200).json({
            success: true,
            message: "Share posted successfully"
        });


        return;
    } catch (error) {
        console.log("[POST SHARE ERROR]:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;