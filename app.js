const express = require('express');
const app = express();

const apiRouter = require('./routes/api-router')

const { handle500s } = require('./errors/error-handlers');

app.use('/api', apiRouter);

// ERROR HANDLERS
app.use(handle500s);


module.exports = app;