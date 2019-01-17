const express = require('express');
const app = express();
app.use(express.static('public'));

app.get('/user-stats', (req, res) => {
  res.sendFile('user-stats.html');
});

app.get('/new-post', (req, res) => {
  res.sendFile('new-post.html');
});

app.listen(process.env.PORT || 8080);