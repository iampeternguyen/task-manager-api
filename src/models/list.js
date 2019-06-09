const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	project: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Project',
	},
});

const List = mongoose.model('List', listSchema);
module.exports = List;
