const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: String
	
	
});

module.exports = mongoose.model('Report', gameSchema);