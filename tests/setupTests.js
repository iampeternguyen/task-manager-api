const mongoose = require('mongoose');
const app = require('../src/app'); // keep this here to connect to mongodb
const request = require('supertest');

const User = require('../src/models/user');
const Task = require('../src/models/task');
const Project = require('../src/models/project');
const List = require('../src/models/list');

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

const projectOne = {
	_id: new mongoose.Types.ObjectId(),
	name: 'Project One',
	owner: userOne._id,
};

const projectTwo = {
	_id: new mongoose.Types.ObjectId(),
	name: 'Project One',
	owner: userTwo._id,
};

const listOne = {
	_id: new mongoose.Types.ObjectId(),
	name: 'List one',
	project: projectOne._id,
};

const listTwo = {
	_id: new mongoose.Types.ObjectId(),
	name: 'List one',
	project: projectTwo._id,
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	title: 'task one',
	description: 'this is task one',
	completed: false,
	list: listOne._id,
	display_order: 0,
	owner: userOne._id,
};

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	title: 'task two',
	description: 'this task is set to complete',
	completed: true,
	list: listTwo._id,
	display_order: 0,
	owner: userTwo._id,
};

const authorizedUserOneToken = async () => {
	let tokenResponse = await request(app)
		.post('/users/login')
		.send({ email: userOne.email, password: userOne.password });
	const token = tokenResponse.body.token;
	return `Bearer ${token}`;
};

const authorizedUserTwoToken = async () => {
	let tokenResponse = await request(app)
		.post('/users/login')
		.send({ email: userTwo.email, password: userTwo.password });
	const token = tokenResponse.body.token;
	return `Bearer ${token}`;
};

const setUpDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await Project.deleteMany();
	await List.deleteMany();
	await new User(userOne).save();
	await new User(userTwo).save();
	await new Project(projectOne).save();
	await new Project(projectTwo).save();
	await new List(listOne).save();
	await new List(listTwo).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
};

module.exports = {
	setUpDatabase,
	authorizedUserOneToken,
	authorizedUserTwoToken,
	userOne,
	userTwo,
	taskOne,
	taskTwo,
	projectOne,
	projectTwo,
	listOne,
	listTwo,
};
