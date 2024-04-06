const mongoose = require('mongoose');

const memoriesCollectionSchema = new mongoose.Schema({
  promptWords: [{ type: String, required: true }],
  rawTextResponse: { type: String, required: true },
  textResponseEmbedding: [{ type: Number, required: true }],
  metadataTextResponse: { type: String, required: true },
  metadataTextResponseEmbedding: [{ type: Number, required: true }],
});

const Memory = mongoose.model('memoriesCollection', memoriesCollectionSchema);

module.exports = Memory;