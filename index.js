const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { CronJob } = require('cron');

// const URL = 'https://dziekanat.ka.edu.pl/Plany/PlanyTokow/3264';
const URL = 'https://dziekanat.ka.edu.pl/Plany/PlanyTokow/3924';

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
      timeout: 15000,
    })
      .then(({ data }) => {
        saveCache(data);
        axios.get('https://hc-ping.com/bb7b0c5c-ffc7-4f41-b12b-b47763d892c0');
        return data;
      })
      .catch((error) => {
        console.log('New data request error ', now, error.code, error.response);
        axios.get('https://hc-ping.com/bb7b0c5c-ffc7-4f41-b12b-b47763d892c0/fail');
        return cache.documentData; // return old data in case of error
      });
  }
}

app.get('/data', (req, res) => {
  return getData()
    .then((data) => {
      if (data) {
        console.log('/data request success');
        res.send(data);
      } else {
        console.log('/data request empty');
        res.send({});
      }
    })
    .catch((error) => {
      console.log('/data request error', error);
    });
});

const cron = new CronJob('10 00 * * * *', getData, null, true, 'Europe/Warsaw');
cron.start();

console.log('Listening on port 3005.');
app.listen(3005);
