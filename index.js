const express = require('express'),
  morgan = require('morgan');

const app = express();

let topMovies = { 'TopMovies' : [
  {
    title: 'Iron Man',
    director: 'Jon Favreau'
  },
  {
    title: 'The Incredible Hulk',
    director: 'Louis Leterrier'
  },
  {
    title: 'Iron Man 2',
    director: 'Jon Favreau'
  },
  {
    title: 'Thor',
    director: 'Kenneth Branagh'
  },
  {
    title: 'Captain America: The First Avenger',
    director: 'Joe Johnston'
  },
  {
    title: 'Marvel\'s The Avengers',
    director: 'Joss Whedon'
  },
  {
    title: 'Thor: The Dark World',
    director: 'Alan Taylor'
  },
  {
    title: 'Captain America: The Winter Soldier',
    director: 'Anthony and Joe Russo'
  },
  {
    title: 'Guardians of the Galaxy',
    director: 'James Gunn'
  },
  {
    title: 'Avengers: Age of Ultron',
    director: 'Joss Whedon'
  }
]};

app.use(express.static('public'));
app.use(morgan('common'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET requests - app.METHOD(PATH, HANDLER)
app.get('/', (req, res) => {
  res.send('Welcome to myFlix');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});





// const http = require('http');
// url = require('url');

// http.createServer((request, response) => {
//   let requestURL = url.parse(request.url, true);
//   if ( requestURL.pathname == '/documentation.html') {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Documentation on the bookclub API.\n');
//   } else {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Welcome to my book club!\n');
//   }

// }).listen(8080);

// console.log('My first Node test server is running on Port 8080.');