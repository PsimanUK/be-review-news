
exports.up = function (knex) {
    console.log('Creating the topics table...');
    return knex.schema.createTable('topics', (topicsTable) => {
        topicsTable.text('slug').primary().unique().notNullable();
        topicsTable.text('description').notNullable();
    });
};

exports.down = function (knex) {
    console.log('Removing topics table...');
    return knex.schema.dropTable('topics');
};
