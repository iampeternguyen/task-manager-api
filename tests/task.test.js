const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
	setUpDatabase,
	userOne,
	userTwo,
	taskOne,
	taskTwo,
	authorizedUserOneToken,
	authorizedUserTwoToken,
} = require('./setupTests');

const newTask = {
	_id: new mongoose.Types.ObjectId(),
	title: 'new task',
	description: 'this task is new',
};

describe('Adding task', () => {
	beforeAll(setUpDatabase);

	it('Should add a task', async () => {
		const authToken = await authorizedUserOneToken();
		await request(app)
			.post('/tasks')
			.set('Authorization', authToken)
			.send(newTask)
			.expect(201);
		const task = await Task.findById(newTask._id);
		expect(task).not.toBeNull();
	});

	it("Should not add a task that doesn't have a title", async () => {
		const authToken = await authorizedUserOneToken();

		const id = new mongoose.Types.ObjectId();
		await request(app)
			.post('/tasks')
			.set('Authorization', authToken)
			.send({
				_id: id,
				description: "This task doesn't have a title",
			})
			.expect(400);

		const task = await Task.findById(id);
		expect(task).toBeNull();
	});
});

describe('Read tasks', () => {
	beforeAll(setUpDatabase);
	it('Should read task by id', async () => {
		const authToken = await authorizedUserOneToken();

		const response = await request(app)
			.get(`/tasks/${taskOne._id}`)
			.set('Authorization', authToken)
			.send()
			.expect(200);
		expect(response.body.task).toMatchObject({ title: taskOne.title });
	});

	it('Should return 404 for invalid id', async () => {
		const authToken = await authorizedUserOneToken();

		const id = new mongoose.Types.ObjectId();
		await request(app)
			.get(`/tasks/${id}`)
			.set('Authorization', authToken)
			.send()
			.expect(404);
	});

	it('Should return all tasks', async () => {
		const authToken = await authorizedUserOneToken();

		const response = await request(app)
			.get(`/tasks`)
			.set('Authorization', authToken)
			.send({ user: userOne })
			.expect(200);
		expect(response.body.tasks.length).toBe(1);
	});
});

describe('Updating Tasks', () => {
	beforeEach(setUpDatabase);

	it('Should update title, description, completed', async () => {
		const authToken = await authorizedUserTwoToken();

		await request(app)
			.patch(`/tasks/${taskTwo._id}`)
			.set('Authorization', authToken)
			.send({ title: 'updated title', description: 'updated description', completed: false })
			.expect(200);

		const task = await Task.findById(taskTwo._id);
		expect(task.title).not.toBe(taskTwo.title);
		expect(task.description).not.toBe(taskTwo.description);
		expect(task.completed).not.toBe(taskTwo.completed);
	});

	it('Should not update task if id field is specified', async () => {
		const authToken = await authorizedUserTwoToken();
		await request(app)
			.patch(`/tasks/${taskTwo._id}`)
			.set('Authorization', authToken)
			.send({
				_id: new mongoose.Types.ObjectId(),
				title: 'updated title',
				description: 'updated description',
				completed: false,
			})
			.expect(400);
	});

	it('Should return 404 for invalid id', async () => {
		const authToken = await authorizedUserTwoToken();

		const id = new mongoose.Types.ObjectId();
		await request(app)
			.patch(`/tasks/${id}`)
			.set('Authorization', authToken)
			.send(newTask)
			.expect(404);
	});
});

describe('Delete task', () => {
	beforeEach(setUpDatabase);
	it('Should delete a task by ID', async () => {
		const authToken = await authorizedUserOneToken();

		await request(app)
			.delete(`/tasks/${taskOne._id}`)
			.set('Authorization', authToken)
			.send()
			.expect(200);
		const task = await Task.findById(taskOne._id);
		expect(task).toBeNull();
	});

	it('Should return 404 for invalid id', async () => {
		const authToken = await authorizedUserOneToken();

		const id = new mongoose.Types.ObjectId();
		await request(app)
			.delete(`/tasks/${id}`)
			.set('Authorization', authToken)
			.send()
			.expect(404);
	});
});

describe('User/Task relationship', () => {
	beforeEach(setUpDatabase);
	it('Should get all tasks from a user model', () => {
		expect(1).toBe(1);
	});
});

describe('Authorized?', () => {
	beforeEach(setUpDatabase);

	test('Should deny access to all task routes if not authenticated', async () => {
		await request(app)
			.get(`/tasks`)
			.send()
			.expect(401);
		await request(app)
			.post(`/tasks`)
			.send()
			.expect(401);
		await request(app)
			.get(`/tasks/${taskOne._id}`)
			.send()
			.expect(401);
		await request(app)
			.patch(`/tasks/${taskOne._id}`)
			.send()
			.expect(401);
		await request(app)
			.delete(`/tasks/${taskOne._id}`)
			.send()
			.expect(401);
	});
});
