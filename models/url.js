const mongoose = require('mongoose');

var urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var shortenUrl = mongoose.model('shortenUrl', urlSchema);

module.exports = {
  shortenUrl
}
