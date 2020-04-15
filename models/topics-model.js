const connection = require('../connection');

exports.fetchAllTopics = () => {
    console.log('Using the topics model to fetchAllTopics...');
    return connection
        .select('*')
        .from('topics')

};