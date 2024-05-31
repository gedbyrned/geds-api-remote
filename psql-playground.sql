\c nc_news_test

SELECT topic FROM articles;

SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id) 
    AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = 3
    GROUP BY articles.article_id;