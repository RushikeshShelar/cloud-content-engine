import express from "express";
import dotenv from "dotenv";


import postRoutes from "./routes/post";

const app = express();
// Middlewares
app.use(express.json());

// Routes
app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the X API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


