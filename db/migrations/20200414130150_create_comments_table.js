
exports.up = function (knex) {

    return knex.schema.createTable('comments', (commentsTable) => {
        commentsTable.increments('comment_id');
        commentsTable.string('author').notNullable().references('users.username').notNullable();
        commentsTable.integer('article_id').notNullable().references('articles.article_id').notNullable();
        commentsTable.integer('votes').defaultTo(0);
        commentsTable.timestamp('created_at').defaultsTo(knex.fn.now());
        commentsTable.text('body').notNullable();
    });
};

exports.down = function (knex) {

    return knex.schema.dropTable('comments');
};
