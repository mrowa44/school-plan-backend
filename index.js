const express = require('express');
const axios = require('axios');
const cors = require('cors');

const URL = 'https://dziekanat.ka.edu.pl/Plany/PlanyTokow/3264';

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
  console.log('Index request');
  res.send('Hello World');
});

// "cache" xD
let cache = {};

function saveCache(documentData) {
  console.log('Saving cache ', new Date());
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
    console.log('Serving cached data ', cacheDate);
    return Promise.resolve(cache.documentData);
  } else {
    console.log('Requesting new data ', now);
    return axios.get(URL, {
      maxRedirects: 0,
    })
      .then(({ data }) => {
        saveCache(data);
        return data;
      })
      .catch((error) => {
        console.log('New data request error ', now, error);
        return cache.documentData; // return old data in case of error
      });
  }
}

app.get('/data', (req, res) => {
  return getData()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log('/data request error', error);
    });
});

console.log('Listening on port 3005.');
app.listen(3005);
