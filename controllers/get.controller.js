const endpoints = require('../endpoints.json');
const { selectTopics, selectArticles, selectArticleId, selectCommentsByArticleId, addComment, updateVotes, selectCommentById, selectUsers} = require('../models/get.model');

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
    const { topic } = req.query;
    selectArticles(topic)
    .then((articles) => {
    res.status(200).send({articles});
        })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id).then((comments) => {
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

exports.patchVotes = (req, res, next) => {
    const { article_id } = req.params;
    const {inc_votes} = req.body;
    Promise.all([
        selectArticleId(article_id),
        updateVotes(article_id, inc_votes)
    ])
    .then(([articleId, article ]) => {
        res.status(202).send({articleId, article});
    })
    .catch(next);
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    selectCommentById(comment_id).then((comment) => {
        res.status(204).send({comment})
})
    .catch(next);
} 

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
     res.status(200).send({users})
    }) 
    .catch(next);
};
