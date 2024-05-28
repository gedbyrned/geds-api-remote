const express = require('express')
const app = express()
const { getTopics, getEndpoints } = require('./controllers/topics.controller')

app.use(express.json());

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
    res.status(404).send({msg: "404: route not found"})
});

module.exports = app