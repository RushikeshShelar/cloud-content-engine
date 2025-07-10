import express from "express";

import postRoutes from "./routes/post";

const app = express();
// Middlewares
app.use(express.json());

// Health Check
app.get('/health', (_, res) => {
    res.sendStatus(200)
});

// Routes
app.use("/api/tweet", postRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the X API",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


