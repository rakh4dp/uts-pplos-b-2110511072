const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    }
};

module.exports = authMiddleware;