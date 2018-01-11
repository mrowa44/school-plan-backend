const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001',
    'https://mrowa44.github.io',
  ],
}
app.use(cors(corsOptions));

app.get('/', function (req, res) {
  res.send('Hello World');
});

// "cache" xD
let cache = {};

function saveCache(documentData) {
  console.log('dupa', 'saving cache');
  cache.documentData = documentData;
  cache.date = new Date();
}

function getData() {
  const cacheDate = cache.date;
  const cacheDay = cacheDate && cacheDate.getDate();
  const cacheMonth = cacheDate && cacheDate.getMonth();
  const now = new Date();
  const nowDay = now.getDate();
  const nowMonth = now.getMonth();
  if (cacheDay === nowDay && cacheMonth === nowMonth) {
    console.log('dupa', 'cached data');
    return Promise.resolve(cache.documentData);
  } else {
    console.log('dupa', 'request data');
    return axios.get('https://dziekanat.ka.edu.pl/Plany/PlanyTokow/3264')
      .then(({ data }) => {
        saveCache(data);
        return data;
      });
  }
}

app.get('/data', (req, res) => {
  return getData()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('dupa', error);
    });
});

app.listen(3005);
