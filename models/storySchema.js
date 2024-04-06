const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  promptWords: [{ type: String, required: true }],
  rawTextResponse: { type: String, required: true },
  textEmbedding: [{ type: Number, required: true }]
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;