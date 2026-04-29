require('dotenv').config();
const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(rateLimiter);

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("API Gateway Running - Port 3000");
});

app.listen(PORT, () => {
    console.log(`[GATEWAY] Running on http://localhost:${PORT}`);
});