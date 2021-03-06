const express = require('express');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

/**
 * use express for http requests
 * @constant app
 */
const app = express();

const allowedOrigins = ['http://localhost:8080', 'http://localhost:4200', 'https://joshmou95.github.io', 'https://myflixdb2000.herokuapp.com', 'http://localhost:1234', 'https://myflixmcu.netlify.app', 'https://myflixmcu.netlify.app/login'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      const message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

const passport = require('passport');
require('./passport');

const Models = require('./models');
require('./auth')(app);

const Movies = Models.Movie;
const Users = Models.User;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(morgan('common'));

/**
 * default error handling
 * @function
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// local database
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// online database
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * GET requests - app.METHOD(PATH, HANDLER)
 * Default landing page
 */
app.get('/', (req, res) => {
  res.status(400).send('Welcome to myFlixDB');
});

/**
 * Gets the list of ALL movies, returns json object
 * @method GET
 * @param {string} endpoint /movies
 * @returns {object} all movies
 */
app.get('/movies',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  });

/**
 * Gets the data on a single movie by title
 * @method GET
 * @param {string} endpoint /movies/:Title
 * @returns {object} movie by title
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((title) => {
      res.json(title);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * Gets data about a genre by name
 * @method GET
 * @param {string} endpoint /movies/genres/:Genre
 * @returns {object} genre name and description
 */
app.get('/movies/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Genre })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * Gets data about a director by name
 * @method GET
 * @param {string} endpoint /movies/director/:Name
 * @returns {object} director name and bio
 */
app.get('/movies/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((director) => {
      res.json(director.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * Get list of all users with token in header
 * @method GET
 * @param {string} endpoint /users
 * @returns {object} users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * Get user info by username with token in header
 * @method GET
 * @param {string} endpoint /users/:Username
 * @returns {object} user
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  // find by username
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/*
expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
} */
/**
 * Allows new users to register
 * @method POST
 * @param {string} endpoint /users
 * @param {object} user ID, Username, Password, Email, Birthday
 * @returns {object} user
 */
app.post('/users',
  // validation logic here for request
  // Username: isLength min 5, isAlphanumeric
  // Password: .not().isEmpty, Email: .isEmail
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // check the validation object for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // hash password entered by the user when registering
    const hashedPassword = Users.hashPassword(req.body.Password);
    // check if username already exists
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
        // if the user is found, send response that it already exists
          return res.status(400).send(`${req.body.Username} already exists`);
        } else {
        // create new user based on Users schema
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((newUser) => { res.status(201).json(newUser); })
            .catch((error) => {
              console.error(error);
              res.status(500).send(`Error: ${error}`);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send(`Error: ${error}`);
      });
  });

/* expect JSON in this format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
} */
/**
 * update a users info by username
 * @method PUT
 * @param {string} endpoint /users/:Username
 * @param {object} User Username, Password, Email, Birthday
 * @returns {object} user
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  // validation logic here for request
  // Username: isLength min 5, isAlphanumeric
  // Password: .not().isEmpty, Email: .isEmail
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    // authorizes that logged in user is the user making changes
    if (req.user.Username !== req.params.Username) {
      return res.status(403).send(`You're not authorized to change ${req.params.Username} info`);
    }
    // check the validation object for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // hash password entered by the user when updating
    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send(`Error: ${err}`);
        } else {
          res.json(updatedUser);
        }
      });
  });

/**
 * allows users add a movie to list of favorites
 * @method POST
 * @param {string} endpoint /users/:Username/Movies/:MovieID
 * @returns {object} User
 */
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // authorizes that logged in user is the user making changes
    if (req.user.Username !== req.params.Username) {
      return res.status(403).send('You\'re not authorized to make changes other users favorites');
    }
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.json(updatedUser);
      }
    });
  }
);

/**
 * allows users to remove a movie from a list of favorites
 * @method DELETE
 * @param {string} endpoint /users/:Username/Movies/:MovieID
 * @returns {object} User
 */
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // authorizes that logged in user is the user making changes
    if (req.user.Username !== req.params.Username) {
      return res.status(403).send('You\'re not authorized to make changes other users favorites');
    }
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.json(updatedUser);
      }
    });
  }
);

/**
 * Delete a user by username
 * @method DELETE
 * @param {string} endpoint /users/:Username
 * @returns {string} res message
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // authorizes that logged in user is the user making changes
    if (req.user.Username !== req.params.Username) {
      return res.status(403).send(`You're not authorized to delete user ${req.params.Username} `);
    }
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(`${req.params.Username} was not found`);
        } else {
          res.status(200).send(`${req.params.Username} was deleted.`);
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * listen for requests
 */
const PORT = process.env.PORT || '8080';
app.set('port', PORT);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CORS enabled web server listening on port: ${PORT}`);
});
