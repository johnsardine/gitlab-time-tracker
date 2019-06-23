const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/.netlify/functions/', {
    target: 'http://netlify_lambda:9000/',
    "pathRewrite": {
      "^/\\.netlify/functions": ""
    }
  }));
};
