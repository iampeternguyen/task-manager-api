const mongoose = require('mongoose');
const app = require('../src/app'); // keep this here to connect to mongodb
const request = require('supertest');

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

const authorizedUserOneToken = async () => {
	let tokenResponse = await request(app)
		.post('/users/login')
		.send({ email: userOne.email, password: userOne.password });
	const token = tokenResponse.body.token;
	return `Bearer ${token}`;
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
	authorizedUserOneToken,
	userOne,
	userTwo,
	taskOne,
	taskTwo,
};
