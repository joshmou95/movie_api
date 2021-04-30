// This is the same key used in the JWTStrategy
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken');
const passport = require('passport');

// local passport file
require('./passport');

// check if the username and password in the body of the request exists in database
const generateJWTToken = (user) => (
  jwt.sign(user, jwtSecret, {
    // This is the username you’re encoding in the JWT
    subject: user.Username,
    // This specifies that the token will expire in 7 days
    expiresIn: '7d',
    // This is the algorithm used to “sign” or encode the values of the JWT
    algorithm: 'HS256',
  })
);

/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: info,
          user,
        });
      }
      return req.login(user, { session: false }, (reqError) => {
        if (reqError) {
          res.send(reqError);
        }
        const token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
