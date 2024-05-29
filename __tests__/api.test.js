const request = require('supertest')
const seed = require('../db/seeds/seed');

const topicData = require('../db/data/test-data/topics');
const articleData = require('../db/data/test-data/articles');
const userData = require('../db/data/test-data/users');
const commentData = require('../db/data/test-data/comments');

const app = require('../app');
const db = require('../db/connection');
const e = require('express')
const { TestWatcher } = require('jest');
const endpointsJSON = require('../endpoints.json');
const comments = require('../db/data/test-data/comments');


afterAll(() => {
    return db.end();
}) 

beforeEach(() => {
    return seed({topicData, articleData, userData, commentData});
})

describe('GET /api/topics', () => {
    test('200: responds with an array of objects, with the property keys of slug and description.', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.topics).toHaveLength(3)
            response.body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')
            })
        })

    })
    test('404: route not found', () => {
        return request(app)
        .get('/api/nonsense')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("404: route not found")
        })
    })
})

describe('GET /api', () => {
    test('200: responds with a JSON object with a description of available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
       const { endpoints } = response.body
       expect(endpoints).toEqual(endpointsJSON)
        });
    })
});

describe('GET /api/articles/:article_id', () => {
    test('200: responds with a single article object given its ID, with the correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            expect(response.body.article.article_id).toBe(1);
            expect(response.body.article.topic).toBe('mitch');
            expect(response.body.article.author).toBe('butter_bridge');
            expect(response.body.article.body).toBe('I find this existence challenging');
            expect(response.body.article.created_at).toBe('2020-07-09T20:11:00.000Z');
            expect(response.body.article.votes).toBe(100);
            expect(response.body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');

        
        })
    })
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("404: route not found");
          });
      });
      test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/notarticle')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
})

describe('GET /api/articles', () => {
    test('200: responds with an array of article objects, listed by date in descending order, body property removed and a new comment_count property', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
        expect(response.body.articles).toHaveLength(13)
        response.body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number")
            expect(typeof article.author).toBe('string')
            expect(typeof article.title).toBe('string')
            expect(typeof article.topic).toBe('string')
            expect(typeof article.created_at).toBe('string') 
            // is string of a date
            expect(typeof article.votes).toBe('number')
            expect(typeof article.article_img_url).toBe('string')
            expect(typeof article.comment_count).toBe('string') 
            // is string of a number
        })    

        })
})

    test('404: route not found', () => {
        return request(app)
        .get('/api/nonsense')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("404: route not found")
        })
    })
}); 

describe('GET /api/articles/:article_id/comments', () => {
    test('responds with an array of comments for a given article ID with the correct properties, with the most recent comment first', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
        const { comments } = response.body;
        expect(comments).toHaveLength(11)

        comments.forEach((comment) => {
            console.log(comment)
        expect(typeof comment.comment_id).toBe("number")
        expect(typeof comment.votes).toBe('number')
        expect(typeof comment.created_at).toBe('string')
        expect(typeof comment.author).toBe('string')
        expect(typeof comment.body).toBe('string') 
        expect(typeof comment.article_id).toBe('number')
        })
    })
    })
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/notarticle')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("404: route not found");
          });
      });
    
      test('GET 404: sends an appropriate status and error message when given the correct article_id but wrong comment path', () => {
        return request(app)
        .get('/api/articles/1/nonsense')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("404: route not found")
        })
    })
    
})