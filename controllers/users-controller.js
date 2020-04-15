const { fetchUserByUsername } = require('../models/users.model');

exports.sendUserByUsername = (req, res, next) => {
    const { username } = req.params;

    fetchUserByUsername(username)
        .then((user) => {
            console.log(user, '<-- user returned by fetch')
            if (user.length > 0) {
                user = user[0];

                res.status(200).send({ user });
            } else {

                return Promise.reject({ status: 404, msg: 'Invalid Username!' });
            };
        })
        .catch(next);

};