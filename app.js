const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticleId } = require('./controllers/get.controller')

app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleId);

app.all('*/*', (req, res) => {
    res.status(404).send({msg: "404: route not found"})
      });

app.use((err, req, res, next) => {
        res.status(400).send({msg: 'Bad request'});
});




module.exports = app;