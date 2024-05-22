const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  analysisResult: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Url', urlSchema);
