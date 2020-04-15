const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');

console.log('Using the api router...');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;