const connection = require('../connection');

exports.fetchAllTopics = () => {

    return connection
        .select('*')
        .from('topics')

};

exports.insertTopic = (newTopic) => {
    return connection('topics')
        .insert(newTopic)
        .returning('*')
        .then((res) => {
            return res[0];
        });
};

exports.topicExists = (topic_slug) => {
    return connection('topics')
        .select('*')
        .where('topic_slug', '=', topic_slug)
        .returning('*')
        .then((res) => {
            return res[0];
        })
}

exports.deleteTopic = (topic_slug) => {
    return this.topicExists(topic_slug).then((res) => {
        if (res) {
            return connection('topics')
                .where('topic_slug', '=', topic_slug)
                .delete('*')
        } else {
            return Promise.reject({ status: 404, msg: 'Topic does not exist!' })
        }
    })
};