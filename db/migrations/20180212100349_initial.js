
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('garages', (table) => {
      table.increments('id').primary();
      table.string('name');
    }),

    knex.schema.createTable('items', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('reason');
      table.string('cleanliness');
      table.integer('garage_id').unsigned();
      table.foreign('garage_id').references('garages.id');
    })
  ]); //end Promise.all
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items'),
    knex.schema.dropTable('garages')
  ]); //end Promise.all
};
