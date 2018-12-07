require('dotenv-safe').config();
const express = require('express');
const redis = require('redis');
require('isomorphic-fetch');

const app = express();
const redisClient = redis.createClient(process.env.REDIS_URL);
const port = process.env.PORT || 3666;

const { getBingImage } = require('./bing');

app.get('/', (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.set('Cache-Control', 'public, max-age=86400'); // one day

  if (!req.query.eventTitle) {
    return res.send('');
  }

  const title = req.query.eventTitle;
  const key = `image:${title}`;
  redisClient.get(key, async(err, image) => {
    if (err) {
      res.status(500);
      return res.send();
    }
    console.log(key, image);
    if (!image) {
      image = await getBingImage(title);
      redisClient.set(key, image);
    }

    return res.send(image);
  });
});

app.listen(port, () => console.log(`Running on port ${port}`));
