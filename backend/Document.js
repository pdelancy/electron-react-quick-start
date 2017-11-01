const mongoose = require('mongoose');

const Document = mongoose.model('Document', {
  title: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    type: Object
  }
});

module.exports = Document;
