const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  analysisResult: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create a model based on the schema
const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
