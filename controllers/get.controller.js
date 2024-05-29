const endpoints = require('../endpoints.json');
const { selectTopics, selectArticles, selectArticleId } = require('../models/get.model');

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({endpoints});
};

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    }) .catch((err) => {
    next(err);
  });
}; 

exports.getArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleId(article_id).then((article) => {
        res.status(200).send({article})
})
    .catch(next);
};

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
     res.status(200).send({articles})
    }) 
    .catch(next);
};
