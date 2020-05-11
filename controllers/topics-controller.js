const { fetchAllTopics, insertTopic, deleteTopic } = require('../models/topics-model');

exports.sendAllTopics = (req, res, next) => {

    fetchAllTopics()
        .then((topics) => {

            res.status(200).send({ topics })
        })
        .catch(next);
};

exports.postTopic = (req, res, next) => {
    const { slug, description } = req.body;
    const newTopic = { slug, description }
    insertTopic(newTopic)
        .then((topic) => {
            res.status(201).send({ topic });
        })
        .catch(next);
};

// REMOVING TOPICS - NOT IMPLEMENTED YET

// exports.removeTopic = (req, res, next) => {
//     const { topic_slug } = req.params;
//     console.log(`Sending topic ${topic_slug} to be deleted...`)
//     deleteTopic(topic_slug).then(() => {
//         res.send(204).send();
//     })
//         .catch(next);
// }