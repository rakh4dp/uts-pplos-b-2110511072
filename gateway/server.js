require('dotenv').config();
const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');
const authMiddleware = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(rateLimiter);

app.use('/auth', authRoutes);

app.use('/api', donorRoutes);
app.use('/requests', authMiddleware, requestRoutes);

app.get('/', (req, res) => {
    res.send(`
        <h1>Sistem Donor Darah</h1>
        <h2><a href="/auth/google">Login with Google</a></h2>
    `);
});

app.listen(PORT, () => {
    console.log(`[GATEWAY] Running on http://localhost:${PORT}`);
    console.log(`[LOG] Auth: 3001 | Donor: 8000 | Request: 3003`);
});