const mongoose = require('mongoose');
const User = require('./user');
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
		owner: {
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: 'User',
		},
		list: {
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: 'List',
		},
		display_order: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

taskSchema.pre('save', async function(next) {
	const task = this;
	if (task.isModified('owner')) {
		const user = await User.findById(task.owner);
		if (!user) {
			throw new Error('invalid owner id');
		} else {
			next();
		}
	}
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
