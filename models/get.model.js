const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`SELECT topics.description, topics.slug FROM topics;`)
    .then((result) => {
        return result.rows
    })
};

exports.selectArticleId = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        return result.rows[0]
    })
}

