const mongoose = require('mongoose');
const tetris = require('../tetris.js');
const scoreSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	score: Number, 
	is_playing: Boolean
});

module.exports = mongoose.model('Scores', scoreSchema);