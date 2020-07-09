const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    proxy.createProxyMiddleware({
      target: 'http://10.13.81.189:8001',
      changeOrigin: true,
    })
  );
};