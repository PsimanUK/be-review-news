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
    console.log(`${topic_slug} is the topic slug in topicExists`)
    console.log(`This topic slug is a ${typeof topic_slug}.`)
    return connection('topics')
        .select('*')
        .where('slug', '=', topic_slug)
        .returning('*')
        .then((res) => {
            console.log(res, '<-- response from topic exists')
            return res[0];
        })
};

// DLETEING TOPICS - NOT IMPLEMENTED YET

// exports.deleteTopic = (topic_slug) => {
//     console.log(`${topic_slug} is the topic slug in deleteTopic`)
//     return this.topicExists(topic_slug).then((res) => {
//         if (res) {
//             console.log('Connecting to delete topic..')
//             return connection('topics')
//                 .where('slug', '=', topic_slug)
//                 .delete('*')
//         } else {
//             return Promise.reject({ status: 404, msg: 'Topic does not exist!' })
//         }
//     })
// };