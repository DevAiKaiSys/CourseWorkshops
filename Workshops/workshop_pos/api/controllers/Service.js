module.exports = {
  getToken: (req) => {
    return req.headers.authorization.replace('Bearer ', '');
  },
};
