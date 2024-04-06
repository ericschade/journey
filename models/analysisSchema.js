const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  llmResponse: { type: String, required: true },
  llmTextEmbedding: [{ type: Number, required: true }]
});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;