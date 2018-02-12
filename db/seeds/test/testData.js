
exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(() => {
        return knex.raw('ALTER SEQUENCE items_id_seq RESTART WITH 1')
      })
    .then(() => knex('garages').del())
    .then(() => {
      return knex.raw('ALTER SEQUENCE garages_id_seq RESTART WITH 1')
    })
    .then(() => {
      return Promise.all([
        knex('garages').insert({
          name: 'Louisa Barrett',
        }, 'id')
          .then(garageId => {
            return knex('items').insert([
              { name: 'Baby Unicorn', reason: 'Still growing up!', cleanliness: 'Sparkling', garage_id: garageId[0]},
              { name: 'Rusty Old Key', reason: 'What does it unlock?', cleanliness: 'Dusty', garage_id: garageId[0]},
              { name: 'Suspicious Map', reason: 'Too Suspicious', cleanliness: 'Rancid', garage_id: garageId[0]},
              { name: 'Fuzzy Gremlin', reason: 'Not sure when to feed...', cleanliness: 'Sparkling', garage_id: garageId[0]},
              { name: 'Magic Dust Bunny', reason: 'Its magic!', cleanliness: 'Dusty', garage_id: garageId[0]}
            ]);
          })
          .then(() => console.log('seeding finished!'))
          .catch(error => console.log(`error seeding data: ${error}`))
      ]);
    });
};
