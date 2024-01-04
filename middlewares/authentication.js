const { validateToken } = require("../utils/auth");

function checkForAuthCookie(cookie) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookie];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}

module.exports = {
  checkForAuthCookie,
};
