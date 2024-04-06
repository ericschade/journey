const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  description: { type: String, required: true }
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;