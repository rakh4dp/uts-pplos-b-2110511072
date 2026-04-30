require('dotenv').config();
const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(rateLimiter);

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send(`
        <h1>Sistem Donor Darah</h1>
        <h2><a href="/auth/google">Login with Google</a></h2>
    `);
});

app.listen(PORT, () => {
    console.log(`[GATEWAY] Running on http://localhost:${PORT}`);
});