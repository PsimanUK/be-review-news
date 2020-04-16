const articlesRouter = require('express').Router();
const { sendAllArticles, sendArticleById, ammendArticleVotes, postComment, sendCommentsByArticleId } = require('../controllers/articles-controller')

articlesRouter.route('/').get(sendAllArticles);
articlesRouter.route('/:article_id').get(sendArticleById).patch(ammendArticleVotes);
articlesRouter.route('/:article_id/comments').get(sendCommentsByArticleId).post(postComment);
module.exports = articlesRouter;