const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/api', '/auth'],
    createProxyMiddleware({
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      ws: false,
      logLevel: 'warn',
      pathRewrite: (path, req) => {
        // Express strips the mount path (req.baseUrl), so we add it back.
        // Example: /auth/dev-login becomes baseUrl=/auth, path=/dev-login → /auth/dev-login
        return `${req.baseUrl}${path}`;
      }
    })
  );
};
