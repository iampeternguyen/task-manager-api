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

listSchema.methods.userIsProjectOwner = async function(userId) {
	const list = this;
	await list.populate('project').execPopulate();
	if (list.project) {
		return list.project.userIsProjectOwner(userId);
	} else {
		return false;
	}
};

const List = mongoose.model('List', listSchema);
module.exports = List;
