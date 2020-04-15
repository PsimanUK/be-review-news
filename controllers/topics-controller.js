const { fetchAllTopics } = require('../models/topics-model');

exports.sendAllTopics = (req, res, next) => {

    console.log('Using the topics controller to sendAllTopics...');
    fetchAllTopics()
        .then((allTopics) => {
            console.log(allTopics, '<-- what is being returned by fetchAllTopics')
            res.status(200).send({ allTopics })
        })
        .catch(next);
};