exports.handleCustomErrors = (err, req, res, next) => {
    const { status, msg } = err;
    if (status) {
        res.status(status).send({ msg })
    } else {
        next(err);
    };
};

exports.handlePsqlErrors = (err, req, res, next) => {

    const psqlErrorCodes = {
        '22P02': { status: 400, msg: 'Bad Request!' },
        23502: { status: 400, msg: 'Cannot create entry without the required data!' },
        42703: { status: 400, msg: 'Cannot query a non-existant column!' }
    }

    if (err.code in psqlErrorCodes) {
        const { status, msg } = psqlErrorCodes[err.code];

        res.status(status).send({ msg: msg });
    } else {
        next(err);
    };
};

exports.handle500s = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: 'Internal server error!' });
};

/////////  Non-error handling middleware that can handle errors  /////////////////


exports.handleInvalidPaths = (req, res, next) => {
    res.status(404).send({ msg: 'Invalid Path!' });
};

exports.handle405s = (req, res) => {
    res.status(405).send({ msg: 'Method not allowed' });
};