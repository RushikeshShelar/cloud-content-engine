import express from "express";
import { publishPost } from "../service/publishPost";


const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { containerId } = await publishPost();

        return res.status(200).json({
            message: "Post created successfully",
            containerId
        });

    } catch (error) {
        console.log(["Error in POST /api/post", error]);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;