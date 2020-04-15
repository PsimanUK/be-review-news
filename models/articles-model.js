const connection = require('../connection');

exports.fetchArticleById = (articleId) => {
    return connection
        .select('*')
        .from('articles')
        .where('article_id', '=', articleId);

};