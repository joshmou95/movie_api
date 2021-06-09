const jwt = require('jsonwebtoken');
const passport = require('passport');
// local passport file
require('./passport');

// This is the same key used in the JWTStrategy
const jwtSecret = 'your_jwt_secret';

// check if the username and password in the body of the request exists in database
const generateJWT = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // Username encoded with JWT
    expiresIn: '7d', // The token will expire in 7 days
    algorithm: 'HS256' // Algorithm used to “sign” or encode the values of the JWT
  });
};

const router = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        res.status(400).json({
          message: info,
          user: user
        });
      }

      req.login(user, { session: false }, err => {
        if (err) {
          res.json({
            message: err
          });
        }
        const token = generateJWT(user.toJSON());
        console.log(token);
        return res.json({ user, token });
      });
    })(req, res);
  });
};

module.exports = router;

// old code POST login.
// module.exports = (router) => {
//   router.post('/login', (req, res) => {
//     passport.authenticate('local', { session: false }, (error, user, info) => {
//       if (error || !user) {
//         return res.status(400).json({
//           message: info,
//           user
//         });
//       }
//       req.login(user, { session: false }, (reqError) => {
//         if (reqError) {
//           res.send(reqError);
//         }
//         const token = generateJWT(user.toJSON());
//         return res.json({ user, token });
//       });
//     })(req, res);
//   });
// };
