const usersRouter = require('express').Router();
const { sendUserByUsername } = require('../controllers/users-controller')
const { handle405s } = require('../errors/error-handlers');

usersRouter.route('/:username').get(sendUserByUsername).all(handle405s);

module.exports = usersRouter;