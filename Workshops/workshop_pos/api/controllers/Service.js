const getToken = (req) => {
  if (req.headers.authorization != null) {
    return req.headers.authorization.replace('Bearer ', '');
  }
  return null;
};

const Service = {
  isLogin: (req, res, next) => {
    const jwt = require('jsonwebtoken');
    require('dotenv').config();

    const token = getToken(req);

    // error if callback
    // if (token != null) {
    //   const secret = process.env.secret;
    //   try {
    //     const verify = jwt.verify(token, secret);
    //     if (verify != null) {
    //       return next();
    //     }
    //   } catch (error) {}
    // }
    // res.status(401).send('authorize fail');

    // must send/next and end
    if (token != null) {
      const secret = process.env.secret;
      try {
        const verify = jwt.verify(token, secret);
        if (verify != null) {
          next();
        }
      } catch (error) {}
    } else {
      res.status(401).send('authorize fail');
    }
  },

  getMemberId: (req) => {
    const jwt = require('jsonwebtoken');

    const token = getToken(req);
    const payload = jwt.decode(token);
    return payload.id;
  },
};

// module.exports = { getToken, isLogin, getMemberId };

module.exports = Service;
