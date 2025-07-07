import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "../../../.env" });

import postRoutes from "./routes/post";

const app = express();
// Middlewares
app.use(express.json());

// Routes
app.use("/api", postRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Linkedin API",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


