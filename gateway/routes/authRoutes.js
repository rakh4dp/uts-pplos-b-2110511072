const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

const authProxy = createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
    '^/': '/auth/', 
    },
    onProxyReq: (proxyReq, req, res) => {
    }
});

router.use('/', authProxy);

module.exports = router;