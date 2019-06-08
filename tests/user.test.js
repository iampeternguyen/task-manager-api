const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const { setUpDatabase, userOne, userTwo } = require('./setupTests');

const newUser = {
	_id: new mongoose.Types.ObjectId(),
	name: 'Peter',
	email: 'peter@example.com',
	password: '12345678',
};

describe('Adding Users', () => {
	beforeEach(setUpDatabase);

	test('Should create server and connect successfully at root', async () => {
		await request(app)
			.get('/')
			.send()
			.expect(200);
	});

	test('Should connect to user route and return 201 status for new user', async () => {
		await request(app)
			.post('/users')
			.send(newUser)
			.expect(201);
	});

	test('Should return user that matches orginal', async () => {
		const response = await request(app)
			.post('/users')
			.send(newUser);

		expect(response.body).toMatchObject({ name: newUser.name, email: newUser.email });
	});

	test('Should save user to database', async () => {
		await request(app)
			.post('/users')
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
			.post('/users')
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
			.post('/users')
			.send({
				_id: new mongoose.Types.ObjectId(),
				name: 'Peter',
				email: 'peter@exam@ple.com',
				password: '12345678',
			})
			.expect(400);
	});
});

describe('Reading Users', () => {
	let response;
	beforeEach(async () => {
		await setUpDatabase();
		response = await request(app)
			.get(`/users/${userOne._id}`)
			.send();
	});

	test('Should be able to read user by ID', async () => {
		expect(userOne.email).toBe(response.body.email);
	});

	test('Should not return password', async () => {
		expect(response.body.password).toBeUndefined();
	});

	test('Should return 404 for invalid id', async () => {
		await request(app)
			.get(`/users/${new mongoose.Types.ObjectId()}`)
			.send()
			.expect(404);
	});
});

describe('Updating Users', () => {
	beforeEach(setUpDatabase);

	test('Should be able to update user name, email, and password by id', async () => {
		const userBefore = await User.findById(userOne._id);

		await request(app)
			.patch(`/users/${userOne._id}`)
			.send({ name: 'New Name', email: 'newemail@example.com', password: 'newpass1234' })
			.expect(200);

		const userAfter = await User.findById(userOne._id);

		expect(userBefore.name).not.toBe(userAfter.name);
		expect(userBefore.email).not.toBe(userAfter.email);
		expect(userBefore.password).not.toBe(userAfter.password);
	});

	test('Should not be able to update user id', async () => {
		const userBefore = await User.findOne({ email: userOne.email });
		await request(app)
			.patch(`/users/${userOne._id}`)
			.send({ _id: new mongoose.Types.ObjectId() })
			.expect(400);
		const userAfter = await User.findOne({ email: userOne.email });
		expect(userBefore._id).toEqual(userAfter._id);
	});

	test('Should encrypt password', async () => {
		await request(app)
			.patch(`/users/${userOne._id}`)
			.send({ password: 'newpass1234' })
			.expect(200);
		const user = await User.findById(userOne._id);
		expect(user.password).not.toBe('newpass1234');
	});

	test('Should return 404 for invalid id', async () => {
		await request(app)
			.patch(`/users/${new mongoose.Types.ObjectId()}`)
			.send({ email: 'newemail@example.com' })
			.expect(404);
	});
});

describe('Deleting User', () => {
	beforeEach(setUpDatabase);
	test('Should delete user by id', async () => {
		await request(app)
			.delete(`/users/${userOne._id}`)
			.expect(200);

		const user = await User.findById(userOne._id);
		expect(user).toBeNull();
	});

	test('Should return 404 for invalid id', async () => {
		await request(app)
			.delete(`/users/${new mongoose.Types.ObjectId()}`)
			.send()
			.expect(404);
	});
});
