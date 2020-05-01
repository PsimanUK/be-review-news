const express = require('express');
const app = express();
const cors = require('cors');

const apiRouter = require('./routes/api-router');

app.use(cors());

const { handleCustomErrors, handlePsqlErrors, handle500s, handleInvalidPaths } = require('./errors/error-handlers');

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleInvalidPaths);

// ERROR HANDLERS
app.use(handleCustomErrors)
app.use(handlePsqlErrors);
app.use(handle500s);


module.exports = app;