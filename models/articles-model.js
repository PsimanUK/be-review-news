const connection = require('../connection');

exports.fetchAllArticles = (sort_by, order, author, topic, limit) => {
    return connection('articles')
        .select('articles.author', 'title', 'articles.article_id', 'topic', 'articles.created_at', 'articles.votes', 'articles.view_count')
        .count('comment_id as comment_count')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .orderBy(sort_by || 'articles.created_at', order || 'desc')
        .modify((limitQuery) => {
            if (limit !== undefined) limitQuery.limit(limit)
        })
        .modify((authorQuery) => {
            if (author !== undefined) authorQuery.where('articles.author', '=', author)
        })
        .modify((topicQuery) => {
            if (topic !== undefined) topicQuery.where('articles.topic', '=', topic)
        });
};

exports.fetchArticleById = (articleId) => {
    return connection('articles')
        .select('articles.author', 'articles.title', 'articles.article_id', 'articles.body', 'articles.topic', 'articles.created_at', 'articles.votes', 'articles.view_count')
        .count('comment_id as comment_count')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', articleId);

};

exports.articleExists = (articleId) => {
    return connection('articles')
        .select('*')
        .where('article_id', '=', articleId)
        .returning('*')
        .then((res) => {
            return res[0];
        })
};

exports.updateArticleById = (articleId, votes, view_count) => {
    return this.articleExists(articleId).then((res) => {

        if (res && votes !== null && view_count === null) {
            return connection('articles')
                .where('article_id', '=', articleId)
                .increment('votes', votes)
                .returning('*')
        } else if (res && votes === null && view_count !== null) {
            return connection('articles')
                .where('article_id', '=', articleId)
                .increment('view_count', view_count)
                .returning('*')
        } else if (votes === null && view_count === null) {
            return connection('articles')
                .where('article_id', '=', articleId)
                .returning('*')
        } else {
            return Promise.reject({ status: 404, msg: 'Article does not exist!' });
        };
    })
};