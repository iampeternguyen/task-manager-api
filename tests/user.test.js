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
});

describe('Reading Users', () => {
	let response;
	beforeEach(async () => {
		await setUpDatabase();
		response = await request(app)
			.get(`/user/${userOne._id}`)
			.send();
	});

	test('Should be able to read user by ID', async () => {
		expect(userOne.email).toBe(response.body.email);
	});

	test('Should not return password', async () => {
		expect(response.body.password).toBeUndefined();
	});
});

describe('Updating Users', () => {
	beforeEach(setUpDatabase);

	test('Should be able to update user name', async () => {
		const nameBefore = await User.findById(userOne._id).name;
		await request(app)
			.update(`/user/${userOne._id}`)
			.send({ name: 'New Name' });
		const nameAfter = await User.findById(userOne._id).name;
		expect(nameBefore).not.toBe(nameAfter);
	});

	test('Should be able to update user email', async () => {
		const emailBefore = await User.findById(userOne._id).email;
		await request(app)
			.update(`/user/${userOne._id}`)
			.send({ email: 'newemail@example.com' });
		const emailAfter = await User.findById(userOne._id).email;
		expect(emailBefore).not.toBe(emailAfter);
	});

	test('Should be able to update user password', async () => {
		const passwordBefore = await User.findById(userOne._id).password;
		await request(app)
			.update(`/user/${userOne._id}`)
			.send({ password: 'newpass123' });
		const passwordAfter = await User.findById(userOne._id).password;
		expect(passwordBefore).not.toBe(passwordAfter);
	});

	test('Should not be able to update user id', async () => {
		const idBefore = await User.findOne({ email: userOne.email })._id;
		await request(app)
			.update(`/user/${userOne._id}`)
			.send({ name: 'New Name' });
		const idAfter = await User.findOne({ email: userOne.email })._id;
		expect(idBefore).not.toBe(idAfter);
	});
});
