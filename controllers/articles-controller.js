const { fetchAllArticles, fetchArticleById, updateArticleById } = require('../models/articles-model')

exports.sendAllArticles = (req, res, next) => {

    const { sort_by, order, author, topic, limit } = req.query;

    fetchAllArticles(sort_by, order, author, topic, limit)
        .then((articles) => {
            res.status(200).send({ articles });
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

exports.ammendArticleById = (req, res, next) => {
    const { article_id } = req.params;
    let { inc_votes, viewed } = req.body;
    if (!req.body.inc_votes) inc_votes = null;
    if (!req.body.viewed) viewed = null;

    updateArticleById(article_id, inc_votes, viewed)

        .then((article) => {

            article = article[0];

            res.status(200).send({ article });

        })
        .catch(next);

};