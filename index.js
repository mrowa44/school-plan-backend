const express = require('express');
const axios = require('axios');

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/data', (req, res) => {
  return axios.get('https://dziekanat.ka.edu.pl/Plany/PlanyTokow/3264')
    .then(({ data }) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('dupa', error);
    });
});

app.listen(3000);
