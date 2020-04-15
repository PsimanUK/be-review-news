const { fetchArticleById } = require('../models/articles-model')

exports.sendArticleById = (req, res, next) => {
    const { articleId } = req.params;
    fetchArticleById(articleId)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);

};