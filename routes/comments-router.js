const commentsRouter = require('express').Router();

const { sendUpdatedComment, removeComment } = require('../controllers/comments-controller');

commentsRouter.route('/:comment_id').patch(sendUpdatedComment).delete(removeComment);

module.exports = commentsRouter;