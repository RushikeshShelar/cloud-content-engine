import express from "express";
import tweetRoutes from "./routes/tweet";

const app = express();

// Middlewares
app.use(express.json());

// Health Check
app.get('/api/health', (_, res) => {
    res.sendStatus(200);
});

// Routes
app.use("/api/tweet", tweetRoutes);

// Default Route
app.get("/api/hello", (_, res) => {
    res.json({
        message: "Welcome to the X API",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


