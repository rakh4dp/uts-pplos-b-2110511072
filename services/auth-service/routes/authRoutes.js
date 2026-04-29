const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { session: false }), 
    authController.googleCallback
);

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, (req, res) => {
    res.json({ message: 'Akses diterima', user: req.user });
});

module.exports = router;