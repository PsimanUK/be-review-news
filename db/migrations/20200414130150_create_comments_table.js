
exports.up = function (knex) {
    console.log('Creating the comments table...');
    return knex.schema.createTable('comments', (commentsTable) => {
        commentsTable.increments('comment_id').primary();
        commentsTable.string('author').references('users.username').notNullable();
        commentsTable.integer('article_id').references('articles.article_id').notNullable();
        commentsTable.integer('votes').defaultTo(0);
        commentsTable.timestamp('created_at').defaultsTo(knex.fn.now());
        commentsTable.text('body').notNullable();
    });
};

exports.down = function (knex) {
    console.log('Removing comments table...');
    return knex.schema.dropTable('comments');
};
