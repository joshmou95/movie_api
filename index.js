const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
  
const app = express();

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// let topMovies = require('./movies.js');

let topMovies = [
  {
    title: 'Iron Man',
    description: '',
    director: {
      name: 'Jon Favreau',
      bio: '',
      birthday: '',
      deathday: ''
    },
    genre: {
      name: 'Superhero',
      description: '',
    },
    actors: '',
    imageUrl: '',
    featured: ''
  },
  {
    title: 'The Incredible Hulk',
    description: '',
    director: {
      name: 'Louis Leterrier',
      bio: '',
      birthday: '',
      deathday: ''
    },
    genre: {
      name: 'Superhero',
      description: '',
    },
    actors: '',
    imageUrl: '',
    featured: ''
  },
  {
    title: 'Iron Man 2',
    description: '',
    director: {
      name: 'Jon Favreau',
      bio: '',
      birthday: '',
      deathday: ''
    },
    genre: {
      name: 'Superhero',
      description: '',
    },
    actors: '',
    imageUrl: '',
    featured: ''
  },
  {
    title: 'Thor',
    description: '',
    director: {
      name: 'Kenneth Branagh',
      bio: '',
      birthday: '',
      deathday: ''
    },
    genre: {
      name: 'Superhero',
      description: '',
    },
    actors: '',
    imageUrl: '',
    featured: ''
  },
  {
    title: 'Captain America: The First Avenger',
    description: '',
    director: {
      name: 'Joe Johnston',
      bio: '',
      birthday: '',
      deathday: ''
    },
    genre: {
      name: 'Superhero',
      description: '',
    },
    actors: '',
    imageUrl: '',
    featured: ''
  },
  {
    title: 'Marvel\'s The Avengers',
    description: '',
    director: {
      name: 'Joss Whedon',
      bio: '',
      birthday: '',
      deathday: ''
    },
    genre: {
      name: 'Superhero',
      description: '',
    },
    actors: '',
    imageUrl: '',
    featured: ''
  },
  {
    title: 'Thor: The Dark World',
    description: '',
    director: {
      name: 'Alan Taylor',
      bio: '',
      birthday: '',
      deathday: ''
    },
    genre: {
      name: 'Superhero',
      description: '',
    },
    actors: '',
    imageUrl: '',
    featured: ''
  }
];

let users = [
  {
    id:1,
    username: 'joshmou',
    password: 'wordsalad',
    email: 'me@me.com',
    birthday: '04/02/86'
  }
]

// GET requests - app.METHOD(PATH, HANDLER)
app.get('/', (req, res) => {
  res.send('Welcome to myFlix');
});

// Gets the list of ALL movies, returns json object
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Gets the data on a single movie by title
app.get('/movies/:title', (req, res) => {
  res.send('Sucessful GET request returning data on one movie');
  // search through movie array 
  // res.json(topMovies.find((movie) =>
  // // // return object student.name that matches req.params.name 
  //   { return movie.title === req.params.title }));
});

// Gets data about a genre by title
app.get('/movies/genre/:title', (req, res) => {
  res.send('Sucessful GET request returning genre data on one movie');
});

// Gets data about a director by name
app.get('/movies/director/:name', (req, res) => {
  res.send('Sucessful GET request returning director data on one movie');
});

// Allows new users to register
app.post('/users', (req, res) => {
  // requests a json object holding data about the user
  let newUser = req.body;

  // checks to make sure the json contains a name property
  if (!newUser.username) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    // ID is being assigned to the newUser object
    newUser.id = uuid.v4();
    // adds new element to the array
    users.push(newUser);
    // response a json object holding data that was added
    res.status(201).send(newUser);
  }
});

// allows users to update their user info
app.put('/users/:username', (req, res) => {
    // return object user.username that matches req.params.username
  let user = users.find((user) => { return user.username === req.params.username });

    res.status(201).send('New User name ' + req.params.username + ' was assigned');
});

// allows users add a movie to list of favorites
app.put('/users/:username/:favMovies', (req, res) => {
  // return object user.username that matches req.params.username
let user = users.find((user) => { return user.username === req.params.username });

  res.status(201).send('New movie was added to list of favorites');
});

app.delete('/users/:username/:faveMovies', (req, res) => {
    // return object user.username that matches req.params.username
let user = users.find((user) => { return user.username === req.params.username });

res.status(201).send('Movie was deleted from list of favorites');
});

app.delete('/users/:username', (req, res) => {
  // return object student.id that matches req.params.id 
  let user = users.find((user) => { return user.username === req.params.username });

    res.status(201).send('User ' + req.params.username + ' was deleted.');

});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
