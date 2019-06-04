const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
