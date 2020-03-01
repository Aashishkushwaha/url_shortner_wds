const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const ShortUrl = require('./models/ShortUrl');

const app = express();

//console.log('process.env.USER : ' + process.env.USERNAME, 'process.env.PWD : ' + process.env.PASSWORD);

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@wds-url-shortner-mqve3.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  console.log(shortUrls);
  res.render('index', {shortUrls:shortUrls});
})

app.post('/shortUrl', async (req, res) => {
  await ShortUrl.create({
    longUrl: req.body.longUrl
  })
  res.redirect('/');
  // console.log('long URL : ', req.body.longUrl);
  // res.status(201).json({
  //   longUrl: req.body.longUrl
  // })
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({shortUrl: req.params.shortUrl});
  if (shortUrl == null) return res.status(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.longUrl);
})

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));