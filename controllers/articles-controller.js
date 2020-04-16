const { fetchArticleById, updateArticleVotes, insertComment } = require('../models/articles-model')

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
    const { inc_votes } = req.body;

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

exports.postComment = (req, res, next) => {

    const { article_id } = req.params;

    insertComment(article_id, req.body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};