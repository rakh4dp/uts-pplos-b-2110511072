const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 60,
    message: {
        status: 429,
        message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah satu menit'
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

module.exports = limiter;