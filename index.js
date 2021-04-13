const express = require('express'),
  morgan = require('morgan');

const app = express();

let topMovies = require('./movies.js');

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
