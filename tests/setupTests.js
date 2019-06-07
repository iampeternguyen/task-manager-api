const mongoose = require('mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/task');

const userOne = {
	_id: new mongoose.Types.ObjectId(),
	name: 'User One',
	email: 'userone@example.com',
	password: '12345678',
};

const userTwo = {
	_id: new mongoose.Types.ObjectId(),
	name: 'User Two',
	email: 'userTwo@example.com',
	password: '12345678',
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	title: 'task one',
	owner: userOne._id,
};

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	title: 'task two',
	description: 'this task is set to complete',
	completed: true,
	owner: userTwo._id,
};

const setUpDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();

	await new User(userOne).save();
	await new User(userTwo).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
};

module.exports = {
	setUpDatabase,
	userOne,
	userTwo,
	taskOne,
	taskTwo,
};
