const connection = require('../connection');

exports.fetchArticleById = (articleId) => {
    return connection('articles')
        .select('articles.author', 'articles.title', 'articles.article_id', 'articles.body', 'articles.topic', 'articles.created_at', 'articles.votes')
        .count('comment_id as comment_count')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', articleId);

};

exports.updateArticleVotes = (articleId, votes) => {
    return connection('articles')
        .where('article_id', '=', articleId)
        .increment('votes', votes)
        .returning('*')
};

exports.insertComment = (articleId, comment) => {

    const formattedComment = { article_id: articleId.toString(), author: comment.username, body: comment.body };
    return connection('comments')
        .insert(formattedComment)
        .returning('*')
        .then((res) => {

            return res[0];
        });
};