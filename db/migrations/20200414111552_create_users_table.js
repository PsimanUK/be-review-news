
exports.up = function (knex) {
    console.log('Creating the users table...');
    return knex.schema.createTable('users', (usersTable) => {
        usersTable.string('username').primary().unique().notNullable();
        usersTable.string('avatar_url');
        usersTable.string('name').notNullable();
    });
};

exports.down = function (knex) {
    console.log('Removing users table...');
    return knex.schema.dropTable('users');
};
