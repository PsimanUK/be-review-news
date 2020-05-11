const topicsRouter = require('express').Router();

const { sendAllTopics, postTopic } = require('../controllers/topics-controller');
const { handle405s } = require('../errors/error-handlers');

topicsRouter.route('/').get(sendAllTopics).post(postTopic).all(handle405s);
topicsRouter.route('/:topic_slug').all(handle405s)

module.exports = topicsRouter;

// REMOVING TOPICS - NOT IMPLETEMENTED YET

// .delete(removeTopic)