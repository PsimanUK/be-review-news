const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/topics-controller');
const { handle405s } = require('../errors/error-handlers');

topicsRouter.route('/').get(sendAllTopics).all(handle405s);

module.exports = topicsRouter;