const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const database = require('knex')(config);

const requireHTTPS = (request, response, next) => {
  if (request.headers['x-forwarded-proto'] !== 'https') {
    return response.redirect('https://' + request.get('host') + request.url);
  }
  next();
};

if (process.env.NODE_ENV === 'production') {
  app.use(requireHTTPS)
}

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = 'garage-bin';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}. env: ${environment}`);
});

app.get('/api/v1/garages/', (request, response) => {
  return database('garages').select()
    .then(garages => {
      return response.status(200).json({ garages });
    })
    .catch((error) => {
      return response.status(500).json({ error: `Error getting garages: ${error}` });
    });
});

app.get('/api/v1/items/', (request, response) => {
  return database('items').select()
    .then(items => {
      return response.status(200).json({ items });
    })
    .catch(() => {
      return response.status(500).json({ error: `Error getting garages: ${error}` });
    });
});

module.exports = app;
