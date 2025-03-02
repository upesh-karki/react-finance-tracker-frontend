const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8585',
      changeOrigin: true, // Important for CORS with the proxy
      secure: false // Only for development, set to true in production with https backend
    })
  );
};