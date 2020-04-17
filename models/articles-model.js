const connection = require('../connection');

exports.fetchAllArticles = ({ sort_by, order, author, topic }) => {
    console.log('Using fetchAllArticles...');

    return connection('articles')
        .select('articles.author', 'title', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes')
        .count('comment_id as comment_count')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .orderBy(sort_by || 'articles.created_at', order || 'asc')
        .modify((authorQuery) => {
            if (author !== undefined) authorQuery.where('articles.author', '=', author)
        })
        .modify((topicQuery) => {
            if (topic !== undefined) topicQuery.where('articles.topic', '=', topic)
        });
};

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

exports.fetchCommentsByArticleId = (articleId, queries) => {
    const { sort_by, order } = queries;
    return connection('comments')
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .where('article_id', '=', articleId)
        .orderBy(sort_by || 'created_at', order || 'asc');

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