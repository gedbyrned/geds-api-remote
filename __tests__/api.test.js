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
const endpointsJSON = require('../endpoints.json')


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
            console.log(response.body.article)
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
          .get('/api/articles/')
          .expect(404)
          .then((response) => {
            console.log(response)
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

