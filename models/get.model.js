const { use } = require('../app');
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
        if (result.rows.length === 0) {            
            return Promise.reject({
            status : 404,
            msg : `404: article number ${article_id} is not valid`,}
        )}
        return result.rows[0]
    })  
}

exports.selectArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id,  articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    (SELECT COUNT(*) FROM comments comments WHERE comments.article_id = articles.article_id)
    AS comment_count
    FROM articles articles
    ORDER BY articles.created_at DESC;`)
    .then((result) => {
        return result.rows
    })
};

exports.selectCommentsById = () => {
    return db.query(`SELECT * FROM comments;`)
}

exports.selectCommentsById = (article_id) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id FROM comments
    WHERE article_id = $1 
    ORDER BY created_at DESC`,
    [article_id])
    .then((result) => {
        return result.rows;
    })
}

exports.addComment = (article_id, username, body) => {
    return db.query(`
        SELECT * FROM users 
        WHERE username = $1;
    `, [username])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 400, msg : `400:Username ${username} is invalid` });
        }
         return db.query(`
            INSERT INTO comments 
            (article_id, author, body)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, 
        [article_id, username, body])
        .then((result) => {
            return result.rows[0];
        });
    });
}  