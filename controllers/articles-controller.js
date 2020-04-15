const { fetchArticleById } = require('../models/articles-model')

exports.sendArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
        .then((article) => {
            if (article.length > 0) {
                article = article[0];

                res.status(200).send({ article });
            } else {

                return Promise.reject({ status: 404, msg: 'Invalid article_id!' });
            };

        })
        .catch(next);

};