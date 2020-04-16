const { fetchAllArticles, fetchArticleById, updateArticleVotes, insertComment, fetchCommentsByArticleId } = require('../models/articles-model')

exports.sendAllArticles = (req, res, next) => {
    console.log('Using sendAllArticles...');
    fetchAllArticles()
        .then((articles) => {
            res.status(200).send({ articles })
        })
        .catch(next);
};

exports.sendArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
        .then((article) => {
            if (article.length > 0) {
                article = article[0];

                res.status(200).send({ article });
            } else {

                return Promise.reject({ status: 404, msg: `Cannot find article for article_id ${article_id}!` });
            };

        })
        .catch(next);

};

exports.ammendArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    let { inc_votes } = req.body;
    if (!req.body.inc_votes) inc_votes = null;


    updateArticleVotes(article_id, inc_votes)

        .then((article) => {

            if (article.length > 0) {
                res.status(200).send(article[0]);
            } else {
                return Promise.reject({ status: 404, msg: `Cannot find article ${article_id} to ammend vote!` });
            };

        })
        .catch(next);

};

exports.sendCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order } = req.query;

    fetchCommentsByArticleId(article_id, { sort_by, order })
        .then((comments) => {
            if (comments.length > 0) res.status(200).send({ comments });
            else return Promise.reject({ status: 404, msg: 'Invalid article_id!' });
        })
        .catch(next);
};

exports.postComment = (req, res, next) => {

    const { article_id } = req.params;

    insertComment(article_id, req.body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};