const endpoints = require('../endpoints.json');
const { selectTopics, selectArticles, selectArticleId, selectCommentsById, addComment } = require('../models/get.model');

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({endpoints});
};

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    }) .catch(next);
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

exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsById(article_id).then((comments) => {
     res.status(200).send({ comments })
    }) 
    .catch(next);
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    Promise.all([
        selectArticleId(article_id),
        addComment(article_id, username, body)
    ])
    .then(([articleId, comment]) => {
        res.status(201).send({articleId, comment});
    })
    .catch(next);
}