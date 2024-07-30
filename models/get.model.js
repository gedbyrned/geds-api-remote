const { use } = require('../app');
const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`SELECT topics.description, topics.slug FROM topics;`)
    .then((result) => {
        return result.rows
    })
};

exports.selectArticleId = (article_id) => {
    return db.query
    (`SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(*) 
    AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {            
            return Promise.reject({
            status : 404,
            msg : `404: article number ${article_id} is not valid`,}
        )}
        return result.rows[0]
    })  
}

exports.selectArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    const validSortByFields = ['created_at', 'comment_count', 'votes'];
    const validOrderValues = ['asc', 'desc'];

    if (!validSortByFields.includes(sort_by)) {
        sort_by = 'created_at';
    }

    if (!validOrderValues.includes(order)) {
        order = 'desc';
    }

    const queryArray = [];
    let queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
        FROM articles
    `;

    if (topic) {
        queryStr += ` WHERE articles.topic = $1`;
        queryArray.push(topic);
    }

    queryStr += ` ORDER BY ${sort_by} ${order};`;

    return db.query(queryStr, queryArray)
        .then((result) => {
            if (result.rows.length === 0 && topic) {
                return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
                    .then((topicResult) => {
                        if (topicResult.rows.length === 0) {
                            return Promise.reject({
                                status: 404,
                                msg: `Topic of ${topic} is invalid`
                            });
                        };
                        return [];
                    });
            };
            return result.rows;
        });
};



exports.selectCommentsByArticleId = () => {
    return db.query(`SELECT * FROM comments;`)
}

exports.selectCommentsByArticleId = (article_id) => {
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

exports.updateVotes = (article_id, inc_votes) => {
    return db.query
    (`UPDATE articles
     SET votes = votes + $2
     WHERE article_id = $1
     RETURNING *;`, 
     [article_id, inc_votes])
    .then((result) => {
        return result.rows[0]
    })

}

exports.selectCommentById = (comment_id) => {
    return db.query(
        `DELETE FROM comments 
         WHERE comment_id = $1 
         RETURNING *;`,
        [comment_id]
    )
    .then((result) => {

    if (result.rowCount === 0) {
         return Promise.reject(
        { status: 404, 
        msg: `404: comment id number ${comment_id} is not valid` });
        }
    });
}

exports.selectUsers = () => {
    return db.query(`SELECT users.username, users.name, users.avatar_url FROM users;`)
    .then((result) => {
        return result.rows
    })
};

