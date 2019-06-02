const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const newUser = {
	_id: new mongoose.Types.ObjectId(),
	name: 'Peter',
	email: 'peter@example.com',
	password: '12345678',
};

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

const setUpDatabase = async () => {
	await User.deleteMany();
	await new User(userOne).save();
	await new User(userTwo).save();
};

beforeEach(setUpDatabase);

test('Should create server and connect successfully at root', async () => {
	await request(app)
		.get('/')
		.send()
		.expect(200);
});

test('Should connect to user route and return 201 status for new user', async () => {
	await request(app)
		.post('/user')
		.send(newUser)
		.expect(201);
});

test('Should return user that matches orginal', async () => {
	const response = await request(app)
		.post('/user')
		.send(newUser);

	expect(response.body).toMatchObject({ name: newUser.name, email: newUser.email });
});

test('Should save user to database', async () => {
	await request(app)
		.post('/user')
		.send(newUser);
	const user = await User.findById(newUser._id);
	expect(user).not.toBeNull();
});

test('Should not save user to database if email already used', async () => {
	const dupUser = {
		_id: new mongoose.Types.ObjectId(),
		name: 'User One',
		email: 'userone@example.com',
		password: '12345678',
	};

	await request(app)
		.post('/user')
		.send(dupUser)
		.expect(400);

	const user = await User.findById(dupUser._id);
	expect(user).toBeNull();
});

test('Should not save password as plaintext', async () => {
	const user = await User.findById(userOne._id);
	expect(userOne.password).not.toBe(user.password);
});

test('Should not add users with invalid emails', async () => {
	await request(app)
		.post('/user')
		.send({
			_id: new mongoose.Types.ObjectId(),
			name: 'Peter',
			email: 'peter@exam@ple.com',
			password: '12345678',
		})
		.expect(400);
});
