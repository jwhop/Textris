const mongoose = require('mongoose');
const tetris = require('../tetris.js');
const gameSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	game_board: String,
	game_seq: [Number],
	cur_piece: Number,
	next_piece: Number, 
	hold_piece: Number,
	piece_rot: Number,
	piece_x: Number, 
	piece_y: Number,
	msg1: String, 
	msg2: String, 
	move: Boolean, 
	run: Boolean, 
	channel: String, 
	is_holding: Boolean, 
	score: Number, 
	interval_length: Number, 
	is_scoring: Boolean, 
	scoring_rows_holder: [Number], 
	last_moves_holder: [String]
	
});

module.exports = mongoose.model('Report', gameSchema);