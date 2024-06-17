const express = require('express');
const app = express();
const cors = require('cors');
const { getTopics, getEndpoints, getArticleId, getArticles, getCommentsByArticleId, postComment, patchVotes, deleteCommentById, getUsers } = require('./controllers/get.controller')


app.use(cors());
app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleId);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.get('/api/comments/:comment_id', deleteCommentById);
app.get('/api/users', getUsers);


app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchVotes);




app.all('*', (req, res) => {
        res.status(404).send({msg: "404: route not found"})
          });
    
app.use((err, req, res, next) => {
        if (err.status && err.msg) {
          res.status(err.status).send({ msg: err.msg });
        } else next(err);
})

app.use((err, req, res, next) => {
        if (err.code === '22P02') {
          res.status(400).send({ msg: 'Bad request' });
        } else next(err);
      }
);

app.use((err, req, res, next) => {
        res.status(500).send({ msg: 'Internal Server Error' });
      });



module.exports = app;