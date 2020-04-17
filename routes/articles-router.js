const articlesRouter = require('express').Router();
const { sendAllArticles, sendArticleById, ammendArticleVotes, postComment, sendCommentsByArticleId } = require('../controllers/articles-controller')
const { handle405s } = require('../errors/error-handlers');

articlesRouter.route('/').get(sendAllArticles).all(handle405s);
articlesRouter.route('/:article_id').get(sendArticleById).patch(ammendArticleVotes).all(handle405s);
articlesRouter.route('/:article_id/comments').get(sendCommentsByArticleId).post(postComment).all(handle405s);
module.exports = articlesRouter;