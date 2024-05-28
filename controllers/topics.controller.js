const { selectTopics, selectEndpoints } = require('../models/topics.model')
const endpoints = require('../endpoints.json');

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({endpoints});
};