const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const Models = require('./models.js');

const Users = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// checks database for a user with the username
// hash any password entered when logging in before comparing it to the password stored in mongoDB
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(`${username}  ${password}`);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, { message: 'Incorrect username.' });
    }

    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, { message: 'Incorrect password.' });
    }

    console.log('finished');
    return callback(null, user);
  });
}));

// Authenticate users based on the JWT submitted
// JWT is extracted from the header of the http request
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => Users.findById(jwtPayload._id)
  .then((user) => callback(null, user))
  .catch((error) => callback(error))));
