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
      return response.status(500).json({ error: `Error getting items: ${error}` });
    });
});

app.post('/api/v1/garages', (request, response) => {
  const garage = request.body;

  for (let requiredParameters of ['name']) {
    if (!garage[requiredParameters]) {
      return response.status(422).json({error: `Missing required parameter ${requiredParameters}.`});
    }
  }

  return database('garages').insert(garage, 'id')
    .then(id => {
      return response.status(201).json({ status: `Success adding garage: ${id}.` });
    })
    .catch(error => {
      return response.status(500).json({ error: `Error adding garage: ${error}.` });
    });
});

app.post('/api/v1/items', (request, response) => {
  const item = request.body;

  for (let requiredParameters of ['name', 'reason', 'cleanliness', 'garage_id']) {
    if (!item[requiredParameters]) {
      return response.status(422).json({error: `Missing required parameter ${requiredParameters}.`});
    }
  }

  return database('items').insert(item, 'id')
    .then(id => {
      return response.status(201).json({ status: `Success adding item: ${id}.` });
    })
    .catch(error => {
      return response.status(500).json({ error: `Error adding item: ${error}.` });
    });
});

app.patch('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  const { cleanliness } = request.body;

  if (!cleanliness) {
    return response.status(422).json({ error: `Error invalid cleanliness: "${cleanliness}".` });
  }

  return database('items').where('id', id).update('cleanliness', cleanliness)
    .then(() => {
      return response.status(200).json({ status: `Successfully updated cleanliness of item #${id}, to '${cleanliness}'.` });
    })
    .catch(error => {
      return response.status(500).json({ error: `Error updating cleanliness of item #${id}: ${error}` });
    });
});

module.exports = app;
