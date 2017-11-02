const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Document = mongoose.model('Document', {
  title: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  contributor: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

module.exports = Document;
