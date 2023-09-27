const expressJwt = require("express-jwt");

const authJwt = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  isRevoked: isRevoked,
}).unless({
  path: [
    { url: "/api/v1/users/login", method: ["POST", "OPTIONS"] },
    { url: "/api/v1/users/register", method: ["POST", "OPTIONS"] },
    { url: /\/public\/uploads(.*)/, method: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },
    { url: "/api/v1/orders", method: ["GET", "OPTIONS"] },
  ],
});

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    return done(null, true);
  }
  return done();
}

module.exports = authJwt;
