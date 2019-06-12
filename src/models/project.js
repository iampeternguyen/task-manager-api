const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	lists: [
		{
			listIds: {
				type: mongoose.Schema.ObjectId,
				ref: 'List',
			},
		},
	],
	owner: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
});

projectSchema.methods.userIsProjectOwner = function(userId) {
	return this.owner.toString() === userId.toString();
};

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
