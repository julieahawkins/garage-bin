process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const knex = require('../db/knex');
const server = require('../server');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw error;
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sadpath')
      .then(() => {
        // response.should.have.status(404);
      })
      .catch(error => {
        error.should.have.status(404);
      });
  });
});

describe('API Routes', () => {
  beforeEach((done) => {
    knex.seed.run()
    .then(() => done())
  });

  describe('GET /api/v1/garages', () => {
    it('should return all the garages from the garages table', () => {
      return chai.request(server)
        .get('/api/v1/garages')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.garages.should.be.a('array');
          response.body.garages.length.should.equal(1);
          response.body.garages.every(garage => {
            garage.hasOwnProperty('name') && garage.hasOwnProperty('id')
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/items', () => {
    it('should return all the items from the items table', () => {
      return chai.request(server)
        .get('/api/v1/items')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.items.should.be.a('array');
          response.body.items.length.should.equal(5);
          response.body.items.every(item => {
            item.hasOwnProperty('name') 
            && item.hasOwnProperty('reason') 
            && item.hasOwnProperty('cleanliness')
            && item.hasOwnProperty('garage_id')
            && item.hasOwnProperty('id')
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  
});