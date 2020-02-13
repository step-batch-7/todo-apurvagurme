const query = require('querystring');
const CONTENT_TYPES = require('./contentType');

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', text => {
    data += text;
  });
  req.on('end', () => {
    req.body = data;
    if(req.headers['content-type'] === CONTENT_TYPES.json) {
      try{
        req.body = JSON.parse(req.body);
      } catch(err){
        res.statusCode = 400;
        res.end();
        return;
      }
    }
    if(req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = query.parse(req.body);
    }
    next();
  });
};

module.exports = readBody;
