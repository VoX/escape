const express = require('express')
const path = require('path')

module.exports = function (app) {
    app.use('/assets', express.static(path.join(__dirname, 'public/assets/')))
    app.use(
        '/socket.io',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
        }),
    );
}
