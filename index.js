const express = require('express');
const validUrl = require('valid-url');
const shortid = require('shortid');
const path = require('path');
const bodyParser = require('body-parser');
const {mongoose} = require('./connect/server.js');

const {shortenUrl} = require('./models/url');

const app = express();
const port = process.env.PORT || 7000;
var url_shortened;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {url_shortened: ''});
});


app.post('/', (req, res) => {
  let url = req.body.url;
  if(validUrl.isUri(url)){
    shortenUrl.findOne({originalUrl: url}, (err, doc) => {
      if(!doc){
        let uniq = shortid.generate();
        let shorturl = uniq;
        let ss = new shortenUrl({
          originalUrl: url,
          shortUrl: shorturl
        });
        ss.save().then((url) => {
          res.render('index', {url_shortened: 'http://localhost:7000/'+url.shortUrl});
        }, (e) => {
          res.status(400).send(e);
        });
      }else{
        res.render('index', {url_shortened: 'http://localhost:7000/'+doc.shortUrl});
      }
    });
  }else{
    res.render('index', {url_shortened: 'Not a valid URL'});
  }
});



app.get('/:encoded', (req, res) => {
  let ghostCode = req.params.encoded;

  shortenUrl.findOne({shortUrl: ghostCode}, (err, doc) => {
    if(doc){
      res.redirect(doc.originalUrl);
    }else{
      res.render('index');
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
