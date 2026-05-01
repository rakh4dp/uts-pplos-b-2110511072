const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

const donorProxy = createProxyMiddleware({
    target: process.env.DONOR_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/': '/api/v1/', 
    },
    onProxyReq: (proxyReq, req, res) => {
        if (req.user && req.user.id) {
            proxyReq.setHeader('X-User-Id', req.user.id);
        }
    }
});

router.get('/blood-types', donorProxy);
router.get('/schedules', donorProxy); 

router.use('/donors', authMiddleware, donorProxy); 

module.exports = router;