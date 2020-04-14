
exports.up = function (knex) {
    console.log('Creating the users table...');
    return knex.schema.createTable('users', (usersTable) => {
        usersTable.string('username').primary().unique().notNullable();
        usersTable.string('avatar_url');
        usersTable.string('name').notNullable();
    })
        .then(() => {
            console.log('Creating the topics table...');
            return knex.schema.createTable('topics', (topicsTable) => {
                topicsTable.text('slug').primary().unique().notNullable();
                topicsTable.text('description').notNullable();
            });
        })
        .then(() => {
            console.log('Creating the articles table...');
            return knex.schema.createTable('articles', (articlesTable) => {
                articlesTable.increments('article_id').primary();
                articlesTable.string('title').notNullable();
                articlesTable.text('body').notNullable();
                articlesTable.integer('votes').defaultTo(0);
                articlesTable.string('author').references('users.username').notNullable();
                articlesTable.timestamp('created_at').defaultsTo(knex.fn.now());
            })
        })
        .then(() => {
            console.log('Creating the comments table...');
            return knex.schema.createTable('comments', (commentsTable) => {
                commentsTable.increments('column_id').primary();
                commentsTable.string('author').references('users.username').notNullable();
                commentsTable.integer('article_id').references('articles.article_id').notNullable();
                commentsTable.integer('votes').defaultTo(0);
                commentsTable.timestamp('created_at').defaultsTo(knex.fn.now());
                commentsTable.text('body').notNullable();
            });
        });
};

exports.down = function (knex) {
    console.log('Removing comments table...');
    return knex.schema.dropTable('comments')
        .then(() => {
            console.log('Removing articles table...');
            return knex.schema.dropTable('articles');
        })
        .then(() => {
            console.log('Removing topics table...');
            return knex.schema.dropTable('topics');
        })
        .then(() => {
            console.log('Removing users table...');
            return knex.schema.dropTable('users');
        });
};
