const connection = require('../connection');

exports.fetchArticleById = (articleId) => {
    return connection('articles')
        .select('articles.author', 'articles.title', 'articles.article_id', 'articles.body', 'articles.topic', 'articles.created_at', 'articles.votes')
        .count('comment_id as comment_count')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', articleId);

};