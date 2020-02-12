const CONTENT_TYPES = require('./contentType');

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', text => {
    data += text;
  });
  req.on('end', () => {
    if(req.headers['content-type'] === CONTENT_TYPES.json) {
      try{
        req.body = JSON.parse(data);
      } catch(err){
        res.statusCode = 400;
        res.end();
        return;
      }
    } 
    next();
  });
};

module.exports = readBody;
