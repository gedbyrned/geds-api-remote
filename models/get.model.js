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
            status: 404,
            msg: `404: route not found`,}
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
