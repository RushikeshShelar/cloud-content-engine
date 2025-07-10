import express from 'express';

import postRoutes from './routes/post';


const app = express();


// Middleware
app.use(express.json());

// Health Check
app.get('/health', (_, res) => {
    res.sendStatus(200)
});

// Routes
app.use("/api/post", postRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Instagram API!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});