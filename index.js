const express = require('express');
const validUrl = require('valid-url');
const shortid = require('shortid');
const path = require('path');
const bodyParser = require('body-parser');
const {mongoose} = require('./connect/server.js');

const {shortenUrl} = require('./models/url');

const app = express();
const port = process.env.PORT || 7000;
const baseUrl = 'http://gho.st/';

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/shorten', (req, res) => {
  var url = req.body.url;
  if(validUrl.isUri(url)){
    //valid url
    var uniq = shortid.generate();
    console.log(uniq);
    var shorturl = baseUrl + uniq;
    console.log(shorturl);
    var ss = new shortenUrl({
      originalUrl: url,
      shortUrl: shorturl
    });
    ss.save().then((url) => {
      res.send(url);
    }, (e) => {
      res.status(400).send(e);
    });

  }else{
    //not a valid url
    res.status(404).send('Not a valid URL');
  }
});

app.get('/:redirect_short', (req, res) => {
  
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
