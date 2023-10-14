const getToken = (req) => {
  if (req.headers.authorization != null) {
    return req.headers.authorization.replace('Bearer ', '');
  }
  return null;
};

const isLogin = (req, res, next) => {
  const jwt = require('jsonwebtoken');
  require('dotenv').config();

  const token = getToken(req);
  if (token != null) {
    const secret = process.env.secret;
    try {
      const verify = jwt.verify(token, secret);
      if (verify != null) {
        next();
      }
    } catch (error) {}
  }
  res.status(401).send('authorize fail');
};

module.exports = {
  getToken,
  isLogin,
};
