const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/topics-controller');

console.log('Using the topics router...')

topicsRouter.route('/').get(sendAllTopics);

module.exports = topicsRouter;