const request = require('supertest')
const seed = require('../db/seeds/seed');

const topicData = require('../db/data/test-data/topics');
const articleData = require('../db/data/test-data/articles');
const userData = require('../db/data/test-data/users');
const commentData = require('../db/data/test-data/comments');

const app = require('../app');
const db = require('../db/connection');
const e = require('express')
const endpointsJSON = require('../endpoints.json');
const comments = require('../db/data/test-data/comments');


afterAll(() => {
    return db.end();
}) 

beforeEach(() => {
    return seed({topicData, articleData, userData, commentData});
})

describe('GET /api/topics', () => {
    test('GET:200 responds with an array of objects, with the property keys of slug and description.', () => {
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
    test('GET:404 route not found', () => {
        return request(app)
        .get('/api/nonsense')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("404: route not found")
        })
    })
})

describe('GET /api', () => {
    test('GET:200 responds with a JSON object with a description of available endpoints', () => {
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
    test('GET:200 responds with a single article object given its ID, with the correct properties', () => {
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
        const articleId = 999;
        return request(app)
          .get(`/api/articles/${articleId}`)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe(`404: article number ${articleId} is not valid`);
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
    test('GET:200 responds with an array of article objects, listed by date in descending order, body property removed and a new comment_count property', () => {
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
            expect(typeof article.votes).toBe('number')
            expect(typeof article.article_img_url).toBe('string')
            expect(typeof article.comment_count).toBe('string') 
        })
        expect(response.body.articles).toBeSortedBy('created_at', {descending: true});    

        })
})

    test('GET:404 route not found', () => {
        return request(app)
        .get('/api/nonsense')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("404: route not found")
        })
    })
}); 

describe('GET /api/articles/:article_id/comments', () => {
    test('GET:200 responds with an array of comments for a given article ID with the correct properties, with the most recent comment first', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
        expect(response.body.comments).toHaveLength(11)

        response.body.comments.forEach((comment) => {
        expect(typeof comment.comment_id).toBe("number")
        expect(typeof comment.votes).toBe('number')
        expect(typeof comment.created_at).toBe('string')
        expect(typeof comment.author).toBe('string')
        expect(typeof comment.body).toBe('string') 
        expect(typeof comment.article_id).toBe('number')
        })
        expect(response.body.comments).toBeSortedBy('created_at', {descending: true});    
    })
})
    test('GET:200 when given a valid article_id but no comment is attached to it', () => {
        const articleIdWithoutComments = 2;
        return request(app)
        .get(`/api/articles/${articleIdWithoutComments}/comments`)
        .expect(200)
        .then((response) => {
            expect(response.body.comments).toEqual([]);
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
        const articleId = 999;
        return request(app)
          .get(`/api/articles/${articleId}`)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe(`404: article number ${articleId} is not valid`);
          });
      });
    
      test('GET:404 sends an appropriate status and error message when given the correct article_id but wrong comment path', () => {
    
        return request(app)
        .get('/api/articles/1/nonsense')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("404: route not found")
        })
    })

})


describe('POST /api/articles/:article_id/comments', () => {
    test('POST:200 adds a comment to an article and responds with the posted comment', () => {
        const newComment = {
            username: "butter_bridge",
            body: "test comment"
        }
        return request(app)
        .post(`/api/articles/3/comments`)
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(Object.keys(response.body.comment)).toHaveLength(6)
            expect(response.body.comment).toHaveProperty('comment_id');
            expect(response.body.comment).toHaveProperty('body', 'test comment');
            expect(response.body.comment).toHaveProperty('article_id', 3);
            expect(response.body.comment).toHaveProperty('author', 'butter_bridge');
            expect(response.body.comment).toHaveProperty('votes', 0);
            expect(response.body.comment).toHaveProperty('created_at');

        })

    })
    test('POST:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        const articleId = 999;
        const newComment = {
            username: "butter_bridge",
            body: "test comment"
        }
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send(newComment)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe(`404: article number ${articleId} is not valid`);
          });
      });
      test('POST:404 sends an appropriate status and error message when given the correct article_id but wrong comment path', () => {
        const newComment = {
            username: "butter_bridge",
            body: "test comment"
        }
        return request(app)
        .post('/api/articles/3/nonsense')
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("404: route not found")
        })
    })
    test('POST:400 sends an appropriate status and error message when given an invalid id', () => {
        const newComment = {
            username: "butter_bridge",
            body: "test comment"
        }
        return request(app)
          .post('/api/articles/notarticle/comments')
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
      test('POST:400 sends an appropriate status and error message when given a valid but not existent author', () => {
        const newComment = {
            username: "GerardByrne",
            body: "test comment"
        }
        return request(app)
          .post('/api/articles/3/comments')
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe(`400:Username ${newComment.username} is invalid`);
          });
      });

    
})

describe('PATCH /api/articles/:article_id', () => {
    test('PATCH:200 for a specified article id, creates an updated vote count based on a passed increment value', () => {
        const articleId = 3;
        const voteInc = 100;
        const patchObj = { inc_votes: voteInc};

        return request(app)
        .get(`/api/articles/${articleId}`)
        .then((response) => {
            const originalVotes = response.body.article.votes;
            return request(app)
            .patch(`/api/articles/${articleId}`)
            .send(patchObj)
            .expect(202)
            .then((response) => {
                const articleUpdate = response.body.article;
                expect(Object.keys(articleUpdate)).toHaveLength(8);

            expect(articleUpdate.votes).toBe(originalVotes + voteInc);
            
            expect(articleUpdate).toHaveProperty("article_id");
            expect(articleUpdate).toHaveProperty("title");
            expect(articleUpdate).toHaveProperty("topic");
            expect(articleUpdate).toHaveProperty("author");
            expect(articleUpdate).toHaveProperty("body");
            expect(articleUpdate).toHaveProperty("created_at");
            expect(articleUpdate).toHaveProperty("votes");
            expect(articleUpdate).toHaveProperty("article_img_url");
            
        })
    })
})
    test('PATCH:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        const articleId = 9999;
        const voteInc = 100;
        const patchObj = { inc_votes: voteInc};
        
        return request(app)
            .patch(`/api/articles/${articleId}`)
            .send(patchObj)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe(`404: article number ${articleId} is not valid`);
            })
    })
    test('PATCH:400 sends an appropriate status and error message when given an invalid id', () => {
        const articleId = "jiggly puff";
        const voteInc = 100;
        const patchObj = { inc_votes: voteInc};
        return request(app)
          .patch(`/api/articles/${articleId}`)
          .send(patchObj)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
      test('PATCH:400 sends an appropriate status and error message when votes increment value is not a number', () => {
        const articleId = 3;
        const voteInc = "watch me whip";
        const patchObj = { inc_votes: voteInc};
        return request(app)
          .patch(`/api/articles/${articleId}`)
          .send(patchObj)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
      });
})


