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
    test('200: responds with an JSON object of a description of available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
       const { endpoints } = response.body
       expect(endpoints).toEqual(endpointsJSON)
        });
    })

})

