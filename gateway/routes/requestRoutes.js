const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

const requestProxy = createProxyMiddleware({
    target: process.env.REQUEST_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        if (req.user && req.user.id) {
            proxyReq.setHeader('X-User-Id', req.user.id);
        }
    }
});

router.use('/', requestProxy);
module.exports = router;