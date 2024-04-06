const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  name: { type: String, required: false },
  description: { type: String, required: false }
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;