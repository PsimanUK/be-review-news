const articlesRouter = require('express').Router();
const { sendArticleById, ammendArticleVotes, postComment } = require('../controllers/articles-controller')

articlesRouter.route('/:article_id').get(sendArticleById).patch(ammendArticleVotes);
articlesRouter.route('/:article_id/comments').post(postComment);
module.exports = articlesRouter;