\c nc_news_test

SELECT * FROM topics;
SELECT * FROM articles;
SELECT * FROM comments;

SELECT articles.author, articles.title, articles.article_id,  articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    (SELECT COUNT(*) FROM comments comments WHERE comments.article_id = articles.article_id) AS comment_count
    FROM articles articles
    ORDER BY articles.created_at DESC;