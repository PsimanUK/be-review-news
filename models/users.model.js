const connection = require('../connection');

exports.fetchUserByUsername = (username) => {
    return connection
        .select('*')
        .from('users')
        .where('username', '=', username);
};