
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table){
    table.increments('id').primary();
    table.string('title',255).notNullable().defaultTo('');
    table.string('author',255).notNullable().defaultTo('');
    table.string('genre').notNullable().defaultTo('');
    table.text('description').notNullable().defaultTo('');
    table.text('cover_url').notNullable().defaultTo('');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
