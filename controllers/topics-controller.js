const { fetchAllTopics, insertTopic } = require('../models/topics-model');

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