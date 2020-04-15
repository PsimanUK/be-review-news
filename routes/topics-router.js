const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/topics-controller');

topicsRouter.route('/').get(sendAllTopics);

module.exports = topicsRouter;