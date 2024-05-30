\c nc_news_test

SELECT * FROM users;



INSERT INTO comments
    (article_id, author, body)
    VALUES
    (3, 'butter_bridge', 'test comment')
    RETURNING *;