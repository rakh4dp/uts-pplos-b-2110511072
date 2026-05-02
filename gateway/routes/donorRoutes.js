const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

const donorProxy = createProxyMiddleware({
    target: process.env.DONOR_SERVICE_URL,
    changeOrigin: true,
    autoRewrite: true, 
    hostRewrite: 'localhost:3000', 
    pathRewrite: {
        '^/': '/api/v1/', 
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Accept', 'application/json'); 
        
        if (req.user && req.user.id) {
            proxyReq.setHeader('X-User-Id', String(req.user.id));
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        if (proxyRes.headers['location']) {
            proxyRes.headers['location'] = proxyRes.headers['location'].replace(
                'http://donor-service', 
                'http://localhost:3000'
            );
        }
    }
});

router.get('/blood-types', donorProxy);
router.get('/schedules', donorProxy); 

router.all(/^\/donors(\/.*)?$/, 
    authMiddleware, 
    (req, res, next) => {
        if (req.user && req.user.id) {
            req.headers['x-user-id'] = String(req.user.id);
            req.headers['accept'] = 'application/json'; 
            console.log('ID User dikirim:', req.user.id); 
        }
        next();
    }, 
    donorProxy
);

module.exports = router;