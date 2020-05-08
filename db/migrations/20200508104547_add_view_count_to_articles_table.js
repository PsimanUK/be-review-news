
exports.up = function (knex) {
    return knex.schema.table('articles', (articlesTable) => {
        articlesTable.integer('view_count').defaultTo(0);
    })
};

exports.down = function (knex) {
    return knex.schema.table('articles', (articlesTable) => {
        articlesTable.dropColumn('view_count');
    })
};
