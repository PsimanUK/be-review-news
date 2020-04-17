const commentsRouter = require('express').Router();

const { sendUpdatedComment, removeComment } = require('../controllers/comments-controller');
const { handle405s } = require('../errors/error-handlers');

commentsRouter.route('/:comment_id').patch(sendUpdatedComment).delete(removeComment).all(handle405s);

module.exports = commentsRouter;